import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('chatbot_config')
export class ChatbotConfig {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: true })
    welcomeMessage: string;

    @Column({ type: 'text', nullable: true })
    welcomeMessageEn: string;

    @Column({ type: 'json', default: '[]' })
    keywords: { keyword: string; response: string; responseEn: string }[];

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
