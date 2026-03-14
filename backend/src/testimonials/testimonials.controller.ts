import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TestimonialsService } from './testimonials.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import sharp from 'sharp';
import * as fs from 'fs';
import { join } from 'path';

@Controller('testimonials')
export class TestimonialsController {
    constructor(private readonly testimonialsService: TestimonialsService) { }

    @Get()
    findAllApproved() {
        return this.testimonialsService.findAllApproved();
    }

    @UseGuards(JwtAuthGuard)
    @Get('admin')
    findAllAdmin() {
        return this.testimonialsService.findAllAdmin();
    }

    @UseGuards(JwtAuthGuard)
    @Get('unread-count')
    getUnreadCount() {
        return this.testimonialsService.getUnreadCount();
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/read')
    markAsRead(@Param('id') id: string) {
        return this.testimonialsService.markAsRead(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('mark-all-read')
    markAllAsRead() {
        return this.testimonialsService.markAllAsRead();
    }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async create(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
        if (file) {
            const uploadDir = './uploads/testimonials';
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const fileName = `${Date.now()}.webp`;
            const path = join(uploadDir, fileName);

            // Compress and convert to WebP
            await sharp(file.buffer)
                .resize(400, 400, { fit: 'cover' })
                .webp({ quality: 80 })
                .toFile(path);

            body.imagePath = `/uploads/testimonials/${fileName}`;
        }
        return this.testimonialsService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.testimonialsService.updateStatus(+id, status);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.testimonialsService.delete(+id);
    }
}
