import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 全局前缀 /api
  app.setGlobalPrefix('api');

  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // CORS 允许跨域
  app.enableCors();

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);
  console.log(`ReelRWA Backend running on port ${port}`);
}
bootstrap();
