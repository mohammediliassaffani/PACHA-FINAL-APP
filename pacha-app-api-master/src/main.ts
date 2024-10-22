import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  const { PORT, CLIENT_BASE_URL, CLIENT_APP_BASE_URL } = process.env;

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: [CLIENT_BASE_URL, CLIENT_APP_BASE_URL],
    credentials: true,
  });

  await app.listen(PORT, () => Logger.log('App running on port ' + PORT));
}
bootstrap();
