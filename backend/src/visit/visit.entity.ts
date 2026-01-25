import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Visit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    page: string;

    @Column({ nullable: true })
    ip: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    city: string;

    @CreateDateColumn()
    timestamp: Date;
}
