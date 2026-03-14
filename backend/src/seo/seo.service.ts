import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seo } from './seo.entity';

@Injectable()
export class SeoService {
    constructor(
        @InjectRepository(Seo)
        private seoRepository: Repository<Seo>,
    ) { }

    findAll() {
        return this.seoRepository.find();
    }

    findByPath(path: string) {
        return this.seoRepository.findOneBy({ pagePath: path });
    }

    async update(path: string, data: Partial<Seo>) {
        const seo = await this.findByPath(path);
        if (seo) {
            await this.seoRepository.update(seo.id, data);
            return this.findByPath(path);
        } else {
            const newSeo = this.seoRepository.create({ ...data, pagePath: path });
            return this.seoRepository.save(newSeo);
        }
    }

    async remove(path: string) {
        const seo = await this.findByPath(path);
        if (seo) {
            await this.seoRepository.remove(seo);
        }
    }
}
