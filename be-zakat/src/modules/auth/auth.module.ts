import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UnifiedJwtStrategy } from '../../strategies/unified-jwt.strategy';
import { PrismaService } from 'src/prisma.service';
import { AdminSetupService } from 'src/scripts/admin-setup.service';
import { GoogleAuthController } from './controllers/google-auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN},
    })
  ],
  controllers: [AuthController, GoogleAuthController],
  providers: [
    PrismaService,
    AuthService, 
    UnifiedJwtStrategy,
    AdminSetupService, 
    GoogleAuthController
  ],
  exports: [AuthService],
})
export class AuthModule {
   constructor(private adminSetupService: AdminSetupService) {}

  async onModuleInit() {
    // Auto-create admin users saat development
    if (process.env.NODE_ENV === 'development') {
      await this.adminSetupService.setupAdminUsers();
    }
  }
}
