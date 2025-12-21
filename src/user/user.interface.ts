import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User, UserBadges, UserDiary, UserMetrics, UserPrivacy, UserTierList } from '@prisma/client';

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

export interface CreateUserDefaultsResponse {
  user: User;
  userBadges?: UserBadges;
  userMetrics?: UserMetrics;
  userPrivacy?: UserPrivacy;
  userDiary?: UserDiary;
  userTierList?: UserTierList;
}

export interface UserResponse extends User {
  badges?: Omit<UserBadges, 'idUser' | 'updateDate' | 'id'>;
  metrics?: Omit<UserMetrics, 'idUser' | 'updateDate' | 'id'>;
  privacy?: Omit<UserPrivacy, 'idUser' | 'updateDate' | 'id'>;
  diary?: Omit<UserDiary, 'idUser' | 'updateDate' | 'id'>;
  tierList?: Omit<UserTierList, 'idUser' | 'updateDate' | 'id'>;
}

export interface UpdateUserResponse {
  name: string;
  avatar?: string;
}

export interface GetUserAccessResponse {
  email: string;
}
