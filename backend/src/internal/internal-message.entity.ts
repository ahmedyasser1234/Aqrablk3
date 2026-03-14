import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class InternalMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    senderId: number;

    @Column()
    senderName: string;

    @Column({ nullable: true })
    senderAvatar: string;

    @Column()
    text: string;

    @Column({ default: 'general' })
    channel: string; // 'general' or 'dm_<id1>_<id2>' or 'dept' or 'group'

    @Column({ nullable: true })
    receiverId: number; // For DMs

    @Column({ nullable: true })
    taskId: number; // To embed tasks in chat

    @Column({ nullable: true })
    deptName: string; // If channel is 'dept'

    @Column({ nullable: true })
    groupId: number; // If channel is 'group'

    @Column({ nullable: true })
    image: string;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
