import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalMessage } from './internal-message.entity';
import { InternalNotificationsService } from './notifications.service';
import { EmployeesService } from './employees.service';
import { ChatGroupsService } from './chat-groups.service';

@Injectable()
export class InternalMessagesService {
    constructor(
        @InjectRepository(InternalMessage)
        private messagesRepo: Repository<InternalMessage>,
        private notifService: InternalNotificationsService,
        private employeesService: EmployeesService,
        private chatGroupsService: ChatGroupsService,
    ) { }

    async getGeneral(): Promise<InternalMessage[]> {
        return this.messagesRepo.find({
            where: { channel: 'general' },
            order: { createdAt: 'ASC' },
            take: 100,
        });
    }

    async getAdminAvatar(): Promise<{ avatar: string | null }> {
        const msg = await this.messagesRepo.findOne({
            where: { senderId: 0 },
            order: { createdAt: 'DESC' },
        });
        return { avatar: msg?.senderAvatar || null };
    }

    async getDM(userId1: number, userId2: number): Promise<InternalMessage[]> {
        const msgs = await this.messagesRepo.find({ order: { createdAt: 'ASC' }, take: 100 });
        return msgs.filter(m =>
            (m.senderId === userId1 && m.receiverId === userId2) ||
            (m.senderId === userId2 && m.receiverId === userId1)
        );
    }

    async getDeptMessages(deptName: string): Promise<InternalMessage[]> {
        return this.messagesRepo.find({
            where: { channel: 'dept', deptName },
            order: { createdAt: 'ASC' },
            take: 100,
        });
    }

    async getGroupMessages(groupId: number): Promise<InternalMessage[]> {
        return this.messagesRepo.find({
            where: { channel: 'group', groupId },
            order: { createdAt: 'ASC' },
            take: 100,
        });
    }

    async send(data: Partial<InternalMessage>): Promise<InternalMessage> {
        const msg = await this.messagesRepo.save(data);
        if (msg.channel === 'dm' && msg.receiverId !== undefined) {
            const displayMsg = msg.text ? (msg.text.length > 30 ? msg.text.substring(0, 30) + '...' : msg.text) : (msg.image ? '[صورة]' : '');
            await this.notifService.create({
                userId: msg.receiverId,
                type: 'message',
                title: 'رسالة جديدة',
                message: `${msg.senderName}: ${displayMsg}`,
                link: `chat/${msg.senderId}`,
            }).catch(e => console.error('Failed to create DM notification', e));
        } else if (msg.channel === 'general') {
            console.log(`Creating General notification for all users except sender ${msg.senderId}`);
            // Get all active employees + Admin (Id 0)
            const employees = await this.employeesService.findAll();
            const recipients = [0, -1, ...employees.filter(e => e.status !== 'suspended').map(e => e.id)].filter(id => id !== msg.senderId);
            const displayMsg = msg.text ? (msg.text.length > 30 ? msg.text.substring(0, 30) + '...' : msg.text) : (msg.image ? '[صورة]' : '');
            for (const recipientId of recipients) {
                await this.notifService.create({
                    userId: recipientId,
                    type: 'message',
                    title: 'القناة العامة',
                    message: `${msg.senderName}: ${displayMsg}`,
                    link: 'chat/general',
                }).catch(() => { });
            }
        } else if (msg.channel === 'dept' && msg.deptName) {
            console.log(`Creating Dept notification for ${msg.deptName} users except sender ${msg.senderId}`);
            // Get all employees in the department + Admin (Id 0)
            const employees = await this.employeesService.findAll();
            const deptEmployees = employees.filter(e => e.department === msg.deptName && e.status !== 'suspended');
            const recipients = [0, -1, ...deptEmployees.map(e => e.id)].filter(id => id !== msg.senderId);
            const displayMsg = msg.text ? (msg.text.length > 30 ? msg.text.substring(0, 30) + '...' : msg.text) : (msg.image ? '[صورة]' : '');
            
            for (const recipientId of recipients) {
                await this.notifService.create({
                    userId: recipientId,
                    type: 'message',
                    title: `قسم ${msg.deptName}`,
                    message: `${msg.senderName}: ${displayMsg}`,
                    link: `chat/dept_${msg.deptName}`,
                }).catch(() => { });
            }
        } else if (msg.channel === 'group' && msg.groupId) {
            console.log(`Creating Custom Group notification for group ${msg.groupId} except sender ${msg.senderId}`);
            try {
                const group = await this.chatGroupsService.getGroupById(msg.groupId);
                const recipients = group.memberIds.filter(id => id !== msg.senderId);
                const displayMsg = msg.text ? (msg.text.length > 30 ? msg.text.substring(0, 30) + '...' : msg.text) : (msg.image ? '[صورة]' : '');
                for (const recipientId of recipients) {
                    await this.notifService.create({
                        userId: recipientId,
                        type: 'message',
                        title: `${group.name}`,
                        message: `${msg.senderName}: ${displayMsg}`,
                        link: `chat/customgroup_${msg.groupId}`,
                    }).catch(() => { });
                }
            } catch (err) {
                console.error('Failed to notify custom group members:', err);
            }
        }
        return msg;
    }

    async markAsRead(userId: number, peerId: number | 'general' | string): Promise<void> {
        if (peerId === 'general') return;
        
        if (typeof peerId === 'string' && (peerId.startsWith('dept_') || peerId.startsWith('customgroup_'))) {
            // For now, group messages don't have individual read status in this simple system
            return;
        }

        // Mark all messages WHERE receiver is CURRENT user and sender is PEER
        await this.messagesRepo.update(
            { receiverId: userId, senderId: Number(peerId), isRead: false },
            { isRead: true }
        );
    }

    async update(id: number, data: Partial<InternalMessage>): Promise<void> {
        await this.messagesRepo.update(id, data);
    }

    async deleteMessage(id: number): Promise<void> {
        await this.messagesRepo.delete(id);
    }

    async clearChat(userId: number, peerId: number | 'general' | string): Promise<void> {
        if (peerId === 'general') {
            await this.messagesRepo.delete({ channel: 'general' });
        } else if (typeof peerId === 'string') {
            if (peerId.startsWith('dept_')) {
                await this.messagesRepo.delete({ channel: 'dept', deptName: peerId.replace('dept_', '') });
            } else if (peerId.startsWith('customgroup_')) {
                await this.messagesRepo.delete({ channel: 'group', groupId: Number(peerId.replace('customgroup_', '')) });
            }
        } else {
            // Clear DM between userId and peerId
            const msgs = await this.messagesRepo.find();
            const toDelete = msgs.filter(m =>
                (m.senderId === userId && m.receiverId === Number(peerId)) ||
                (m.senderId === Number(peerId) && m.receiverId === userId)
            );
            if (toDelete.length > 0) {
                await this.messagesRepo.remove(toDelete);
            }
        }
    }
}
