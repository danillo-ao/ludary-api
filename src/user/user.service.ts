import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDefaultsResponse, UserResponse, RegisterUserDto, GetUserAccessResponse } from './user.interface';
import { SupabaseService } from 'src/supabase/supabase.service';
import { UserHelper } from './user.helper';
import { USER_RESPONSES } from './user.responses';
import { UserBadges, UserDiary, UserMetrics, UserPrivacy, UserTierList } from '@prisma/client';
import { User } from '@supabase/supabase-js';

@Injectable()
export class UserService {
  @Inject(UserHelper)
  private readonly userHelper: UserHelper;

  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Inject(SupabaseService)
  private readonly supabase: SupabaseService;

  async registerUser(registerUserDto: RegisterUserDto): Promise<UserResponse> {
    const { email, password, nickname } = registerUserDto;

    const existedUser = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { nickname }] },
    });

    if (existedUser) {
      throw new BadRequestException('This email or nickname is already in use', {
        description: USER_RESPONSES.USER_ALREADY_EXISTS,
      });
    }

    // TODO: remove email_confirm
    const user = await this.supabase.getClient().auth.admin.createUser({ email, password, email_confirm: true });
    if (user.error) {
      throw new BadRequestException('Cannot create this user', { description: USER_RESPONSES.USER_ALREADY_EXISTS });
    }

    const idUser = user.data.user.id;
    const defaults = await this.createUserDefaults(idUser, registerUserDto);
    return this.userHelper.composeUserDefaults(defaults);
  }

  async createUserDefaults(idUser: string, dto: RegisterUserDto): Promise<CreateUserDefaultsResponse> {
    try {
      const user = await this.prisma.user.create({
        data: { id: idUser, email: dto.email, nickname: dto.nickname, name: dto.name },
      });
      const [userBadges, userMetrics, userPrivacy, userDiary, userTierList] = await Promise.all([
        this.prisma.userBadges.create({ data: { idUser } }),
        this.prisma.userMetrics.create({ data: { idUser } }),
        this.prisma.userPrivacy.create({ data: { idUser } }),
        this.prisma.userDiary.create({ data: { idUser } }),
        this.prisma.userTierList.create({ data: { idUser } }),
      ]);
      return { user, userBadges, userMetrics, userPrivacy, userDiary, userTierList };
    } catch (_) {
      throw new BadRequestException('Failed to create user defaults', {
        description: USER_RESPONSES.USER_DEFAULTS_CREATION_FAILED,
      });
    }
  }

  async getUserAccess(nickname: string): Promise<GetUserAccessResponse> {
    try {
      const user = await this.prisma.user.findFirst({ where: { nickname } });
      if (!user) {
        throw new BadRequestException('User not found', { description: USER_RESPONSES.USER_NOT_FOUND });
      }
      return { email: user.email };
    } catch (_) {
      throw new BadRequestException('Failed to get user access', {
        description: USER_RESPONSES.USER_NOT_FOUND,
      });
    }
  }

  async getUser(id: string, request: Request): Promise<UserResponse> {
    try {
      const userData = await this.prisma.user.findFirst({
        where: { id },
        include: {
          userPrivacy: true,
          userDiary: true,
          userBadges: true,
          userMetrics: true,
          userTierList: true,
        },
      });

      if (!userData) {
        throw new BadRequestException('User not found', { description: USER_RESPONSES.USER_NOT_FOUND });
      }

      const { userPrivacy, userDiary, userBadges, userMetrics, userTierList, ...user } = userData;
      const userComposed = this.userHelper.composeUserDefaults({
        user,
        userPrivacy: (userPrivacy as UserPrivacy) ?? undefined,
        userDiary: (userDiary as UserDiary) ?? undefined,
        userBadges: (userBadges as UserBadges) ?? undefined,
        userMetrics: (userMetrics as UserMetrics) ?? undefined,
        userTierList: (userTierList as UserTierList) ?? undefined,
      });

      if (request.authenticated) {
        const myself = (request.user as User).id === id;
        if (myself) return userComposed;
      }

      // remove privacy and diary
      const { privacy: _privacy, diary: _diary, ...userReturn } = userComposed;
      return userReturn;
    } catch (_) {
      throw new BadRequestException('User not found', { description: USER_RESPONSES.USER_NOT_FOUND });
    }
  }
}
