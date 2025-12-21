import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateUserPrivacyDto {
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  profile: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  favorites: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  backlog: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  wishlist: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  playing: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  paused: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  finished: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  dropped: boolean;
}
