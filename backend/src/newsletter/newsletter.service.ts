import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsletterSubscriber } from './newsletter.entity';

@Injectable()
export class NewsletterService {
    constructor(
        @InjectRepository(NewsletterSubscriber)
        private subscriberRepo: Repository<NewsletterSubscriber>,
    ) { }

    async subscribe(email: string) {
        const existing = await this.subscriberRepo.findOne({ where: { email } });
        if (existing) {
            if (!existing.isActive) {
                existing.isActive = true;
                return this.subscriberRepo.save(existing);
            }
            return existing; // Already subscribed
        }

        const subscriber = this.subscriberRepo.create({ email });
        return this.subscriberRepo.save(subscriber);
    }

    async findAll() {
        return this.subscriberRepo.find({ order: { createdAt: 'DESC' } });
    }

    async unsubscribe(email: string) {
        await this.subscriberRepo.update({ email }, { isActive: false });
        return { success: true };
    }
}
