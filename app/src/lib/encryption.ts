import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { ENV } from './env';

export function getPepper() {
  const p = ENV.ENCRYPTION_PEPPER;
  return p || 'PEPPER_REQUIRED';
}

export function encryptSensitive(text: string, keySeed: string) {
  const key = `${keySeed}:${getPepper()}`;
  return AES.encrypt(text, key).toString();
}

export function decryptSensitive(cipher: string, keySeed: string) {
  const key = `${keySeed}:${getPepper()}`;
  const bytes = AES.decrypt(cipher, key);
  return bytes.toString(Utf8);
}
