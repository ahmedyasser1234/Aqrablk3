import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Blog } from '../blog/blog.entity';
import { Video } from '../videos/video.entity';

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(Blog)
        private blogRepository: Repository<Blog>,
        @InjectRepository(Video)
        private videoRepository: Repository<Video>,
    ) { }

    async search(query: string) {
        if (!query) return { blogs: [], services: [] };
        const q = query.toLowerCase();

        // Service Mapping for bilingual search
        const serviceMap = {
            'motion': ['motion', 'موشن', 'جرافيك', 'graphics', 'whiteboard', 'وايت', 'بورد', 'collage', 'كولاج'],
            'montage': ['montage', 'مونتاج', 'فيديو', 'video', 'edit', 'تعديل', 'تلوين'],
            'photography': ['photography', 'تصوير', 'photo', 'camera', 'كاميرا', 'جلسة', 'session'],
            'design': ['design', 'تصميم', 'logo', 'لوجو', 'شعار', 'هوية', 'branding'],
            'web_design': ['web', 'website', 'موقع', 'مواقع', 'برمجة', 'shopify', 'شوبيفاي'],
            'content_writing': ['content', 'محتوى', 'كتابة', 'writing', 'مقالات', 'blogs']
        };

        const matchedCategories: any[] = [];
        for (const [cat, keywords] of Object.entries(serviceMap)) {
            if (keywords.some(k => q.includes(k))) {
                matchedCategories.push(Like(`%${cat}%`));
            }
        }

        const blogs = await this.blogRepository.find({
            where: [
                { titleAr: Like(`%${query}%`) },
                { titleEn: Like(`%${query}%`) },
                { contentAr: Like(`%${query}%`) },
                { contentEn: Like(`%${query}%`) },
            ],
            take: 10
        });

        // Search videos by category or matched keywords
        const videos = await this.videoRepository.find({
            where: [
                { category: Like(`%${query}%`) },
                ...matchedCategories.map(c => ({ category: c }))
            ],
            take: 10
        });

        return {
            blogs,
            services: videos
        };
    }
}
