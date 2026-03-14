import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';
import { Blog } from './blog.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Comment, Blog])],
    controllers: [CommentsController],
    providers: [CommentsService],
    exports: [CommentsService]
})
export class CommentsModule { }
