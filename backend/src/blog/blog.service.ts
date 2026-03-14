import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Blog)
        private blogRepository: Repository<Blog>,
    ) { }

    async findAll() {
        return this.blogRepository.find({ order: { createdAt: 'DESC' } });
    }

    async findOne(id: number) {
        const blog = await this.blogRepository.findOne({ where: { id } });
        if (!blog) throw new NotFoundException('Blog not found');
        return blog;
    }

    async findBySlug(slug: string) {
        const blog = await this.blogRepository.findOne({
            where: { slug },
            relations: ['comments']
        });
        if (!blog) throw new NotFoundException('Blog not found');

        // Filter comments manually if needed, or use a query builder for better performance
        blog.comments = blog.comments.filter(c => c.isApproved).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return blog;
    }

    async create(data: any) {
        const blog = this.blogRepository.create(data);
        return this.blogRepository.save(blog);
    }

    async update(id: number, data: any) {
        await this.blogRepository.update(id, data);
        return this.findOne(id);
    }

    async remove(id: number) {
        const blog = await this.findOne(id);
        return this.blogRepository.remove(blog);
    }
}
