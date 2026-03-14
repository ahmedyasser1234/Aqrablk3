import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class InternalTask {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    department: string;

    @Column({ nullable: true })
    assignedTo: number; // Employee id

    @Column({ default: 'normal' })
    priority: string; // 'normal' | 'urgent'

    @Column({ default: 'pending' })
    status: string; // 'pending' | 'in-progress' | 'completed'

    @Column({ nullable: true })
    deadline: string;

    @Column({ nullable: true })
    startTime: string;

    @Column({ nullable: true })
    acceptedAt: string;

    @Column({ nullable: true })
    completedAt: string;

    @Column({ nullable: true })
    verifiedAt: string;

    @Column({ default: false })
    isPaused: boolean;

    @Column({ nullable: true })
    lastPausedAt: string;

    @Column({ default: 0 })
    totalPausedMinutes: number;

    @Column({ nullable: true })
    creatorId: number;

    @Column({ nullable: true })
    creatorName: string;

    @CreateDateColumn()
    createdAt: Date;
}
