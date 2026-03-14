import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminSettings } from './admin-settings.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSettingsService implements OnModuleInit {
    constructor(
        @InjectRepository(AdminSettings)
        private adminRepo: Repository<AdminSettings>,
    ) { }

    async onModuleInit() {
        await this.seedAdmin();
    }

    async seedAdmin() {
        const adminCount = await this.adminRepo.count({ where: { id: 1 } });
        if (adminCount === 0) {
            const hashed = await bcrypt.hash('admin123', 10);
            await this.adminRepo.save({ id: 1, name: 'المدير', password: hashed });
            console.log('✅ Default Admin profile seeded');
        }

        const chairmanCount = await this.adminRepo.count({ where: { id: 2 } });
        if (chairmanCount === 0) {
            const hashed = await bcrypt.hash('admin123', 10);
            await this.adminRepo.save({ id: 2, name: 'مجلس الإدارة', password: hashed });
            console.log('✅ Chairman profile seeded');
        }
    }

    async getSettings(): Promise<AdminSettings> {
        let settings = await this.adminRepo.findOne({ where: { id: 1 } });
        if (!settings) {
            await this.seedAdmin();
            settings = await this.adminRepo.findOne({ where: { id: 1 } });
        }
        return settings!;
    }

    async updateProfile(name?: string, avatar?: string): Promise<AdminSettings> {
        const data: any = {};
        if (name !== undefined) data.name = name;
        if (avatar !== undefined) data.avatar = avatar;
        
        await this.adminRepo.update(1, data);
        return this.getSettings();
    }

    async updatePassword(hashedPass: string): Promise<void> {
        await this.adminRepo.update(1, { password: hashedPass });
    }

    async getChairmanSettings(): Promise<AdminSettings> {
        let settings = await this.adminRepo.findOne({ where: { id: 2 } });
        if (!settings) {
            await this.seedAdmin();
            settings = await this.adminRepo.findOne({ where: { id: 2 } });
        }
        return settings!;
    }

    async updateChairmanProfile(name?: string, avatar?: string): Promise<AdminSettings> {
        const data: any = {};
        if (name !== undefined) data.name = name;
        if (avatar !== undefined) data.avatar = avatar;
        
        await this.adminRepo.update(2, data);
        return this.getChairmanSettings();
    }

    async updateChairmanPassword(hashedPass: string): Promise<void> {
        await this.adminRepo.update(2, { password: hashedPass });
    }
    
    async getSettingsById(id: number): Promise<AdminSettings | null> {
        return this.adminRepo.findOne({ where: { id } });
    }
}
