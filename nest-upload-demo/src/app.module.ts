import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './common/upload/upload.module';
import { Upload2Module } from './common/upload2/upload2.module';

@Module({
  imports: [UploadModule, Upload2Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
