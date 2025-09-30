import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { UserJwtGuard } from 'src/guards/user-jwt.guard';
import { AdminJwtGuard } from 'src/guards/admin-jwt.guard';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, UserJwtGuard, AdminJwtGuard],
  exports: [UserService],
})
export class UserModule {}
