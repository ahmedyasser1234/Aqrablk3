import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketingItem } from './marketing-item.entity';
import { MarketingService } from './marketing.service';
import { MarketingController } from './marketing.controller';

@Module({
    imports: [TypeOrmModule.forFeature([MarketingItem])],
    providers: [MarketingService],
    controllers: [MarketingController],
})
export class MarketingModule { }
