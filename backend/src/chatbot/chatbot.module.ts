import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotKnowledge } from './chatbot.entity';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ChatbotKnowledge])],
    controllers: [ChatbotController],
    providers: [ChatbotService],
    exports: [ChatbotService],
})
export class ChatbotModule { }
