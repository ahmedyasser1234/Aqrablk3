import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Blog } from './blog.entity';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ default: false })
    isApproved: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Blog, (blog) => blog.comments, { onDelete: 'CASCADE' })
    blog: Blog;
}
