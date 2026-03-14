import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Blog } from '../blog/blog.entity';
import { Video } from '../videos/video.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Blog, Video])],
    controllers: [SearchController],
    providers: [SearchService],
})
export class SearchModule { }
