import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.use('/static', express.static(join(__dirname, '..', 'static')));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
