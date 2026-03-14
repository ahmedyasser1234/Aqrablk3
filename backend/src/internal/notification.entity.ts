import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class InternalNotification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number; // Recipient ID (0 for all admins/manager)

    @Column()
    type: string; // 'task' | 'message' | 'system'

    @Column()
    title: string;

    @Column()
    message: string;

    @Column({ default: false })
    isRead: boolean;

    @Column({ nullable: true })
    link: string; // Internal route e.g. 'tasks' or 'chat/0'

    @CreateDateColumn()
    createdAt: Date;
}
