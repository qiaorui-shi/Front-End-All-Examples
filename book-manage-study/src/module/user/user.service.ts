import {
  BadRequestException,
  Injectable,
  Inject,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/registry-user.dto';
import { DbService } from 'src/db/db.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  @Inject(DbService)
  dbService: DbService;

  async register(registerUserDto: RegisterUserDto) {
    const users: User[] = await this.dbService.read();
    const foundUser = users.find(
      (item) => item.username === registerUserDto.username,
    );

    if (foundUser) {
      throw new BadRequestException('该用户已经注册');
    }

    const user = new User();
    user.username = registerUserDto.username;
    user.password = registerUserDto.password;
    users.push(user);

    await this.dbService.write(users);
    return user;
  }
}
