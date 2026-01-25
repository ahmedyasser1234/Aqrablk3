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

    async create(user: Partial<User>): Promise<User | null> {
        return this.usersRepository.save(user);
    }

    async updatePassword(userId: number, newPass: string): Promise<void> {
        const hashedPassword = await bcrypt.hash(newPass, 10);
        await this.usersRepository.update(userId, { password: hashedPassword });
    }
}
