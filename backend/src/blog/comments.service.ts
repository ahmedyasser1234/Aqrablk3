import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
    ) { }

    async findAll() {
        return this.commentRepository.find({ order: { createdAt: 'DESC' }, relations: ['blog'] });
    }

    async findApprovedByBlog(blogId: number) {
        return this.commentRepository.find({
            where: { blog: { id: blogId }, isApproved: true },
            order: { createdAt: 'DESC' }
        });
    }

    async create(data: any) {
        const comment = this.commentRepository.create(data);
        return this.commentRepository.save(comment);
    }

    async approve(id: number) {
        await this.commentRepository.update(id, { isApproved: true });
        return this.findOne(id);
    }

    async findOne(id: number) {
        const comment = await this.commentRepository.findOne({ where: { id }, relations: ['blog'] });
        if (!comment) throw new NotFoundException('Comment not found');
        return comment;
    }

    async remove(id: number) {
        const comment = await this.findOne(id);
        return this.commentRepository.remove(comment);
    }
}
