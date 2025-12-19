import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { IgdbModule } from './igdb/igdb.module';
import { IgdbService } from './igdb/igdb.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    SupabaseModule,
    UserModule,
    PrismaModule,
    IgdbModule,
  ],
  controllers: [],
  providers: [PrismaService, IgdbService],
})
export class AppModule {}
