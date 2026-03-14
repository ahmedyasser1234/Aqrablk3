import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRequest } from './request.entity';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { ChatModule } from '../chat/chat.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ServiceRequest]),
        forwardRef(() => ChatModule),
    ],
    controllers: [RequestsController],
    providers: [RequestsService],
    exports: [RequestsService],
})
export class RequestsModule { }
