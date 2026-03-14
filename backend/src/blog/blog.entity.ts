import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Comment } from './comment.entity';

@Entity()
export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titleAr: string;

    @Column()
    titleEn: string;

    @Column({ type: 'text' })
    contentAr: string;

    @Column({ type: 'text' })
    contentEn: string;

    @Column({ nullable: true })
    imagePath: string;

    @Column({ nullable: true })
    videoId: string;

    @Column()
    slug: string;

    @Column({ default: 'General' })
    categoryAr: string;

    @Column({ default: 'General' })
    categoryEn: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Comment, (comment) => comment.blog)
    comments: Comment[];
}
