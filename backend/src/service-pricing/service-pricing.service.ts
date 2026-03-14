import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServicePricing } from './service-pricing.entity';

@Injectable()
export class ServicePricingService {
    constructor(
        @InjectRepository(ServicePricing)
        private servicePricingRepository: Repository<ServicePricing>,
    ) { }

    async findAll(): Promise<ServicePricing[]> {
        return this.servicePricingRepository.find({ where: { isActive: true } });
    }

    async findOne(id: number): Promise<ServicePricing | null> {
        return this.servicePricingRepository.findOne({ where: { id } });
    }

    async findByCategory(category: string): Promise<ServicePricing | null> {
        return this.servicePricingRepository.findOne({ where: { category, isActive: true } });
    }

    async create(data: Partial<ServicePricing>): Promise<ServicePricing> {
        const service = this.servicePricingRepository.create(data);
        return this.servicePricingRepository.save(service);
    }

    async update(id: number, data: Partial<ServicePricing>): Promise<ServicePricing> {
        await this.servicePricingRepository.update(id, data);
        const updated = await this.findOne(id);
        if (!updated) {
            throw new Error(`ServicePricing with ID ${id} not found`);
        }
        return updated;
    }

    async delete(id: number): Promise<void> {
        await this.servicePricingRepository.delete(id);
    }

    async calculatePrice(category: string, duration: number, additionalOptions: string[] = []): Promise<{ price: number; currency: string; breakdown: any }> {
        const service = await this.findByCategory(category);

        if (!service) {
            throw new Error('Service not found');
        }

        let totalPrice = service.basePrice;

        // Find matching pricing rule
        const rule = service.pricingRules.find(r => r.duration === duration);
        if (rule) {
            totalPrice = rule.price;
        }

        // Add additional options
        for (const optionName of additionalOptions) {
            const option = service.additionalOptions.find(o => o.name === optionName || o.nameEn === optionName);
            if (option) {
                totalPrice += option.price;
            }
        }

        return {
            price: totalPrice,
            currency: service.currency,
            breakdown: {
                basePrice: rule ? rule.price : service.basePrice,
                additionalOptions: additionalOptions.map(name => {
                    const option = service.additionalOptions.find(o => o.name === name || o.nameEn === name);
                    return option ? { name: option.name, price: option.price } : null;
                }).filter(Boolean),
            }
        };
    }
}
