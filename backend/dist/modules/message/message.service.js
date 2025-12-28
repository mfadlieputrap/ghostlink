"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const message_entity_1 = require("./entities/message.entity");
const typeorm_2 = require("typeorm");
const cipher_service_1 = require("./cipher.service");
const paseto_1 = require("paseto");
const config_1 = require("@nestjs/config");
let MessageService = class MessageService {
    meRepo;
    cipher;
    configService;
    constructor(meRepo, cipher, configService) {
        this.meRepo = meRepo;
        this.cipher = cipher;
        this.configService = configService;
    }
    async createGhostMessage(plainText) {
        const ephemeralKey = this.cipher.generateEphemeralKey();
        const { content, iv, authTag } = this.cipher.encrypt(plainText, ephemeralKey);
        const savedMessage = await this.meRepo.save({
            plainText,
            encryptedContent: content,
            iv: iv,
            authTag: authTag,
        });
        const serverKeyHex = this.configService.get('PASSPHRASE_PRIVATE_KEY');
        if (!serverKeyHex) {
            throw new common_1.NotFoundException('PASSPHRASE_PRIVATE_KEY cannot be empty; Check .env');
        }
        const token = await paseto_1.V4.sign({
            sub: 'ghost-link',
            msgId: savedMessage.id,
            key: ephemeralKey,
        }, serverKeyHex, { expiresIn: '24h' });
        return { ghostlink: `${this.configService.get('FRONTEND_URL')}/read?token=${token}` };
    }
    async readGhostMessage(token) {
        let payload;
        const publicKeyHex = this.configService.get('PASSPHRASE_PUBLIC_KEY');
        if (!publicKeyHex) {
            throw new Error('FATAL: PASSPHRASE_PUBLIC_KEY belum diset di .env!');
        }
        const publicKeyObject = Buffer.from(publicKeyHex, 'hex');
        try {
            payload = await paseto_1.V4.verify(token, publicKeyHex);
        }
        catch (e) {
            throw new common_1.BadRequestException('Link rusak atau kadaluwarsa');
        }
        if (!payload) {
            throw new common_1.NotFoundException('Payload is empty');
        }
        console.log('--- DEBUG START ---');
        console.log('1. ID yang mau dihapus:', payload.msgId);
        const message = await this.meRepo.findOne({ where: { id: payload.msgId } });
        if (!message) {
            throw new common_1.NotFoundException('Pesan sudah hancur atau tidak ditemukan');
        }
        const plainText = this.cipher.decrypt(message.encryptedContent, payload.key, message.iv, message.authTag);
        await this.meRepo.delete(payload.msgId);
        return { message: plainText };
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        cipher_service_1.CipherService,
        config_1.ConfigService])
], MessageService);
//# sourceMappingURL=message.service.js.map