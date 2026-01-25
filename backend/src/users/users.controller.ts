import { Controller, Post, Patch, Body, UseGuards, Request, ConflictException, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createAdmin(@Body() body) {
        const { username, password } = body;
        if (!username || !password) throw new ForbiddenException('Username and password required');

        const existing = await this.usersService.findOne(username);
        if (existing) throw new ConflictException('Username already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        return this.usersService.create({ username, password: hashedPassword });
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me/password')
    async updatePassword(@Request() req, @Body() body) {
        const { newPassword } = body;
        if (!newPassword) throw new ForbiddenException('New password required');

        await this.usersService.updatePassword(req.user.userId, newPassword);
        return { message: 'Password updated successfully' };
    }
}
