import {
  Controller,
  Post,
  Body,
  UseFilters
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/registry-user.dto';

// 通过@controller装饰器，创建一个控制器，路由前缀设置为user
@Controller('user')
// 模块异常过滤器
@UseFilters(new HttpExceptionFilter('user'))
export class UserController {
  constructor(private readonly userService: UserService) { }
  // 通过@post装饰器，创建一个post请求，路由路径为/register
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }
}
