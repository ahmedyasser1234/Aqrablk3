import { Controller, Get, Body, Patch, Param, UseGuards, Delete, Query } from '@nestjs/common';
import { SeoService } from './seo.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('seo')
export class SeoController {
    constructor(private readonly seoService: SeoService) { }

    @Get()
    findAll() {
        return this.seoService.findAll();
    }

    @Get(':path')
    findByPath(@Param('path') path: string) {
        return this.seoService.findByPath('/' + path.replace(/_/g, '/'));
    }

    @UseGuards(JwtAuthGuard)
    @Patch()
    update(@Body() data: { pagePath: string, titleAr?: string, titleEn?: string, descriptionAr?: string, descriptionEn?: string, keywordsAr?: string, keywordsEn?: string }) {
        return this.seoService.update(data.pagePath, data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    remove(@Query('path') path: string) {
        return this.seoService.remove(path);
    }
}
