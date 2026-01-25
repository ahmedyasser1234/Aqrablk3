import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class ChatMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    visitorId: string; // The unique ID from browser localStorage

    @Column()
    sender: string; // 'user', 'admin', 'bot'

    @Column('text')
    text: string;

    @CreateDateColumn()
    timestamp: Date;
}
