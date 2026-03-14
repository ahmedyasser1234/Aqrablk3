import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SupportEmail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;
}
