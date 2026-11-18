// Pure synchronous SHA-256 salted password hashing for browser & Node environments

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);

function rotr(x: number, n: number): number {
  return (x >>> n) | (x << (32 - n));
}

export function sha256Hex(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const bitLen = bytes.length * 8;
  const paddedLen = Math.ceil((bytes.length + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLen);
  padded.set(bytes);
  padded[bytes.length] = 0x80;

  const view = new DataView(padded.buffer);
  const highBits = Math.floor(bitLen / 0x100000000);
  const lowBits = bitLen >>> 0;
  view.setUint32(paddedLen - 8, highBits, false);
  view.setUint32(paddedLen - 4, lowBits, false);

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  const w = new Uint32Array(64);

  for (let offset = 0; offset < paddedLen; offset += 64) {
    for (let i = 0; i < 16; i += 1) {
      w[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i += 1) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let i = 0; i < 64; i += 1) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  return [h0, h1, h2, h3, h4, h5, h6, h7]
    .map(n => n.toString(16).padStart(8, '0'))
    .join('');
}

export function generateSaltHex(byteCount = 12): string {
  const arr = new Uint8Array(byteCount);
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < byteCount; i += 1) {
      arr[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(arr)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function hashPasswordSync(plainPassword: string, existingSalt?: string): string {
  const salt = existingSalt || generateSaltHex(12);
  const digest = sha256Hex(`${salt}:smartschool-erp:${plainPassword}`);
  return `sha256$${salt}$${digest}`;
}

export function isSaltedPasswordHash(hash?: string): boolean {
  return typeof hash === 'string' && /^sha256\$[a-f0-9]+\$[a-f0-9]{64}$/.test(hash);
}

function constantTimeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function verifySaltedPasswordHash(plainPassword: string, storedHash?: string): boolean {
  if (!isSaltedPasswordHash(storedHash) || !storedHash) return false;
  const parts = storedHash.split('$');
  const salt = parts[1];
  const candidate = hashPasswordSync(plainPassword, salt);
  return constantTimeStringEqual(candidate, storedHash);
}

export function validatePasswordStrength(password: string): { valid: boolean; reason?: string } {
  const clean = password.trim();
  if (clean.length < 8) {
    return { valid: false, reason: 'Le mot de passe doit contenir au minimum 8 caractères.' };
  }
  if (clean === 'Smart@2026') {
    return { valid: false, reason: 'Vous ne pouvez pas réutiliser le mot de passe temporaire initial.' };
  }
  if (!/[A-Za-z]/.test(clean) || !/[0-9]/.test(clean)) {
    return {
      valid: false,
      reason: 'Le mot de passe doit contenir au moins une lettre et un chiffre.'
    };
  }
  return { valid: true };
}
