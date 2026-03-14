import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seo } from './seo.entity';
import { SeoService } from './seo.service';
import { SeoController } from './seo.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Seo])],
    providers: [SeoService],
    controllers: [SeoController],
    exports: [SeoService],
})
export class SeoModule { }
