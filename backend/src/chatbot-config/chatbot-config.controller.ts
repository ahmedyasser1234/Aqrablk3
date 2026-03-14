import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ChatbotConfigService } from './chatbot-config.service';
import { ChatbotConfig } from './chatbot-config.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chatbot-config')
export class ChatbotConfigController {
    constructor(private readonly chatbotConfigService: ChatbotConfigService) { }

    @Get()
    async getConfig(): Promise<ChatbotConfig> {
        return this.chatbotConfigService.getConfig();
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    async updateConfig(@Body() data: Partial<ChatbotConfig>): Promise<ChatbotConfig> {
        return this.chatbotConfigService.updateConfig(data);
    }

    @Post('keywords')
    @UseGuards(JwtAuthGuard)
    async addKeyword(
        @Body() body: { keyword: string; response: string; responseEn: string }
    ): Promise<ChatbotConfig> {
        return this.chatbotConfigService.addKeyword(body.keyword, body.response, body.responseEn);
    }

    @Delete('keywords/:keyword')
    @UseGuards(JwtAuthGuard)
    async removeKeyword(@Param('keyword') keyword: string): Promise<ChatbotConfig> {
        return this.chatbotConfigService.removeKeyword(keyword);
    }

    @Post('find-response')
    async findResponse(@Body() body: { message: string }): Promise<{ response: string | null }> {
        const response = await this.chatbotConfigService.findResponse(body.message);
        return { response };
    }
}
