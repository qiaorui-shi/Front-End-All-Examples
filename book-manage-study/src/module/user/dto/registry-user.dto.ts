// dto用于接口间数据传输
import { IsNotEmpty, MinLength } from 'class-validator';
export class RegisterUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @MinLength(6, { message: '密码不能小于6位' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
