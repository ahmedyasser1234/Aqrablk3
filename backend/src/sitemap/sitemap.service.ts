import { Injectable } from '@nestjs/common';

@Injectable()
export class SitemapService {
    private readonly baseUrl = 'https://aqrablkmedia.com';

    async generateSitemap(): Promise<string> {
        const staticPages = [
            '',
            '/about',
            '/contact',
            '/services',
            '/services/motion-graphics',
            '/services/montage',
            '/services/photography',
            '/services/design',
            '/services/studio-rental',
            '/services/web-design',
            '/services/content-writing',
            '/services/marketing',
        ];

        const languages = ['ar', 'en'];
        const urls: string[] = [];

        languages.forEach(lang => {
            staticPages.forEach(page => {
                urls.push(`${this.baseUrl}/${lang}${page}`);
            });
        });

        // Add sitemap header
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        urls.forEach(url => {
            xml += '  <url>\n';
            xml += `    <loc>${url}</loc>\n`;
            xml += '    <changefreq>weekly</changefreq>\n';
            xml += '    <priority>0.8</priority>\n';
            xml += '  </url>\n';
        });

        xml += '</urlset>';
        return xml;
    }

    async generateRobots(): Promise<string> {
        return `User-agent: *
Allow: /
Sitemap: ${this.baseUrl}/sitemap.xml`;
    }
}
