import { Controller, Post, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import sharp from 'sharp';
import * as fs from 'fs';
import { join } from 'path';

@Controller('upload')
export class UploadController {
    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        const fileName = `${randomName}.webp`;
        const path = join(uploadDir, fileName);

        // Compress and convert to WebP
        await sharp(file.buffer)
            .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(path);

        return {
            url: `/uploads/${fileName}`,
        };
    }
}
