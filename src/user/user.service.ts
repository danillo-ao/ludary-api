import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDefaultsResponse, UserResponse, RegisterUserDto } from './user.interface';
import { SupabaseService } from 'src/supabase/supabase.service';
import { UserHelper } from './user.helper';
import { USER_RESPONSES } from './user.responses';

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

    const user = await this.supabase.getClient().auth.admin.createUser({ email, password });
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
}
