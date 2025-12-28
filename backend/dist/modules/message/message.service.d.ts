import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { CipherService } from './cipher.service';
import { ConfigService } from '@nestjs/config';
export declare class MessageService {
    private readonly meRepo;
    private readonly cipher;
    private readonly configService;
    constructor(meRepo: Repository<Message>, cipher: CipherService, configService: ConfigService);
    createGhostMessage(plainText: string): Promise<{
        ghostlink: string;
    }>;
    readGhostMessage(token: string): Promise<{
        message: string;
    }>;
}
