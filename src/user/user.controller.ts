import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto, UpdateUserPrivacyDto, UpdateUserProfileDto } from './user.dto';
import { SupabaseAuthGuard, SupabaseOptionalAuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/auth/auth.decorator';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { GetUserAccessResponse, UpdateUserResponse, UserResponse } from './user.interfaces';

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
  getUserProfile(@Param('id') id: string, @Req() request: Request): Promise<UserResponse> {
    return this.userService.getUserProfile(id, request);
  }

  @Put('profile/update')
  @UseGuards(SupabaseAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  updateUserProfile(
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: SupabaseUser,
  ): Promise<UpdateUserResponse> {
    return this.userService.updateUserProfile(updateUserProfileDto, file, user);
  }

  @Put('profile/privacy')
  @UseGuards(SupabaseAuthGuard)
  updateUserPrivacy(
    @Body() updateUserPrivacyDto: UpdateUserPrivacyDto,
    @User() user: SupabaseUser,
  ): Promise<UserResponse['privacy']> {
    return this.userService.updateUserPrivacy(updateUserPrivacyDto, user);
  }
}
