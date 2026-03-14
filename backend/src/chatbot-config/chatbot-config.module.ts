import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotConfig } from './chatbot-config.entity';
import { ChatbotConfigService } from './chatbot-config.service';
import { ChatbotConfigController } from './chatbot-config.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ChatbotConfig])],
    controllers: [ChatbotConfigController],
    providers: [ChatbotConfigService],
    exports: [ChatbotConfigService],
})
export class ChatbotConfigModule { }
