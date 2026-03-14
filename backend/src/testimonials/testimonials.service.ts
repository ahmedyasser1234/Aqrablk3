import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonial } from './testimonial.entity';
import { ChatGateway } from '../chat/chat.gateway';

@Injectable()
export class TestimonialsService {
    constructor(
        @InjectRepository(Testimonial)
        private testimonialRepository: Repository<Testimonial>,
        @Inject(forwardRef(() => ChatGateway))
        private chatGateway: ChatGateway,
    ) { }

    async create(data: Partial<Testimonial>) {
        const testimonial = this.testimonialRepository.create(data);
        const saved = await this.testimonialRepository.save(testimonial);

        // Notify admins
        const unreadCount = await this.getUnreadCount();
        this.chatGateway.server.emit('testimonialsUpdate', { unreadCount, newTestimonial: saved });

        return saved;
    }

    findAllApproved() {
        return this.testimonialRepository.find({ where: { status: 'approved' }, order: { createdAt: 'DESC' } });
    }

    findAllAdmin() {
        return this.testimonialRepository.find({ order: { createdAt: 'DESC' } });
    }

    async updateStatus(id: number, status: string) {
        await this.testimonialRepository.update(id, { status, isRead: true });

        // Notify admins
        const unreadCount = await this.getUnreadCount();
        this.chatGateway.server.emit('testimonialsUpdate', { unreadCount });

        return this.testimonialRepository.findOneBy({ id });
    }

    getUnreadCount() {
        return this.testimonialRepository.count({ where: { isRead: false } });
    }

    async markAsRead(id: number) {
        await this.testimonialRepository.update(id, { isRead: true });
        return { success: true };
    }

    async markAllAsRead() {
        await this.testimonialRepository.update({}, { isRead: true });
        return { success: true };
    }

    async delete(id: number) {
        await this.testimonialRepository.delete(id);

        // Notify admins
        const unreadCount = await this.getUnreadCount();
        this.chatGateway.server.emit('testimonialsUpdate', { unreadCount });

        return { deleted: true };
    }
}
