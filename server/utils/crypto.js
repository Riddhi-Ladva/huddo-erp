import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

// Resolve 32-byte key from environment or fallback key
const getSecretKey = () => {
  const envKey = process.env.ENCRYPTION_KEY || 'communication-settings-secret-key-32-chars-long!';
  // Make sure it is exactly 32 bytes
  if (envKey.length >= 32) {
    return Buffer.from(envKey.slice(0, 32));
  }
  return Buffer.from(envKey.padEnd(32, '0'));
};

export const encrypt = (text) => {
  if (!text) return '';
  // If it's already masked, do not encrypt it (should not happen, but safe fallback)
  if (text === '••••••••') return text;
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getSecretKey(), iv);
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (text) => {
  if (!text) return '';
  // If not encrypted (e.g. contains no colon separator or is a dummy mask), return it directly
  if (!text.includes(':')) return text;
  
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, getSecretKey(), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  } catch (err) {
    console.error('[Crypto Helper] Decryption failed:', err.message);
    return text; // return original if decryption failed
  }
};
