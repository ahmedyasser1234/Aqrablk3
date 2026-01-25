import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visit } from './visit.entity';
import * as geoip from 'geoip-lite';

@Injectable()
export class VisitService {
    constructor(
        @InjectRepository(Visit)
        private visitRepository: Repository<Visit>,
    ) { }

    async track(ip: string, page: string) {
        const geo = geoip.lookup(ip);

        // Normalize IP for localhost
        const cleanIp = ip === '::1' || ip === '127.0.0.1' ? '127.0.0.1' : ip;

        let country = geo?.country;
        let city = geo?.city;

        // Simulate location for Localhost (Dev Mode)
        if (cleanIp === '127.0.0.1') {
            country = 'EG'; // Egypt
            city = 'Cairo';
        }

        const visit = this.visitRepository.create({
            page,
            ip: cleanIp,
            country: country || 'Unknown',
            city: city || 'Unknown',
        });

        return this.visitRepository.save(visit);
    }

    async getStats() {
        const total = await this.visitRepository.count();

        const pages = await this.visitRepository
            .createQueryBuilder('visit')
            .select('visit.page', 'page')
            .addSelect('COUNT(visit.id)', 'count')
            .groupBy('visit.page')
            .orderBy('count', 'DESC')
            .getRawMany();

        const countries = await this.visitRepository
            .createQueryBuilder('visit')
            .select('visit.country', 'country')
            .addSelect('COUNT(visit.id)', 'count')
            .groupBy('visit.country')
            .orderBy('count', 'DESC')
            .getRawMany();

        return { total, pages, countries };
    }
}
