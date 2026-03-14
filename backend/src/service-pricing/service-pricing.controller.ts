import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ServicePricingService } from './service-pricing.service';
import { ServicePricing } from './service-pricing.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('service-pricing')
export class ServicePricingController {
    constructor(private readonly servicePricingService: ServicePricingService) { }

    @Get()
    async findAll(): Promise<ServicePricing[]> {
        return this.servicePricingService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<ServicePricing | null> {
        return this.servicePricingService.findOne(id);
    }

    @Get('category/:category')
    async findByCategory(@Param('category') category: string): Promise<ServicePricing | null> {
        return this.servicePricingService.findByCategory(category);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() data: Partial<ServicePricing>): Promise<ServicePricing> {
        return this.servicePricingService.create(data);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: number,
        @Body() data: Partial<ServicePricing>
    ): Promise<ServicePricing> {
        return this.servicePricingService.update(id, data);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id: number): Promise<void> {
        return this.servicePricingService.delete(id);
    }

    @Post('calculate')
    async calculatePrice(
        @Body() body: { category: string; duration: number; additionalOptions?: string[] }
    ): Promise<{ price: number; currency: string; breakdown: any }> {
        return this.servicePricingService.calculatePrice(
            body.category,
            body.duration,
            body.additionalOptions || []
        );
    }
}
