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
        // Normalize IP
        const cleanIp = ip.replace('::ffff:', '');
        const isLocal = cleanIp === '::1' || cleanIp === '127.0.0.1';

        const geo = geoip.lookup(cleanIp);

        let country = geo?.country;
        let city = geo?.city;

        // Simulate location for Localhost (Dev Mode)
        if (isLocal) {
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

        const daily = await this.visitRepository
            .createQueryBuilder('visit')
            .select("strftime('%Y-%m-%d', visit.timestamp)", 'date')
            .addSelect('COUNT(visit.id)', 'count')
            .where("visit.timestamp > date('now', '-7 days')")
            .groupBy('date')
            .orderBy('date', 'ASC')
            .getRawMany();

        return { total, pages, countries, daily };
    }
}
