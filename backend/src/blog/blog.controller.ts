import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import sharp from 'sharp';
import * as fs from 'fs';
import { join } from 'path';

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @Get()
    findAll() {
        return this.blogService.findAll();
    }

    @Get(':slug')
    findBySlug(@Param('slug') slug: string) {
        return this.blogService.findBySlug(slug);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async create(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
        if (file) {
            const uploadDir = './uploads/blog';
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const fileName = `${Date.now()}.webp`;
            const path = join(uploadDir, fileName);

            await sharp(file.buffer)
                .resize(1200, 800, { fit: 'cover' })
                .webp({ quality: 80 })
                .toFile(path);

            body.imagePath = `/uploads/blog/${fileName}`;
        }
        return this.blogService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    async update(@Param('id') id: string, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
        if (file) {
            const uploadDir = './uploads/blog';
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const fileName = `${Date.now()}.webp`;
            const path = join(uploadDir, fileName);

            await sharp(file.buffer)
                .resize(1200, 800, { fit: 'cover' })
                .webp({ quality: 80 })
                .toFile(path);

            body.imagePath = `/uploads/blog/${fileName}`;
        }
        return this.blogService.update(+id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.blogService.remove(+id);
    }
}
