import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// 自定义管道
// import { ValidationPipe } from '@nestjs/common';
import { ValidationPipe } from './common/pipe/validation.pipe';
// http异常过滤器
import { HttpExceptionFilter } from './common/filter/http-exception.filter'
import { Logger } from './common/logger'

import * as winston from 'winston'
import 'winston-daily-rotate-file'
const logger = winston.createLogger({
  level: 'debug', //打印的日志级别
  format: winston.format.json(), //日志格式
  // 日志的输出方式  日志集成可以使用社区nest-winston
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      level: 'info',
      dirname: 'logs',
      filename: 'logs-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: 1024 * 10, // 1M
    }),
    new winston.transports.Http({
      host: 'localhost',
      port: 8080,
    })
  ]
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // 全局异常过滤器 同样也可以只为一个单独的模块使用
  app.useGlobalFilters(new HttpExceptionFilter('global'))
  app.useLogger(new Logger())
  await app.listen(process.env.PORT ?? 3000);
}

logger.info('hello world')

bootstrap();
