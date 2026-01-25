import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitService } from './visit.service';
import { VisitController } from './visit.controller';
import { Visit } from './visit.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Visit])],
    controllers: [VisitController],
    providers: [VisitService],
})
export class VisitModule { }
