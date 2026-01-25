import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VisitModule } from './visit/visit.module';
import { Visit } from './visit/visit.entity';
import { User } from './users/user.entity';
import { ChatMessage } from './chat/chat_message.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'analytics.db',
      entities: [Visit, User, ChatMessage],
      synchronize: true,
    }),
    VisitModule,
    AuthModule,
    UsersModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
