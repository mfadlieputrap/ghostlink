import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', name: 'encrpyted_content' })
  encryptedContent: string;

  @Column()
  iv: string;

  @Column({ name: 'auth_tag' })
  authTag: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
