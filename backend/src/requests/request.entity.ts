import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class ServiceRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    email: string;

    @Column()
    phone: string;

    @Column()
    service: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({ default: 'pending' }) // pending, in-progress, completed, rejected
    status: string;

    @Column({ nullable: true })
    handledBy: string;

    @CreateDateColumn()
    createdAt: Date;
}
