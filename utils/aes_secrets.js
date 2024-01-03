import crypto from 'crypto';
import { secretConfig } from '../configs/config.constants.js';


const ENCRYPTION_KEY = Buffer.from(secretConfig.encriptionKey, 'base64');
const IV_LENGTH = 16;
const CBC = 'aes-256-cbc';


export function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(CBC, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

export function decrypt(text) {
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const decipher = crypto.createDecipheriv(CBC, Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(parts[1], 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}