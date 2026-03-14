import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ForbiddenException, Request } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('support-emails')
export class SupportController {
    constructor(private supportService: SupportService) { }

    @Get()
    async findAll() {
        return this.supportService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Request() req, @Body() body) {
        if (req.user.role !== 'superadmin') {
            throw new ForbiddenException('Only superadmin can manage support emails');
        }
        return this.supportService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Request() req, @Param('id') id: string, @Body() body) {
        if (req.user.role !== 'superadmin') {
            throw new ForbiddenException('Only superadmin can manage support emails');
        }
        return this.supportService.update(+id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Request() req, @Param('id') id: string) {
        if (req.user.role !== 'superadmin') {
            throw new ForbiddenException('Only superadmin can manage support emails');
        }
        await this.supportService.remove(+id);
        return { message: 'Support email deleted' };
    }
}
