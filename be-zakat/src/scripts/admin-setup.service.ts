// src/scripts/admin-setup.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSetupService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // Auto-run saat aplikasi start (development only)
    if (process.env.NODE_ENV === 'development') {
      await this.setupAdminUsers();
    }
  }

  async createSuperAdmin() {
    const email = 'superadmin@masjid.com';
    const password = 'superadmin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log('Super Admin already exists:', email);
        return existingUser;
      }

      const superAdmin = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName: 'Super Administrator',
          role: 'SUPER_ADMIN',
          pengurusId: 'SA001',
          nomorHp: '08123456789',
        },
      });

      console.log('   Super Admin created successfully!');
      console.log('   Email:', email);
      console.log('   Password:', password);
      console.log('   Role: SUPER_ADMIN');
      
      return superAdmin;
    } catch (error) {
      console.error(' Error creating Super Admin:', error);
      throw error;
    }
  }

  async createBendahara() {
    const email = 'bendahara@masjid.com';
    const password = 'bendahara123';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log('Bendahara already exists:', email);
        return existingUser;
      }

      const bendahara = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName: 'Bendahara Masjid',
          role: 'BENDAHARA',
          pengurusId: 'BENDA001',
          nomorHp: '08129876543',
        },
      });

      console.log('   Bendahara created successfully!');
      console.log('   Email:', email);
      console.log('   Password:', password);
      console.log('   Role: BENDAHARA');
      
      return bendahara;
    } catch (error) {
      console.error('Error creating Bendahara:', error);
      throw error;
    }
  }

  async setupAdminUsers() {
    console.log('Setting up admin users...');
    await this.createSuperAdmin();
    await this.createBendahara();
    console.log(' Admin setup completed!');
  }
}