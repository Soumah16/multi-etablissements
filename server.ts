import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import express, { type NextFunction, type Request, type Response } from 'express';

const PORT = Number(process.env.PORT || 3000);
const HOST = '0.0.0.0';
const IS_PROD = process.env.NODE_ENV === 'production';

// Ephemeral fallback secret if OTP_HMAC_SECRET is not provided in environment
const OTP_SECRET =
  (process.env.OTP_HMAC_SECRET && process.env.OTP_HMAC_SECRET.trim()) ||
  crypto.randomBytes(32).toString('hex');

const DATA_DIR = path.resolve(process.cwd(), '.data');
const COMMS_FILE = path.join(DATA_DIR, 'smartschool-comms.json');
const STATE_FILE = path.join(DATA_DIR, 'smartschool-state.json');

interface OtpChallenge {
  id: string;
  hmac: string;
  channel: 'sms' | 'email';
  purpose: string;
  maskedDestination: string;
  expiresAt: number;
  attempts: number;
  maxAttempts: number;
}

interface StoredCommsData {
  messages: Record<string, unknown>[];
  requests: Record<string, unknown>[];
  blockedIps: string[];
}

interface StateEntry {
  value: unknown;
  updatedAt: number;
}

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const LOCAL_ONLY_STATE_KEYS = new Set<string>([
  'smartschool_current_user',
  'smartschool_workspace_mode',
  'smartschool_language_v1',
  'smartschool_teacher_selected_class_v1',
  'smartschool_parent_selected_child_v1',
  'smartschool_current_school_id',
  'smartschool_single_school_test_v1',
  'smartschool_mode_demo_flag',
  'smartschool_cloud_workspace_id_v1',
  'smartschool_last_activity_v1',
  'smartschool_pending_cloud_keys_v1'
]);

function isValidSyncableStateKey(key: unknown): key is string {
  return (
    typeof key === 'string' &&
    key.startsWith('smartschool_') &&
    key.length <= 160 &&
    !key.endsWith('__ts') &&
    !LOCAL_ONLY_STATE_KEYS.has(key)
  );
}

function canonicalSchoolId(schoolId?: string): string {
  if (!schoolId) return '';
  const trimmed = schoolId.trim();
  const upper = trimmed.toUpperCase();
  if (
    upper === 'ECOLE-001' ||
    trimmed.toLowerCase() === 'sch-gn-ck-001' ||
    upper === 'LEC-CKY'
  ) {
    return 'ECOLE-001';
  }
  return trimmed;
}

const otpChallenges = new Map<string, OtpChallenge>();
const rateLimitStore = new Map<string, RateLimitBucket>();
const sseClients = new Set<Response>();

let memoryStore: StoredCommsData = {
  messages: [],
  requests: [],
  blockedIps: []
};

let stateStore: Record<string, StateEntry> = {};
let stateWriteQueue: Promise<void> = Promise.resolve();

