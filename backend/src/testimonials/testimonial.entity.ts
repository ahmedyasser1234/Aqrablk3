import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Testimonial {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    imagePath: string;

    @Column({ nullable: true })
    role: string;

    @Column('text')
    content: string;

    @Column()
    rating: number;

    @Column({ default: 'pending' }) // pending, approved
    status: string;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
