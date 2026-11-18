export interface ServerOtpDispatchResult {
  ok: boolean;
  challengeToken?: string;
  channel?: 'sms' | 'email';
  maskedDestination?: string;
  deliveryStatus?: 'sent' | 'gateway_not_configured' | 'failed';
  sentAt?: string;
  message?: string;
  error?: string;
}

export async function requestServerOtp(params: {
  channel: 'sms' | 'email';
  destination: string;
  purpose?: string;
}): Promise<ServerOtpDispatchResult> {
  try {
    const resp = await fetch('/api/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data?.ok) {
      return {
        ok: false,
        error: data?.error || 'Impossible de déclencher l’envoi du code 2FA.'
      };
    }
    return data as ServerOtpDispatchResult;
  } catch {
    return {
      ok: false,
      error: 'Serveur 2FA temporairement inaccessible. Utilisez votre application Authenticator TOTP.'
    };
  }
}

export async function verifyServerOtp(params: {
  challengeToken: string;
  code: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const resp = await fetch('/api/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data?.ok) {
      return {
        ok: false,
        error: data?.error || 'Code 2FA invalide ou expiré.'
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: 'Erreur réseau lors de la vérification du code 2FA.'
    };
  }
}

export function maskDestinationLabel(channel: 'sms' | 'email', raw: string): string {
  const clean = raw.trim();
  if (!clean) return 'Non configuré';
  if (channel === 'email') {
    const atIdx = clean.indexOf('@');
    if (atIdx <= 1) return '***@***';
    const local = clean.slice(0, atIdx);
    const domain = clean.slice(atIdx + 1);
    return `${local.slice(0, 2)}${'•'.repeat(Math.max(3, local.length - 2))}@${domain}`;
  }
  if (clean.length <= 4) return '••••';
  return `${clean.slice(0, Math.min(6, clean.length - 2))} •••• ${clean.slice(-2)}`;
}
