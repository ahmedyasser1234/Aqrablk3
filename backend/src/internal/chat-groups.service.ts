import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalChatGroup } from './chat-group.entity';

@Injectable()
export class ChatGroupsService {
    constructor(
        @InjectRepository(InternalChatGroup)
        private groupRepo: Repository<InternalChatGroup>,
    ) { }

    async createGroup(name: string, adminId: number, memberIds: number[]): Promise<InternalChatGroup> {
        // Ensure adminId is in the memberIds array
        const members = Array.from(new Set([...memberIds, adminId]));
        
        const group = this.groupRepo.create({
            name,
            adminId,
            memberIds: members
        });
        return this.groupRepo.save(group);
    }

    async getGroupsForUser(userId: number): Promise<InternalChatGroup[]> {
        // Find all groups where the userId is in the memberIds JSON array
        // TypeORM logic for finding in simple-json arrays can be tricky in SQLite
        // Easiest robust approach for a small system: Fetch all and filter in memory, 
        // OR use a LIKE query if performance allows. We'll use memory filtering for perfect JSON matching.
        
        const allGroups = await this.groupRepo.find();
        return allGroups.filter(g => g.memberIds && g.memberIds.includes(userId));
    }

    async getGroupById(id: number): Promise<InternalChatGroup> {
        const group = await this.groupRepo.findOne({ where: { id } });
        if (!group) throw new NotFoundException('Group not found');
        return group;
    }

    async deleteGroup(id: number, adminId: number): Promise<void> {
        const group = await this.getGroupById(id);
        if (group.adminId !== adminId) {
            throw new Error('Only the group admin can delete this group');
        }
        await this.groupRepo.delete(id);
    }
}
