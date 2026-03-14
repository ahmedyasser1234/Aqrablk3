import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Seo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    pagePath: string; // e.g., '/', '/motion-graphics'

    @Column({ default: '' })
    titleAr: string;

    @Column({ default: '' })
    titleEn: string;

    @Column({ type: 'text', default: '' })
    descriptionAr: string;

    @Column({ type: 'text', default: '' })
    descriptionEn: string;

    @Column({ nullable: true })
    keywordsAr: string;

    @Column({ nullable: true })
    keywordsEn: string;
}
