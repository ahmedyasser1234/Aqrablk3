import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SupportService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.userRepository.find({ where: { role: 'support' } });
    }

    async create(data: Partial<User>): Promise<User> {
        const hashedPassword = await bcrypt.hash(data.password || 'support123', 10);
        const user = this.userRepository.create({
            ...data,
            password: hashedPassword,
            role: 'support'
        });
        return this.userRepository.save(user);
    }

    async update(id: number, data: Partial<User>): Promise<User | null> {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        await this.userRepository.update(id, data);
        return this.userRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
