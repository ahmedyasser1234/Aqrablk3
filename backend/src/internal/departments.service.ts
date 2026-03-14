import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalDepartment } from './department.entity';

@Injectable()
export class DepartmentsService implements OnModuleInit {
    constructor(
        @InjectRepository(InternalDepartment)
        private repo: Repository<InternalDepartment>,
    ) { }

    async onModuleInit() {
        const count = await this.repo.count();
        if (count === 0) {
            const initial = [
                { name: 'Video Editing', color: 'purple', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
                { name: 'Photography', color: 'pink', icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z' },
                { name: 'Web Development', color: 'blue', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
                { name: 'Social Media', color: 'green', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14' },
            ];
            await this.repo.save(initial);
        }
    }

    async findAll() {
        return this.repo.find({ order: { name: 'ASC' } });
    }

    async create(data: Partial<InternalDepartment>) {
        return this.repo.save(data);
    }

    async update(id: number, data: Partial<InternalDepartment>) {
        await this.repo.update(id, data);
        return this.repo.findOne({ where: { id } });
    }

    async delete(id: number) {
        await this.repo.delete(id);
    }
}
