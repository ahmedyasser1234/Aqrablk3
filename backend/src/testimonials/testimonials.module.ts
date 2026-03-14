import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Testimonial } from './testimonial.entity';
import { TestimonialsService } from './testimonials.service';
import { TestimonialsController } from './testimonials.controller';
import { ChatModule } from '../chat/chat.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Testimonial]),
        forwardRef(() => ChatModule)
    ],
    controllers: [TestimonialsController],
    providers: [TestimonialsService],
})
export class TestimonialsModule { }
