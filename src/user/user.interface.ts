import { IsEmail, IsString } from 'class-validator';
import { User, UserBadges, UserDiary, UserMetrics, UserPrivacy, UserTierList } from '@prisma/client';

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

export interface GetUserAccessResponse {
  email: string;
}
