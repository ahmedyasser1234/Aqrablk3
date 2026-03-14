import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './partner.entity';

@Injectable()
export class PartnersService {
    constructor(
        @InjectRepository(Partner)
        private partnerRepository: Repository<Partner>,
    ) { }

    create(data: Partial<Partner>) {
        const partner = this.partnerRepository.create(data);
        return this.partnerRepository.save(partner);
    }

    findAll() {
        return this.partnerRepository.find();
    }

    async delete(id: number) {
        await this.partnerRepository.delete(id);
        return { deleted: true };
    }
}
