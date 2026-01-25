import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    // Helper to create initial admin
    async createAdmin() {
        const existing = await this.usersService.findOne('admin');
        if (!existing) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await this.usersService.create({ username: 'admin', password: hashedPassword });
            console.log('Admin user created: admin / admin123');
        }
    }
}
