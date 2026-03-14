import { Controller, Get, Header, Res } from '@nestjs/common';
import { SitemapService } from './sitemap.service';
import { Response } from 'express';

@Controller()
export class SitemapController {
    constructor(private readonly sitemapService: SitemapService) { }

    @Get('sitemap.xml')
    @Header('Content-Type', 'application/xml')
    async getSitemap() {
        return this.sitemapService.generateSitemap();
    }

    @Get('robots.txt')
    @Header('Content-Type', 'text/plain')
    async getRobots() {
        return this.sitemapService.generateRobots();
    }
}
