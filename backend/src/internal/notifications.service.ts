import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalNotification } from './notification.entity';

@Injectable()
export class InternalNotificationsService {
    constructor(
        @InjectRepository(InternalNotification)
        private repo: Repository<InternalNotification>,
    ) { }

    async create(data: Partial<InternalNotification>) {
        const notif = this.repo.create(data);
        return this.repo.save(notif);
    }

    async findAllForUser(userId: number) {
        // userId 0 is for Admin/Manager
        return this.repo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: 20,
        });
    }

    async getUnreadCount(userId: number) {
        return this.repo.count({ where: { userId, isRead: false } });
    }

    async markAsRead(id: number) {
        await this.repo.update(id, { isRead: true });
        return this.repo.findOne({ where: { id } });
    }

    async markAllAsRead(userId: number) {
        return this.repo.update({ userId }, { isRead: true });
    }

    async markAsReadByLink(userId: number, link: string) {
        return this.repo.update({ userId, link, isRead: false }, { isRead: true });
    }

    async createTestNotification(userId: number) {
        return this.create({
            userId,
            type: 'task',
            title: 'إشعار تجريبي',
            message: 'هذا إشعار لاختبار النظام والصوت',
            link: 'dashboard',
        });
    }
}
