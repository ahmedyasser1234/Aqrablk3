import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class InternalChatGroup {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    adminId: number;

    @Column('simple-json', { nullable: true })
    memberIds: number[];

    @CreateDateColumn()
    createdAt: Date;
}
