import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class ChatbotKnowledge {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    keyword: string;

    @Column('text')
    answer: string;

    @Column({ default: 'general' })
    category: string;

    @Column({ default: 'ar' })
    language: string;

    @CreateDateColumn()
    createdAt: Date;
}
