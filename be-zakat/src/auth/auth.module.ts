import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AdminJwtStrategy } from '../strategies/admin-jwt.strategy';
import { UserJwtStrategy } from '../strategies/user-jwt.strategy';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN},
    })
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    AuthService, 
    AdminJwtStrategy, 
    UserJwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
