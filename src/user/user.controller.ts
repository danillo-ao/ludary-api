import { Body, Controller, Get, Inject, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse, RegisterUserDto, GetUserAccessResponse } from './user.interface';
import { SupabaseOptionalAuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto): Promise<UserResponse> {
    return this.userService.registerUser(registerUserDto);
  }

  @Get('access')
  getUserAccess(@Query('nickname') nickname: string): Promise<GetUserAccessResponse> {
    return this.userService.getUserAccess(nickname);
  }

  @Get('profile/:id')
  @UseGuards(SupabaseOptionalAuthGuard)
  getUser(@Param('id') id: string, @Req() request: Request): Promise<UserResponse> {
    return this.userService.getUser(id, request);
  }
}
