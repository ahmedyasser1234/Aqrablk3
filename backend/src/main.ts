import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Production-ready CORS
  app.enableCors({
    origin: true, // Automatically reflect request origin in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3545;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend is running on port: ${port}`);
}
bootstrap();
