import { Injectable } from "@nestjs/common";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

@Injectable()
export class CipherService {
  private readonly ALGORITHM = 'aes-256-gcm';

  generateEphemeralKey(): string {
    return randomBytes(32).toString('hex');
  }

  encrypt(text: string, keyHex: string) {
    const key = Buffer.from(keyHex, 'hex');
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    let authTag = cipher.getAuthTag().toString('hex');

    return {
      content: encrypted,
      iv: iv.toString('hex'),
      authTag,
    }
  }

  decrypt(encryptedHex: string, keyHex: string, ivHex: string, authTagHex: string) {
    const key = Buffer.from(keyHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = createDecipheriv(this.ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
