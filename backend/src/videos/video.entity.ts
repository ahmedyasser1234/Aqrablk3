import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Video {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    youtubeId: string;

    @Column()
    category: string; // motion, collage, whiteboard

    @Column({ nullable: true })
    externalLink: string;

    @CreateDateColumn()
    createdAt: Date;
}
