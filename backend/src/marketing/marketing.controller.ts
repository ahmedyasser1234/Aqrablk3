import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MarketingItem } from './marketing-item.entity';

@Controller('marketing')
export class MarketingController {
    constructor(private readonly marketingService: MarketingService) { }

    @Get()
    findAll() {
        return this.marketingService.findAll();
    }

    @Get('category/:cat')
    findByCategory(@Param('cat') cat: 'solution' | 'step') {
        return this.marketingService.findByCategory(cat);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() data: Partial<MarketingItem>) {
        return this.marketingService.create(data);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() data: Partial<MarketingItem>) {
        return this.marketingService.update(+id, data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.marketingService.delete(+id);
    }
}
