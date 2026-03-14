import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './video.entity';

@Injectable()
export class VideosService {
    constructor(
        @InjectRepository(Video)
        private readonly videoRepository: Repository<Video>,
    ) { }

    findAll() {
        return this.videoRepository.find({ order: { createdAt: 'DESC' } });
    }

    findByCategory(category: string) {
        return this.videoRepository.find({
            where: { category },
            order: { createdAt: 'ASC' },
        });
    }

    create(data: Partial<Video>) {
        const video = this.videoRepository.create(data);
        return this.videoRepository.save(video);
    }

    async update(id: number, data: Partial<Video>) {
        await this.videoRepository.update(id, data);
        return this.videoRepository.findOneBy({ id });
    }

    async delete(id: number) {
        await this.videoRepository.delete(id);
        return { deleted: true };
    }
}
