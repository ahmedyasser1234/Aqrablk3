import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MarketingItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    category: 'solution' | 'step';

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ nullable: true })
    icon: string; // SVG path or icon name

    @Column({ default: 0 })
    order: number;
}
