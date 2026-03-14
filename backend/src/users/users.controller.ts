import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request, ConflictException, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createAdmin(@Request() req, @Body() body) {
        // Only superadmin can create admins
        if (req.user.role !== 'superadmin') {
            throw new ForbiddenException('Only superadmin can create new admins');
        }

        const { username, password, name, role } = body;
        console.log(`Creating admin: ${username}`);
        if (!username || !password) throw new ForbiddenException('Username and password required');

        const existing = await this.usersService.findOne(username);
        if (existing) {
            console.log(`Admin creation failed: Username ${username} already exists`);
            throw new ConflictException('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const savedUser = await this.usersService.create({
            username,
            password: hashedPassword,
            name: name || '',
            role: role || 'support'
        });
        return savedUser;
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Request() req) {
        if (req.user.role !== 'superadmin') {
            throw new ForbiddenException('Access denied');
        }
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Request() req, @Param('id') id: string, @Body() body) {
        if (req.user.role !== 'superadmin') {
            throw new ForbiddenException('Access denied');
        }
        return this.usersService.update(+id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Request() req, @Param('id') id: string) {
        if (req.user.role !== 'superadmin') {
            throw new ForbiddenException('Access denied');
        }
        await this.usersService.remove(+id);
        return { message: 'Admin deleted' };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Request() req) {
        return {
            id: req.user.userId,
            username: req.user.username,
            role: req.user.role
        };
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
