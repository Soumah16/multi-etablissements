// Standard RFC 6238 TOTP (Time-based One-Time Password) using Web Crypto HMAC-SHA1
// Compatible with Google Authenticator, Microsoft Authenticator, and Authy

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function generateTotpSecret(length = 16): string {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  let secret = '';
  for (let i = 0; i < length; i++) {
    secret += BASE32_ALPHABET[bytes[i] % 32];
  }
  return secret;
}

function base32ToBytes(base32: string): Uint8Array {
  const clean = base32.toUpperCase().replace(/[^A-Z2-7]/g, '');
  const bits: number[] = [];
  for (const ch of clean) {
    const val = BASE32_ALPHABET.indexOf(ch);
    if (val === -1) continue;
    for (let b = 4; b >= 0; b--) {
      bits.push((val >> b) & 1);
    }
  }
  const byteCount = Math.floor(bits.length / 8);
  const out = new Uint8Array(byteCount);
  for (let i = 0; i < byteCount; i++) {
    let byte = 0;
    for (let b = 0; b < 8; b++) {
      byte = (byte << 1) | bits[i * 8 + b];
    }
    out[i] = byte;
  }
  return out;
}

async function computeHotp(secretBase32: string, counter: number): Promise<string> {
  const keyBytes = base32ToBytes(secretBase32);
  const counterBytes = new Uint8Array(8);
  let temp = counter;
  for (let i = 7; i >= 0; i--) {
    counterBytes[i] = temp & 0xff;
    temp = Math.floor(temp / 256);
  }

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes.buffer as ArrayBuffer,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, counterBytes.buffer as ArrayBuffer);
  const hmac = new Uint8Array(signature);
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return String(binary % 1_000_000).padStart(6, '0');
}

export async function generateTotpCode(
  secretBase32: string,
  timestampMs = Date.now()
): Promise<{ code: string; remainingSeconds: number }> {
  const epochSec = Math.floor(timestampMs / 1000);
  const step = Math.floor(epochSec / 30);
  const remainingSeconds = 30 - (epochSec % 30);
  const code = await computeHotp(secretBase32, step);
  return { code, remainingSeconds };
}

export async function verifyTotpCode(
  secretBase32: string,
  inputCode: string,
  windowSteps = 1
): Promise<boolean> {
  const clean = inputCode.trim();
  if (!/^\d{6}$/.test(clean)) return false;

  const epochSec = Math.floor(Date.now() / 1000);
  const currentStep = Math.floor(epochSec / 30);

  for (let offset = -windowSteps; offset <= windowSteps; offset++) {
    const candidate = await computeHotp(secretBase32, currentStep + offset);
    if (candidate === clean) {
      return true;
    }
  }
  return false;
}

export function buildOtpAuthUri(
  secretBase32: string,
  accountLabel: string,
  issuer = 'SmartSchool ERP Guinée'
): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedLabel = encodeURIComponent(`${issuer}:${accountLabel}`);
  return `otpauth://totp/${encodedLabel}?secret=${secretBase32}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}
