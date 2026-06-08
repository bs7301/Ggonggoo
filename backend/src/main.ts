import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 허용 (프론트엔드 연결용)
  app.enableCors({
    origin: ['http://localhost:3005', 'http://127.0.0.1:3005'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

  // DTO 유효성 검증 활성화
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // /api prefix
  app.setGlobalPrefix('api');

  await app.listen(3000);
  console.log('🚀 Backend running on http://localhost:3000');
}
bootstrap();
