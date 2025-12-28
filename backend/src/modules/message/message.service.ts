import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { CipherService } from './cipher.service';
import { V4 } from 'paseto';
import { ConfigService } from '@nestjs/config';
import { createPrivateKey, createPublicKey } from 'crypto';

interface GhostTokenPayload {
  sub?: string;
  msgId: string;
  key: string;
  exp?: string;
  iat?: string;
}

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly meRepo: Repository<Message>,
    private readonly cipher: CipherService,
    private readonly configService: ConfigService,
  ) { }

  async createGhostMessage(plainText: string) {

    const ephemeralKey = this.cipher.generateEphemeralKey();

    const { content, iv, authTag } = this.cipher.encrypt(plainText, ephemeralKey);

    const savedMessage = await this.meRepo.save({
      plainText,
      encryptedContent: content,
      iv: iv,
      authTag: authTag,
    })

    const serverKeyHex = this.configService.get<string>('PASSPHRASE_PRIVATE_KEY');
    if (!serverKeyHex) {
      throw new NotFoundException('PASSPHRASE_PRIVATE_KEY cannot be empty; Check .env');
    }

    const token = await V4.sign(
      {
        sub: 'ghost-link',
        msgId: savedMessage.id,
        key: ephemeralKey,
      },
      serverKeyHex,
      { expiresIn: '24h' },
    )
    return { ghostlink: `${this.configService.get<string>('FRONTEND_URL')}/read?token=${token}` };
  }

  async readGhostMessage(token: string) {
    let payload: GhostTokenPayload;
    const publicKeyHex = this.configService.get<string>('PASSPHRASE_PUBLIC_KEY');
    if (!publicKeyHex) {
      throw new Error('FATAL: PASSPHRASE_PUBLIC_KEY belum diset di .env!');
    }
    const publicKeyObject = Buffer.from(publicKeyHex, 'hex');
    try {
      payload = await V4.verify(token, publicKeyHex);
    } catch (e) {
      throw new BadRequestException('Link rusak atau kadaluwarsa');
    }
    if (!payload) {
      throw new NotFoundException('Payload is empty');
    }
    console.log('--- DEBUG START ---');
    console.log('1. ID yang mau dihapus:', payload.msgId);
    const message = await this.meRepo.findOne({ where: { id: payload.msgId } });
    if (!message) {
      throw new NotFoundException('Pesan sudah hancur atau tidak ditemukan');
    }

    const plainText = this.cipher.decrypt(
      message.encryptedContent,
      payload.key,
      message.iv,
      message.authTag,
    );

    await this.meRepo.delete(payload.msgId);

    return { message: plainText };
  }
}
