import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatbotKnowledge } from './chatbot.entity';

@Injectable()
export class ChatbotService {
    constructor(
        @InjectRepository(ChatbotKnowledge)
        private chatbotRepo: Repository<ChatbotKnowledge>,
    ) { }

    async findAll() {
        return this.chatbotRepo.find({ order: { createdAt: 'DESC' } });
    }

    async create(data: Partial<ChatbotKnowledge>) {
        const entry = this.chatbotRepo.create(data);
        return this.chatbotRepo.save(entry);
    }

    async update(id: number, data: Partial<ChatbotKnowledge>) {
        await this.chatbotRepo.update(id, data);
        return this.chatbotRepo.findOne({ where: { id } });
    }

    async remove(id: number) {
        return this.chatbotRepo.delete(id);
    }

    async getResponse(message: string, lang: string) {
        const knowledge = await this.chatbotRepo.find({ where: { language: lang } });

        // Simple keyword matching
        const normalizedMsg = message.toLowerCase();

        for (const entry of knowledge) {
            if (normalizedMsg.includes(entry.keyword.toLowerCase())) {
                return entry.answer;
            }
        }

        return null; // Let the fallback handle it or return a default
    }
}
