import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class TokenCleanupService {
  constructor(private readonly authService: AuthService) {}

  // Jalankan cleanup setiap hari jam 2 pagi
  @Cron("* 10 * * * * ")
  async handleTokenCleanup() {
    console.log('🔄 Running token cleanup...');
    await this.authService.cleanupExpiredTokens();
  }
}

// @Cron(CronExpression.EVERY_DAY_AT_2AM)
//   async handleTokenCleanup() {
//     console.log('🔄 Running token cleanup...');
//     await this.authService.cleanupExpiredTokens();
//   }