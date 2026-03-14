import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatbotConfig } from './chatbot-config.entity';

@Injectable()
export class ChatbotConfigService {
    constructor(
        @InjectRepository(ChatbotConfig)
        private chatbotConfigRepository: Repository<ChatbotConfig>,
    ) { }

    async getConfig(): Promise<ChatbotConfig> {
        let config = await this.chatbotConfigRepository.findOne({ where: { isActive: true } });

        if (!config) {
            // Create default config if none exists
            config = this.chatbotConfigRepository.create({
                welcomeMessage: 'مرحباً! أنا هنا لمساعدتك. كيف يمكنني خدمتك اليوم؟',
                welcomeMessageEn: 'Hello! I\'m here to help you. How can I assist you today?',
                keywords: [
                    {
                        keyword: 'سعر موشن',
                        response: 'أسعار الموشن جرافيك تبدأ من 500 جنيه للدقيقة. يمكنك طلب عرض سعر مخصص!',
                        responseEn: 'Motion graphics prices start from 500 EGP per minute. You can request a custom quote!'
                    }
                ],
                isActive: true,
            });
            await this.chatbotConfigRepository.save(config);
        }

        return config;
    }

    async updateConfig(data: Partial<ChatbotConfig>): Promise<ChatbotConfig> {
        const config = await this.getConfig();
        Object.assign(config, data);
        return this.chatbotConfigRepository.save(config);
    }

    async addKeyword(keyword: string, response: string, responseEn: string): Promise<ChatbotConfig> {
        const config = await this.getConfig();
        config.keywords.push({ keyword, response, responseEn });
        return this.chatbotConfigRepository.save(config);
    }

    async removeKeyword(keyword: string): Promise<ChatbotConfig> {
        const config = await this.getConfig();
        config.keywords = config.keywords.filter(k => k.keyword !== keyword);
        return this.chatbotConfigRepository.save(config);
    }

    async findResponse(message: string): Promise<string | null> {
        const config = await this.getConfig();
        const lowerMessage = message.toLowerCase();

        for (const kw of config.keywords) {
            if (lowerMessage.includes(kw.keyword.toLowerCase())) {
                return kw.response;
            }
        }

        return null;
    }
}
