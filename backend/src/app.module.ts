import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VisitModule } from './visit/visit.module';
import { Visit } from './visit/visit.entity';
import { User } from './users/user.entity';
import { ChatMessage } from './chat/chat_message.entity';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { RequestsModule } from './requests/requests.module';
import { ServiceRequest } from './requests/request.entity';
import { SupportModule } from './support/support.module';
import { SupportEmail } from './support/support_email.entity';
import { Partner } from './partners/partner.entity';
import { PartnersModule } from './partners/partners.module';
import { Testimonial } from './testimonials/testimonial.entity';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { VideosModule } from './videos/videos.module';
import { Video } from './videos/video.entity';
import { UploadController } from './uploads.controller';
import { SeoModule } from './seo/seo.module';
import { Seo } from './seo/seo.entity';
import { MarketingModule } from './marketing/marketing.module';
import { MarketingItem } from './marketing/marketing-item.entity';
import { SitemapModule } from './sitemap/sitemap.module';
import { BlogModule } from './blog/blog.module';
import { Blog } from './blog/blog.entity';
import { Comment } from './blog/comment.entity';
import { CommentsModule } from './blog/comments.module';
import { SearchModule } from './search/search.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ChatbotKnowledge } from './chatbot/chatbot.entity';
import { NewsletterModule } from './newsletter/newsletter.module';
import { NewsletterSubscriber } from './newsletter/newsletter.entity';
import { ChatbotConfigModule } from './chatbot-config/chatbot-config.module';
import { ChatbotConfig } from './chatbot-config/chatbot-config.entity';
import { ServicePricingModule } from './service-pricing/service-pricing.module';
import { ServicePricing } from './service-pricing/service-pricing.entity';
import { InternalModule } from './internal/internal.module';
import { Employee } from './internal/employee.entity';
import { InternalTask } from './internal/task.entity';
import { InternalMessage } from './internal/internal-message.entity';
import { InternalNotification } from './internal/notification.entity';

import { InternalDepartment } from './internal/department.entity';
import { AdminSettings } from './internal/admin-settings.entity';
import { InternalChatGroup } from './internal/chat-group.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'analytics.db',
      entities: [Visit, User, ChatMessage, ServiceRequest, SupportEmail, Partner, Testimonial, Video, Seo, MarketingItem, Blog, Comment, ChatbotKnowledge, NewsletterSubscriber, ChatbotConfig, ServicePricing, Employee, InternalTask, InternalMessage, InternalNotification, InternalDepartment, AdminSettings, InternalChatGroup],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    VisitModule,
    AuthModule,
    UsersModule,
    ChatModule,
    RequestsModule,
    SupportModule,
    PartnersModule,
    TestimonialsModule,
    VideosModule,
    SeoModule,
    MarketingModule,
    SitemapModule,
    BlogModule,
    CommentsModule,
    SearchModule,
    ChatbotModule,
    NewsletterModule,
    ChatbotConfigModule,
    ServicePricingModule,
    InternalModule
  ],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private authService: AuthService) { }

  async onModuleInit() {
    await this.authService.createAdmin();
    console.log('✅ Superadmin initialization complete');
  }
}
