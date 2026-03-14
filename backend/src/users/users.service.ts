import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findOne(username: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { username } });
    }

    async findById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async create(user: Partial<User>): Promise<User | null> {
        return this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async update(id: number, data: Partial<User>): Promise<User | null> {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        await this.usersRepository.update(id, data);
        return this.usersRepository.findOne({ where: { id } });
    }

    async updatePassword(userId: number, newPass: string): Promise<void> {
        const hashedPassword = await bcrypt.hash(newPass, 10);
        await this.usersRepository.update(userId, { password: hashedPassword });
    }
}
