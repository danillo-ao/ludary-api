import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDefaultsResponse, RegisterUserDto } from './user.interface';
import { SupabaseService } from 'src/supabase/supabase.service';
import { UserHelper } from './user.helper';

@Injectable()
export class UserService {
  @Inject(UserHelper)
  private readonly userHelper: UserHelper;

  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Inject(SupabaseService)
  private readonly supabase: SupabaseService;

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, password, nickname } = registerUserDto;

    const existedUser = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { nickname }] },
    });

    if (existedUser) {
      throw new BadRequestException('This user already exists', {
        description: 'This email or nickname is already in use',
      });
    }

    const user = await this.supabase.getClient().auth.admin.createUser({ email, password });
    if (user.error) {
      throw new BadRequestException('Cannot create this user', {
        description: user.error.message,
      });
    }

    const idUser = user.data.user.id;
    const defaults = await this.createUserDefaults(idUser, registerUserDto);
    console.log(this.userHelper.composeUserDefaults(defaults));
    return true;
  }

  async createUserDefaults(idUser: string, dto: RegisterUserDto): Promise<CreateUserDefaultsResponse> {
    try {
      const user = await this.prisma.user.create({
        data: { id: idUser, email: dto.email, nickname: dto.nickname, name: dto.name },
      });
      const [userBadges, userMetrics, userPrivacy, userDiary] = await Promise.all([
        this.prisma.userBadges.create({ data: { idUser } }),
        this.prisma.userMetrics.create({ data: { idUser } }),
        this.prisma.userPrivacy.create({ data: { idUser } }),
        this.prisma.userDiary.create({ data: { idUser } }),
      ]);
      return { user, userBadges, userMetrics, userPrivacy, userDiary };
    } catch (_) {
      throw new BadRequestException('Cannot create this user', {
        description: 'faile to create user defaults',
      });
    }
  }
}
