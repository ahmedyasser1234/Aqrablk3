import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Partner {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    logoUrl: string;
}
