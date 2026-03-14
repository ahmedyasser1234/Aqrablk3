import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketingItem } from './marketing-item.entity';

@Injectable()
export class MarketingService {
    constructor(
        @InjectRepository(MarketingItem)
        private marketingRepository: Repository<MarketingItem>,
    ) { }

    findAll() {
        return this.marketingRepository.find({ order: { order: 'ASC' } });
    }

    findByCategory(category: 'solution' | 'step') {
        return this.marketingRepository.find({ where: { category }, order: { order: 'ASC' } });
    }

    create(data: Partial<MarketingItem>) {
        const item = this.marketingRepository.create(data);
        return this.marketingRepository.save(item);
    }

    async update(id: number, data: Partial<MarketingItem>) {
        await this.marketingRepository.update(id, data);
        return this.marketingRepository.findOneBy({ id });
    }

    async delete(id: number) {
        await this.marketingRepository.delete(id);
        return { deleted: true };
    }
}
