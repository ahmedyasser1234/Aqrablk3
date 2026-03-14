import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string; // Will store hashed password

    @Column({ nullable: true })
    name: string;

    @Column({ default: 'support' })
    role: string; // 'superadmin' or 'support'

    @Column({ nullable: true })
    lastSeen: Date;
}
