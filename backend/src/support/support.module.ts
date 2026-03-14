import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [SupportService],
    controllers: [SupportController],
    exports: [SupportService]
})
export class SupportModule { }
