import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('service_pricing')
export class ServicePricing {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    serviceName: string;

    @Column()
    serviceNameEn: string;

    @Column()
    category: string; // motion, montage, photography, design, web_design, content_writing, marketing

    @Column({ type: 'json', default: '[]' })
    pricingRules: { duration: number; price: number }[]; // [{duration: 60, price: 500}, {duration: 120, price: 900}]

    @Column({ type: 'json', default: '[]' })
    specifications: { name: string; nameEn: string; included: boolean }[];

    @Column({ type: 'json', default: '[]' })
    additionalOptions: { name: string; nameEn: string; price: number }[];

    @Column({ default: 'EGP' })
    currency: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    basePrice: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: true })
    calculatorEnabled: boolean; // هل الخدمة متاحة في الحاسبة

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
