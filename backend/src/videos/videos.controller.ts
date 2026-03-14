import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { VideosService } from './videos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('videos')
export class VideosController {
    constructor(private readonly videosService: VideosService) { }

    @Get()
    findAll(@Query('category') category?: string) {
        if (category) {
            return this.videosService.findByCategory(category);
        }
        return this.videosService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body: any) {
        // Simple extraction of ID if full URL is provided
        if (body.youtubeId.includes('v=')) {
            body.youtubeId = body.youtubeId.split('v=')[1].split('&')[0];
        } else if (body.youtubeId.includes('youtu.be/')) {
            body.youtubeId = body.youtubeId.split('youtu.be/')[1].split('?')[0];
        } else if (body.youtubeId.includes('embed/')) {
            body.youtubeId = body.youtubeId.split('embed/')[1].split('?')[0];
        }
        return this.videosService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.videosService.update(+id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.videosService.delete(+id);
    }
}
