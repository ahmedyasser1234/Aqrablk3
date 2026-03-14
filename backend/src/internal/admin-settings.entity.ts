import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class AdminSettings {
    @PrimaryColumn({ default: 1 })
    id: number;

    @Column({ default: 'المدير' })
    name: string;

    @Column({ nullable: true })
    avatar: string;

    @Column()
    password: string;
}
