"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CipherService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let CipherService = class CipherService {
    ALGORITHM = 'aes-256-gcm';
    generateEphemeralKey() {
        return (0, crypto_1.randomBytes)(32).toString('hex');
    }
    encrypt(text, keyHex) {
        const key = Buffer.from(keyHex, 'hex');
        const iv = (0, crypto_1.randomBytes)(16);
        const cipher = (0, crypto_1.createCipheriv)(this.ALGORITHM, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        let authTag = cipher.getAuthTag().toString('hex');
        return {
            content: encrypted,
            iv: iv.toString('hex'),
            authTag,
        };
    }
    decrypt(encryptedHex, keyHex, ivHex, authTagHex) {
        const key = Buffer.from(keyHex, 'hex');
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const decipher = (0, crypto_1.createDecipheriv)(this.ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
};
exports.CipherService = CipherService;
exports.CipherService = CipherService = __decorate([
    (0, common_1.Injectable)()
], CipherService);
//# sourceMappingURL=cipher.service.js.map