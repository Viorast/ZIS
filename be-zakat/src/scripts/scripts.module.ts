import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { PrismaModule } from 'src/prisma.module';
import { SetupAdminCommand } from './setup-admin.command';
import { AdminSetupService } from './admin-setup.service';

@Module({
  imports: [ConsoleModule, PrismaModule],
  providers: [AdminSetupService, SetupAdminCommand],
})
export class ScriptsModule {}