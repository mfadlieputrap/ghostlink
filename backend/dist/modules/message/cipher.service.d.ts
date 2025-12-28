export declare class CipherService {
    private readonly ALGORITHM;
    generateEphemeralKey(): string;
    encrypt(text: string, keyHex: string): {
        content: string;
        iv: string;
        authTag: string;
    };
    decrypt(encryptedHex: string, keyHex: string, ivHex: string, authTagHex: string): string;
}
