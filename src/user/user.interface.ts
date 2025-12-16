import { IsEmail, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  name: string;

  @IsString()
  nickname: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
