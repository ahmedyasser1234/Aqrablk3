import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicePricing } from './service-pricing.entity';
import { ServicePricingService } from './service-pricing.service';
import { ServicePricingController } from './service-pricing.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ServicePricing])],
    controllers: [ServicePricingController],
    providers: [ServicePricingService],
    exports: [ServicePricingService],
})
export class ServicePricingModule { }
