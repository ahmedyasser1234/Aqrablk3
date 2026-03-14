import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chatbot')
export class ChatbotController {
    constructor(private readonly chatbotService: ChatbotService) { }

    @Get('ask')
    async ask(@Query('q') query: string, @Query('lang') lang: string) {
        const response = await this.chatbotService.getResponse(query, lang || 'ar');
        return { response };
    }

    @UseGuards(JwtAuthGuard)
    @Get('admin')
    findAll() {
        return this.chatbotService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() data: any) {
        return this.chatbotService.create(data);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.chatbotService.update(+id, data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.chatbotService.remove(+id);
    }
}
