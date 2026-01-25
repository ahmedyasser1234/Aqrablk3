import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { VisitService } from './visit.service';
import type { Request } from 'express';
import * as requestIp from 'request-ip';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
export class VisitController {
    constructor(private readonly visitService: VisitService) { }

    @Post('track')
    async trackVisits(@Body() body: { page: string }, @Req() req: Request) {
        const clientIp = requestIp.getClientIp(req);
        return this.visitService.track(clientIp || '0.0.0.0', body.page);
    }

    @UseGuards(JwtAuthGuard)
    @Get('stats')
    async getStats() {
        return this.visitService.getStats();
    }
}
