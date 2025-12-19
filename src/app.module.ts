import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { IgdbModule } from './igdb/igdb.module';

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
  providers: [],
})
export class AppModule {}
