import crypto from 'crypto';

export function digestMessage(message) {
  return crypto.createHash('sha512').update(message).digest('hex');
}
