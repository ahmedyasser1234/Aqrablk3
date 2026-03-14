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
        console.log(`Validating user: ${username}`);
        const user = await this.usersService.findOne(username);
        if (!user) {
            console.log(`User not found: ${username}`);
            return null;
        }

        const isMatch = await bcrypt.compare(pass, user.password);
        if (isMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        console.log(`Logging in user: ${user.username}`);
        const payload = { username: user.username, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                name: user.name || 'Support',
                username: user.username,
                role: user.role
            }
        };
    }

    // Helper to create initial admin
    async createAdmin() {
        const existing = await this.usersService.findOne('admin');
        if (!existing) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await this.usersService.create({
                username: 'admin',
                password: hashedPassword,
                name: 'الدعم الفني', // Default name in Arabic
                role: 'superadmin'
            });
            console.log('Superadmin user created: admin / admin123');
        } else if (existing.role !== 'superadmin') {
            await this.usersService.update(existing.id, { role: 'superadmin' });
            console.log('Existing admin promoted to superadmin');
        }
    }
}
