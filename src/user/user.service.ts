import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './user.interface';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Inject(SupabaseService)
  private readonly supabase: SupabaseService;

  async register(registerUserDto: RegisterUserDto) {
    const { email, name, nickname } = registerUserDto;

    const existedUser = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { nickname }] },
    });

    if (!existedUser) {
      // this.prisma.user.create({ email, name, nickname });
      const user = await this.prisma.user.create({ data: { id: 'lorem ipsum', email, name, nickname } });
      return true;
    }

    console.log(existedUser);
    throw new BadRequestException('Cannot create this user', {
      description: 'Error description',
    });
  }
}
