import { Module } from '@nestjs/common';
import { Upload2Service } from './upload2.service';
import { Upload2Controller } from './upload2.controller';

@Module({
  providers: [Upload2Service],
  controllers: [Upload2Controller]
})
export class Upload2Module {}
