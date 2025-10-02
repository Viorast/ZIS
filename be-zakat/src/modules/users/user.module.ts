import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { UnifiedJwtGuard as UserJwtGuard } from '../../guards/unified-jwt.guard';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, UserJwtGuard],
  exports: [UserService],
})
export class UserModule {}
