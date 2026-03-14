import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InternalDepartment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    icon: string; // SVG or icon name

    @Column({ nullable: true })
    color: string; // Tailwind color key like 'blue' or 'purple'
}
