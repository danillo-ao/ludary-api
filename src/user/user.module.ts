import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserHelper } from './user.helper';

@Module({
  providers: [UserService, UserHelper],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
