import { Controller, Post, Get, Body, UseGuards, Delete, Param } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('newsletter')
export class NewsletterController {
    constructor(private readonly newsletterService: NewsletterService) { }

    @Post('subscribe')
    subscribe(@Body('email') email: string) {
        return this.newsletterService.subscribe(email);
    }

    @UseGuards(JwtAuthGuard)
    @Get('subscribers')
    findAll() {
        return this.newsletterService.findAll();
    }

    @Post('unsubscribe')
    unsubscribe(@Body('email') email: string) {
        return this.newsletterService.unsubscribe(email);
    }
}
