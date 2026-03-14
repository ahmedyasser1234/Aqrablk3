import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeesService implements OnModuleInit {
    constructor(
        @InjectRepository(Employee)
        private employeesRepo: Repository<Employee>,
    ) { }

    async onModuleInit() {
        await this.seedEmployees();
    }

    async seedEmployees() {
        const count = await this.employeesRepo.count();
        if (count === 0) {
            const defaultEmployees = [
                { username: 'ahmed', password: 'pass123', name: 'أحمد علي', department: 'Video Editing' },
                { username: 'sara', password: 'pass123', name: 'سارة محمد', department: 'Photography' },
                { username: 'yassin', password: 'pass123', name: 'ياسين محمود', department: 'Web Development' },
                { username: 'laila', password: 'pass123', name: 'ليلى حسن', department: 'Social Media' },
                { username: 'omar', password: 'pass123', name: 'عمر خالد', department: 'Video Editing' },
            ];
            for (const emp of defaultEmployees) {
                const hashed = await bcrypt.hash(emp.password, 10);
                await this.employeesRepo.save({ ...emp, password: hashed });
            }
            console.log('✅ Default employees seeded');
        }
    }

    async findAll(): Promise<any[]> {
        const employees = await this.employeesRepo.find();
        return employees.map(({ password, ...rest }) => rest);
    }

    async findOne(username: string): Promise<Employee | null> {
        return this.employeesRepo.findOne({ where: { username } });
    }

    async findById(id: number): Promise<Employee | null> {
        return this.employeesRepo.findOne({ where: { id } });
    }

    async setStatus(id: number, status: string): Promise<void> {
        const updateData: any = { status };
        if (status === 'offline') {
            updateData.lastSeen = new Date();
        }
        await this.employeesRepo.update(id, updateData);
    }

    async updateStats(id: number, completedTasks: number, totalWorkTime: string): Promise<void> {
        await this.employeesRepo.update(id, { completedTasks, totalWorkTime });
    }

    async updateRewardStats(id: number, points: number, delayDebtMinutes: number): Promise<void> {
        await this.employeesRepo.update(id, { points, delayDebtMinutes });
    }

    async validate(username: string, password: string): Promise<any | null> {
        const emp = await this.findOne(username);
        if (!emp || !emp.isActive) return null;
        const isMatch = await bcrypt.compare(password, emp.password);
        if (!isMatch) return null;
        const { password: _, ...result } = emp;
        return result;
    }

    async updateProfile(id: number, data: { name?: string; avatar?: string }): Promise<Employee | null> {
        await this.employeesRepo.update(id, data);
        return this.findById(id);
    }

    async create(data: { username: string, name: string, department: string, password?: string, avatar?: string }): Promise<Employee> {
        const password = data.password || 'pass123';
        const hashed = await bcrypt.hash(password, 10);
        const employee = this.employeesRepo.create({
            ...data,
            password: hashed,
            status: 'offline',
            completedTasks: 0,
            totalWorkTime: '00:00:00'
        });
        return this.employeesRepo.save(employee);
    }

    async changePassword(id: number, oldPass: string, newPass: string): Promise<boolean> {
        const emp = await this.employeesRepo.findOne({ where: { id } });
        if (!emp) return false;

        const isMatch = await bcrypt.compare(oldPass, emp.password);
        if (!isMatch) return false;

        const hashed = await bcrypt.hash(newPass, 10);
        await this.employeesRepo.update(id, { password: hashed });
        return true;
    }

    async toggleActive(id: number): Promise<Employee | null> {
        const emp = await this.findById(id);
        if (!emp) return null;
        if (emp.username === 'ahmed') return emp; // Don't deactivate the main admin
        await this.employeesRepo.update(id, { isActive: !emp.isActive });
        return this.findById(id);
    }

    async remove(id: number): Promise<boolean> {
        const emp = await this.findById(id);
        if (!emp || emp.username === 'ahmed') return false; // Don't delete the main admin
        await this.employeesRepo.delete(id);
        return true;
    }
}
