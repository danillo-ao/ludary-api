import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './user.interface';

@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto): Promise<boolean> {
    return this.userService.register(registerUserDto);
  }
}
