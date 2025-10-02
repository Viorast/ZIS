import { Command, Console } from 'nestjs-console';
import { AdminSetupService } from './admin-setup.service';

@Console()
export class SetupAdminCommand {
  constructor(private readonly adminSetupService: AdminSetupService) {}

  @Command({
    command: 'setup:admin',
    description: 'Setup Super Admin and Bendahara accounts'
  })
  async setupAdmin() {
    await this.adminSetupService.setupAdminUsers();
  }

  @Command({
    command: 'setup:superadmin',
    description: 'Setup only Super Admin account'
  })
  async setupSuperAdmin() {
    await this.adminSetupService.createSuperAdmin();
  }

  @Command({
    command: 'setup:bendahara', 
    description: 'Setup only Bendahara account'
  })
  async setupBendahara() {
    await this.adminSetupService.createBendahara();
  }
}