function broadcastSseEvent(eventName: string, payload: unknown): void {
  const frame = `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(frame);
    } catch {
      sseClients.delete(client);
    }
  }
}

async function loadCommsStore(): Promise<StoredCommsData> {
  try {
    const raw = await fs.readFile(COMMS_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<StoredCommsData>;
    memoryStore = {
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      requests: Array.isArray(parsed.requests) ? parsed.requests : [],
      blockedIps: Array.isArray(parsed.blockedIps)
        ? parsed.blockedIps.filter((ip): ip is string => typeof ip === 'string')
        : []
    };
  } catch {
    // First boot or no file yet; keep memoryStore
  }
  return memoryStore;
}

async function persistCommsStore(next: StoredCommsData): Promise<void> {
  memoryStore = next;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmpFile = `${COMMS_FILE}.tmp`;
    await fs.writeFile(tmpFile, JSON.stringify(next, null, 2), 'utf8');
    await fs.rename(tmpFile, COMMS_FILE);
  } catch {
    // Ignore disk persistence errors on read-only environments; memory store remains active
  }
}

async function loadStateStore(): Promise<Record<string, StateEntry>> {
  try {
    const raw = await fs.readFile(STATE_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (parsed && typeof parsed === 'object') {
      const cleaned: Record<string, StateEntry> = {};
      for (const [key, entry] of Object.entries(parsed)) {
        if (
          isValidSyncableStateKey(key) &&
          entry &&
          typeof entry === 'object' &&
          'value' in entry &&
          typeof (entry as { updatedAt?: unknown }).updatedAt === 'number'
        ) {
          cleaned[key] = {
            value: (entry as StateEntry).value,
            updatedAt: (entry as StateEntry).updatedAt
          };
        }
      }
      stateStore = cleaned;
    }
  } catch {
    // First boot or no file yet
  }
  return stateStore;
}

function schedulePersistStateStore(): Promise<void> {
  stateWriteQueue = stateWriteQueue
    .then(async () => {
      try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        const tmpFile = `${STATE_FILE}.tmp`;
        await fs.writeFile(tmpFile, JSON.stringify(stateStore), 'utf8');
        await fs.rename(tmpFile, STATE_FILE);
      } catch {
        // Ignore disk persistence failures on read-only environments
      }
    })
    .catch(() => undefined);
  return stateWriteQueue;
}

function getClientIp(req: Request): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.trim()) {
    return fwd.split(',')[0].trim();
  }
  if (Array.isArray(fwd) && fwd[0]) {
    return fwd[0].trim();
  }
  return req.ip || req.socket.remoteAddress || '0.0.0.0';
}

function maskDestination(channel: 'sms' | 'email', raw: string): string {
  const clean = raw.trim();
  if (channel === 'email') {
    const atIdx = clean.indexOf('@');
    if (atIdx <= 1) return '***@***';
    const local = clean.slice(0, atIdx);
    const domain = clean.slice(atIdx + 1);
    return `${local.slice(0, 2)}${'•'.repeat(Math.max(3, local.length - 2))}@${domain}`;
  }
  const digits = clean.replace(/\s+/g, ' ');
  if (digits.length <= 4) return '••••';
  return `${digits.slice(0, Math.min(6, digits.length - 2))} •••• ${digits.slice(-2)}`;
}

function hashOtp(challengeId: string, code: string): string {
  return crypto.createHmac('sha256', OTP_SECRET).update(`${challengeId}:${code}`).digest('hex');
}

function timingSafeHexEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function cleanExpiredChallenges(): void {
  const now = Date.now();
  for (const [id, ch] of otpChallenges.entries()) {
    if (ch.expiresAt <= now) {
      otpChallenges.delete(id);
    }
  }
}

function createRateLimiter(options: {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = getClientIp(req);
    const bucketKey = `${options.keyPrefix}:${ip}`;
    const now = Date.now();
    let bucket = rateLimitStore.get(bucketKey);

    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + options.windowMs };
      rateLimitStore.set(bucketKey, bucket);
    }

    bucket.count += 1;
    const remaining = Math.max(0, options.maxRequests - bucket.count);
    res.setHeader('X-RateLimit-Limit', String(options.maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(remaining));
    res.setHeader('X-RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > options.maxRequests) {
      res.status(429).json({
        ok: false,
        error: 'Trop de requêtes détectées. Veuillez patienter quelques instants avant de réessayer.'
      });
      return;
    }

    next();
  };
}

async function dispatchRealSms(destination: string, code: string, purpose: string): Promise<'sent' | 'gateway_not_configured' | 'failed'> {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_PHONE_NUMBER?.trim();
  const webhookUrl = process.env.SMS_WEBHOOK_URL?.trim();

  const textBody = `SmartSchool ERP Guinée : Votre code de vérification 2FA (${purpose}) est ${code}. Valide 5 minutes. Ne le partagez jamais.`;

  if (sid && token && from) {
    try {
      const form = new URLSearchParams({ To: destination, From: from, Body: textBody });
      const authHeader = Buffer.from(`${sid}:${token}`).toString('base64');
      const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: form.toString()
      });
      return resp.ok ? 'sent' : 'failed';
    } catch {
      return 'failed';
    }
  }

  if (webhookUrl) {
    try {
      const resp = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: destination, message: textBody, purpose })
      });
      return resp.ok ? 'sent' : 'failed';
    } catch {
      return 'failed';
    }
  }

  return 'gateway_not_configured';
}

async function dispatchRealEmail(destination: string, code: string, purpose: string): Promise<'sent' | 'gateway_not_configured' | 'failed'> {
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.EMAIL_FROM?.trim() || 'SmartSchool ERP <noreply@smartschool.gn>';
  const webhookUrl = process.env.EMAIL_WEBHOOK_URL?.trim();

  const subject = `SmartSchool ERP Guinée - Code de vérification 2FA`;
  const text = `Bonjour,\n\nVotre code de vérification à usage unique (${purpose}) est : ${code}\nCe code expire dans 5 minutes.\n\nSi vous n'êtes pas à l'origine de cette demande, contactez immédiatement votre Super Administrateur.`;

  if (resendKey) {
    try {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [destination],
          subject,
          text
        })
      });
      return resp.ok ? 'sent' : 'failed';
    } catch {
      return 'failed';
    }
  }

  if (webhookUrl) {
    try {
      const resp = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: destination, subject, text, purpose })
      });
      return resp.ok ? 'sent' : 'failed';
    } catch {
      return 'failed';
    }
  }

  return 'gateway_not_configured';
}

function sanitizeText(value: unknown, maxLen = 4000): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\0/g, '').trim().slice(0, maxLen);
}

async function startServer() {
  await Promise.all([loadCommsStore(), loadStateStore()]);

  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  // Security HTTP headers (preserving iframe preview & Firebase/Maps/Fonts compatibility)
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    if (IS_PROD || req.secure || req.headers['x-forwarded-proto'] === 'https') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseio.com https://*.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https: wss: ws:",
      "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com",
      "frame-ancestors 'self' https://aistudio.google.com https://*.google.com https://*.googleusercontent.com",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ');
    res.setHeader('Content-Security-Policy', csp);
    next();
  });

  app.use(express.json({ limit: '15mb' }));

  // WAF IP blocklist enforcement
  app.use((req: Request, res: Response, next: NextFunction) => {
    const clientIp = getClientIp(req);
    if (memoryStore.blockedIps.includes(clientIp)) {
      res.status(403).json({
        ok: false,
        error: 'Accès refusé (HTTP 403) : Adresse IP bloquée par le pare-feu WAF SmartSchool.'
      });
      return;
    }
    next();
  });

  const apiLimiter = createRateLimiter({ windowMs: 60_000, maxRequests: 600, keyPrefix: 'api' });
  const otpLimiter = createRateLimiter({ windowMs: 300_000, maxRequests: 15, keyPrefix: 'otp' });
  app.use('/api', (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/state/stream') {
      next();
      return;
    }
    apiLimiter(req, res, next);
  });

  // Periodic cleanup of expired OTP challenges & rate-limit buckets
  const cleanupTimer = setInterval(() => {
    cleanExpiredChallenges();
    const now = Date.now();
    for (const [k, b] of rateLimitStore.entries()) {
      if (b.resetAt <= now) rateLimitStore.delete(k);
    }
  }, 60_000);
  cleanupTimer.unref();

  // Health & Gateway Readiness Endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    const smsConfigured = Boolean(
      (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) ||
        process.env.SMS_WEBHOOK_URL
    );
    const emailConfigured = Boolean(process.env.RESEND_API_KEY || process.env.EMAIL_WEBHOOK_URL);

    res.json({
      ok: true,
      status: 'healthy',
      service: 'smartschool-erp-guinee',
      mode: IS_PROD ? 'production' : 'development',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      syncedKeysCount: Object.keys(stateStore).length,
      gateways: {
        smsConfigured,
        emailConfigured
      }
    });
  });

  // Real-time Server-Sent Events (SSE) State Stream for universal multi-user synchronization
  app.get('/api/state/stream', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    if (typeof res.flushHeaders === 'function') {
      res.flushHeaders();
    }

    sseClients.add(res);
    res.write(`event: ready\ndata: ${JSON.stringify({ ok: true, serverTime: Date.now() })}\n\n`);

    const ping = setInterval(() => {
      try {
        res.write(': ping\n\n');
      } catch {
        clearInterval(ping);
        sseClients.delete(res);
      }
    }, 25_000);

    req.on('close', () => {
      clearInterval(ping);
      sseClients.delete(res);
    });
  });

  // Universal Shared State Retrieval (Last-Write-Wins across all connected browsers)
  app.get('/api/state', (req: Request, res: Response) => {
    const sinceParam = Number(req.query.since || 0);
    const since = Number.isFinite(sinceParam) && sinceParam > 0 ? sinceParam : 0;

    const states: Record<string, StateEntry> = {};
    for (const [key, entry] of Object.entries(stateStore)) {
      if (entry.updatedAt > since) {
        states[key] = entry;
      }
    }

    res.json({
      ok: true,
      serverTime: Date.now(),
      states
    });
  });

  // Universal Shared State Update (single { key, value, updatedAt } or batch { entries: [...] })
  app.post('/api/state', async (req: Request, res: Response) => {
    const rawEntries: Array<{ key?: unknown; value?: unknown; updatedAt?: unknown }> = Array.isArray(
      req.body?.entries
    )
      ? req.body.entries
      : req.body?.key !== undefined
      ? [{ key: req.body.key, value: req.body.value, updatedAt: req.body.updatedAt }]
      : [];

    if (rawEntries.length === 0) {
      res.status(400).json({ ok: false, error: 'Aucune entrée de synchronisation fournie.' });
      return;
    }

    const applied: Array<{ key: string; value: unknown; updatedAt: number }> = [];

    for (const raw of rawEntries.slice(0, 60)) {
      if (!isValidSyncableStateKey(raw.key)) continue;
      if (raw.value === undefined) continue;

      const parsedTs = Number(raw.updatedAt);
      const nextTs = Number.isFinite(parsedTs) && parsedTs > 0 ? parsedTs : Date.now();
      const existing = stateStore[raw.key];

      if (!existing || nextTs >= existing.updatedAt) {
        const entry: StateEntry = { value: raw.value, updatedAt: nextTs };
        stateStore[raw.key] = entry;
        applied.push({ key: raw.key, value: entry.value, updatedAt: entry.updatedAt });
      }
    }

    if (applied.length > 0) {
      await schedulePersistStateStore();
      broadcastSseEvent('state_update', {
        serverTime: Date.now(),
        entries: applied
      });
    }

    res.json({
      ok: true,
      appliedCount: applied.length,
      serverTime: Date.now()
    });
  });

  // WAF Blocklist Sync API
  app.get('/api/security/blocklist', (_req: Request, res: Response) => {
    res.json({ ok: true, blockedIps: memoryStore.blockedIps });
  });

  app.post('/api/security/blocklist', async (req: Request, res: Response) => {
    const rawBlockedIps: unknown = req.body?.blockedIps;
    const list: string[] | null = Array.isArray(rawBlockedIps)
      ? rawBlockedIps
          .filter((ip: unknown): ip is string => typeof ip === 'string')
          .map((ip: string) => ip.trim())
          .filter((ip: string) => /^[0-9a-fA-F:.]{3,45}$/.test(ip))
      : null;

    if (!list) {
      res.status(400).json({ ok: false, error: 'Liste IP invalide.' });
      return;
    }

    await persistCommsStore({
      ...memoryStore,
      blockedIps: Array.from(new Set<string>(list)).slice(0, 500)
    });

    res.json({ ok: true, blockedIps: memoryStore.blockedIps });
  });

  // 2FA OTP Send Endpoint (NEVER returns raw OTP code in response!)
  app.post('/api/otp/send', otpLimiter, async (req: Request, res: Response) => {
    cleanExpiredChallenges();

    const channel = req.body?.channel === 'email' ? 'email' : req.body?.channel === 'sms' ? 'sms' : null;
    const destination = sanitizeText(req.body?.destination, 160);
    const purpose = sanitizeText(req.body?.purpose || 'authentification', 64);

    if (!channel || !destination) {
      res.status(400).json({
        ok: false,
        error: 'Canal (sms ou email) et destination requis pour envoyer un code 2FA.'
      });
      return;
    }

    if (channel === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destination)) {
      res.status(400).json({ ok: false, error: 'Adresse email 2FA invalide.' });
      return;
    }

    if (channel === 'sms') {
      const normalizedDigits = destination.replace(/[^\d+]/g, '');
      if (normalizedDigits.replace(/\D/g, '').length < 8) {
        res.status(400).json({
          ok: false,
          error: 'Numéro de téléphone 2FA invalide (ex: +224 624 00 11 22).'
        });
        return;
      }
    }

    const challengeId = `otp_${crypto.randomUUID()}`;
    const code = String(crypto.randomInt(100000, 1000000));
    const hmac = hashOtp(challengeId, code);
    const maskedDestination = maskDestination(channel, destination);

    otpChallenges.set(challengeId, {
      id: challengeId,
      hmac,
      channel,
      purpose,
      maskedDestination,
      expiresAt: Date.now() + 5 * 60_000,
      attempts: 0,
      maxAttempts: 5
    });

    const deliveryStatus =
      channel === 'sms'
        ? await dispatchRealSms(destination, code, purpose)
        : await dispatchRealEmail(destination, code, purpose);

    if (deliveryStatus === 'failed') {
      otpChallenges.delete(challengeId);
      res.status(502).json({
        ok: false,
        error: `Échec d'envoi du code par ${channel.toUpperCase()} via la passerelle configurée.`
      });
      return;
    }

    res.json({
      ok: true,
      challengeToken: challengeId,
      channel,
      maskedDestination,
      expiresInSeconds: 300,
      deliveryStatus,
      sentAt: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      message:
        deliveryStatus === 'sent'
          ? `Code 2FA envoyé par ${channel.toUpperCase()} vers ${maskedDestination}.`
          : `Demande 2FA enregistrée pour ${maskedDestination}. Utilisez votre application Authenticator TOTP ou configurez la passerelle ${channel.toUpperCase()} serveur.`
    });
  });

  // 2FA OTP Verify Endpoint
  app.post('/api/otp/verify', otpLimiter, (req: Request, res: Response) => {
    cleanExpiredChallenges();

    const challengeToken = sanitizeText(req.body?.challengeToken, 128);
    const code = sanitizeText(req.body?.code, 16);

    if (!challengeToken || !/^\d{6}$/.test(code)) {
      res.status(400).json({ ok: false, error: 'Jeton ou code à 6 chiffres invalide.' });
      return;
    }

    const challenge = otpChallenges.get(challengeToken);
    if (!challenge) {
      res.status(404).json({ ok: false, error: 'Code 2FA expiré ou introuvable. Veuillez en demander un nouveau.' });
      return;
    }

    if (challenge.expiresAt <= Date.now()) {
      otpChallenges.delete(challengeToken);
      res.status(410).json({ ok: false, error: 'Code 2FA expiré. Veuillez en demander un nouveau.' });
      return;
    }

    if (challenge.attempts >= challenge.maxAttempts) {
      otpChallenges.delete(challengeToken);
      res.status(429).json({ ok: false, error: 'Nombre maximal de tentatives atteint. Demandez un nouveau code.' });
      return;
    }

    const candidateHmac = hashOtp(challengeToken, code);
    if (!timingSafeHexEqual(candidateHmac, challenge.hmac)) {
      challenge.attempts += 1;
      const remainingTries = Math.max(0, challenge.maxAttempts - challenge.attempts);
      if (remainingTries === 0) {
        otpChallenges.delete(challengeToken);
      }
      res.status(401).json({
        ok: false,
        error:
          remainingTries > 0
            ? `Code 2FA incorrect. ${remainingTries} tentative(s) restante(s).`
            : 'Code 2FA verrouillé après trop de tentatives erronées.'
      });
      return;
    }

    otpChallenges.delete(challengeToken);
    res.json({ ok: true, verified: true, channel: challenge.channel });
  });

  // Shared Cross-Role Messages API
  app.get('/api/messages', (req: Request, res: Response) => {
    const schoolId = sanitizeText(req.query.schoolId, 64);
    const canonicalTarget = canonicalSchoolId(schoolId);
    const list = schoolId
      ? memoryStore.messages.filter(
          m =>
            !m.schoolId ||
            m.schoolId === 'NATIONAL' ||
            canonicalSchoolId(String(m.schoolId)) === canonicalTarget
        )
      : memoryStore.messages;
    res.json({ ok: true, messages: list });
  });

  app.post('/api/messages', async (req: Request, res: Response) => {
    const payload = req.body;
    const subject = sanitizeText(payload?.subject, 200);
    const content = sanitizeText(payload?.content, 4000);
    const senderName = sanitizeText(payload?.senderName, 160);

    if (!subject || !content || !senderName) {
      res.status(400).json({ ok: false, error: 'Expéditeur, objet et contenu sont obligatoires.' });
      return;
    }

    const item = {
      ...payload,
      id: sanitizeText(payload?.id, 96) || `smsg-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      subject,
      content,
      senderName,
      createdAt: sanitizeText(payload?.createdAt, 64) || new Date().toISOString()
    };

    const nextMessages = [
      item,
      ...memoryStore.messages.filter(m => m.id !== item.id)
    ].slice(0, 500);

    await persistCommsStore({ ...memoryStore, messages: nextMessages });
    broadcastSseEvent('comms_update', { kind: 'messages', id: item.id, serverTime: Date.now() });
    res.status(201).json({ ok: true, message: item });
  });

  app.patch('/api/messages/:id', async (req: Request, res: Response) => {
    const id = sanitizeText(req.params.id, 96);
    const idx = memoryStore.messages.findIndex(m => m.id === id);
    if (idx === -1) {
      res.status(404).json({ ok: false, error: 'Message introuvable.' });
      return;
    }

    const existing = memoryStore.messages[idx];
    const replies = Array.isArray(existing.replies) ? [...existing.replies] : [];
    if (req.body?.reply && typeof req.body.reply === 'object') {
      replies.push({
        id: sanitizeText(req.body.reply.id, 96) || `rep-${Date.now()}`,
        authorName: sanitizeText(req.body.reply.authorName, 160),
        authorRole: sanitizeText(req.body.reply.authorRole, 64),
        content: sanitizeText(req.body.reply.content, 4000),
        createdAt: sanitizeText(req.body.reply.createdAt, 64) || new Date().toISOString()
      });
    }

    const readByRoles = Array.isArray(req.body?.readByRoles)
      ? req.body.readByRoles
      : existing.readByRoles;

    const updated = {
      ...existing,
      replies,
      readByRoles,
      updatedAt: new Date().toISOString()
    };

    const nextMessages = memoryStore.messages.map((m, i) => (i === idx ? updated : m));
    await persistCommsStore({ ...memoryStore, messages: nextMessages });
    broadcastSseEvent('comms_update', { kind: 'messages', id, serverTime: Date.now() });
    res.json({ ok: true, message: updated });
  });

  // Shared Cross-Role Requests API
  app.get('/api/requests', (req: Request, res: Response) => {
    const schoolId = sanitizeText(req.query.schoolId, 64);
    const canonicalTarget = canonicalSchoolId(schoolId);
    const list = schoolId
      ? memoryStore.requests.filter(
          r =>
            !r.schoolId ||
            r.schoolId === 'NATIONAL' ||
            canonicalSchoolId(String(r.schoolId)) === canonicalTarget
        )
      : memoryStore.requests;
    res.json({ ok: true, requests: list });
  });

  app.post('/api/requests', async (req: Request, res: Response) => {
    const payload = req.body;
    const title = sanitizeText(payload?.title, 200);
    const description = sanitizeText(payload?.description, 4000);
    const requesterName = sanitizeText(payload?.requesterName, 160);

    if (!title || !description || !requesterName) {
      res.status(400).json({ ok: false, error: 'Demandeur, titre et description sont obligatoires.' });
      return;
    }

    const item = {
      ...payload,
      id: sanitizeText(payload?.id, 96) || `sreq-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      title,
      description,
      requesterName,
      status: sanitizeText(payload?.status, 32) || 'en_attente',
      createdAt: sanitizeText(payload?.createdAt, 64) || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const nextRequests = [
      item,
      ...memoryStore.requests.filter(r => r.id !== item.id)
    ].slice(0, 500);

    await persistCommsStore({ ...memoryStore, requests: nextRequests });
    broadcastSseEvent('comms_update', { kind: 'requests', id: item.id, serverTime: Date.now() });
    res.status(201).json({ ok: true, request: item });
  });

  app.patch('/api/requests/:id', async (req: Request, res: Response) => {
    const id = sanitizeText(req.params.id, 96);
    const idx = memoryStore.requests.findIndex(r => r.id === id);
    if (idx === -1) {
      res.status(404).json({ ok: false, error: 'Requête introuvable.' });
      return;
    }

    const existing = memoryStore.requests[idx];
    const allowedStatuses = new Set(['en_attente', 'en_cours', 'approuve', 'rejete']);
    const requestedStatus = sanitizeText(req.body?.status, 32);
    const updated = {
      ...existing,
      ...(allowedStatuses.has(requestedStatus) ? { status: requestedStatus } : {}),
      ...(req.body?.resolutionNote !== undefined ? { resolutionNote: sanitizeText(req.body.resolutionNote, 2000) } : {}),
      ...(req.body?.handledBy !== undefined ? { handledBy: sanitizeText(req.body.handledBy, 160) } : {}),
      updatedAt: new Date().toISOString()
    };

    const nextRequests = memoryStore.requests.map((r, i) => (i === idx ? updated : r));
    await persistCommsStore({ ...memoryStore, requests: nextRequests });
    broadcastSseEvent('comms_update', { kind: 'requests', id, serverTime: Date.now() });
    res.json({ ok: true, request: updated });
  });

  // Notification Dispatch Relay (Email / SMS gateways when configured)
  app.post('/api/notifications/dispatch', async (req: Request, res: Response) => {
    const channel = sanitizeText(req.body?.channel, 24);
    const to = sanitizeText(req.body?.to, 160);
    const subject = sanitizeText(req.body?.subject, 200);
    const body = sanitizeText(req.body?.body, 2000);

    if (!channel || !body) {
      res.status(400).json({ ok: false, error: 'Canal et message requis.' });
      return;
    }

    let deliveryStatus: 'sent' | 'gateway_not_configured' | 'failed' = 'sent';
    if (channel === 'sms' && to) {
      deliveryStatus = await dispatchRealSms(to, 'INFO', subject || body.slice(0, 60));
    } else if (channel === 'email' && to) {
      const resendKey = process.env.RESEND_API_KEY?.trim();
      const fromEmail = process.env.EMAIL_FROM?.trim() || 'SmartSchool ERP <noreply@smartschool.gn>';
      if (resendKey) {
        try {
          const resp = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: fromEmail, to: [to], subject: subject || 'Notification SmartSchool', text: body })
          });
          deliveryStatus = resp.ok ? 'sent' : 'failed';
        } catch {
          deliveryStatus = 'failed';
        }
      } else {
        deliveryStatus = 'gateway_not_configured';
      }
    }

    res.json({ ok: true, deliveryStatus });
  });

  // Unknown API routes return clean JSON 404
  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ ok: false, error: 'Point de terminaison API introuvable.' });
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(
      express.static(distDir, {
        index: false,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('sw.js') || filePath.endsWith('index.html') || filePath.endsWith('manifest.webmanifest')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          } else if (filePath.includes('/assets/')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
        }
      })
    );

    app.get('*', (_req: Request, res: Response) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(
      `[SmartSchool ERP Server] listening on http://${HOST}:${PORT} (${IS_PROD ? 'production' : 'development'})`
    );
  });
}

startServer().catch(err => {
  console.error('[SmartSchool ERP Server] Fatal startup error:', err);
  process.exit(1);
});
