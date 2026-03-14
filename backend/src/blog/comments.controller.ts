import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post()
    create(@Body() body: any) {
        return this.commentsService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.commentsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/approve')
    approve(@Param('id') id: string) {
        return this.commentsService.approve(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.commentsService.remove(+id);
    }
}
