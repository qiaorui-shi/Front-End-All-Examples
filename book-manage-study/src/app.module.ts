import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config'
import { LoggerMiddleware } from './common/middleware/logger.middleware';

// 动态导入模块 注：动态模块是在运行时才导入的，也就是dist目录下的文件，所以需要使用require导入，并且需要将ts后缀改为js
// 1、读取module下的所有目录
// 2、获取所有目录的名称
// 3、动态拼接地址导入模块 & 过滤掉module不存在的
const moduleDirs = fs.readdirSync(path.join(__dirname, 'module'), { withFileTypes: true })
const moduleNameList = moduleDirs.filter(dir => dir.isDirectory()).map(dir => dir.name)
const dynamicModules = moduleNameList.map(dir => {
  const moduleFile = path.join(__dirname, 'module', dir, `${dir}.module.js`)
  if (fs.existsSync(moduleFile)) {
    const importModuleName = `${dir[0].toUpperCase()}${dir.slice(1)}Module`
    return require(moduleFile)[importModuleName]
  }
  return null
}).filter(module => module !== null)

@Module({
  imports: [ ConfigModule.forRoot(), ...dynamicModules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // forRoutes还可以指定路径和请求方法，例如：forRoutes({ path: 'user', method: RequestMethod.GET })
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
