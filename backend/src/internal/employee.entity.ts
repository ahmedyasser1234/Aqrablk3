import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column()
    department: string;

    @Column({ default: 'Employee' })
    role: string;

    @Column({ default: 'offline' })
    status: string;

    @Column({ default: 0 })
    completedTasks: number;

    @Column({ default: '00:00:00' })
    totalWorkTime: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    lastSeen: Date;

    @Column({ default: 0 })
    points: number;

    @Column({ default: 0 })
    delayDebtMinutes: number;

    @CreateDateColumn()
    createdAt: Date;
}
