import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('requests')
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) { }

    @Post()
    create(@Body() body: any) {
        return this.requestsService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.requestsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('pending-count')
    getPendingCount() {
        return this.requestsService.countPending();
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: string, @Body('handledBy') handledBy: string) {
        return this.requestsService.updateStatus(+id, status, handledBy);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.requestsService.delete(+id);
    }
}
