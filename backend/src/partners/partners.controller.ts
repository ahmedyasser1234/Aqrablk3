import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('partners')
export class PartnersController {
    constructor(private readonly partnersService: PartnersService) { }

    @Get()
    findAll() {
        return this.partnersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body: { name: string; logoUrl: string }) {
        return this.partnersService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.partnersService.delete(+id);
    }
}
