// src/auth/strategies/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, StrategyOptions } from 'passport-google-oauth20';
import { PrismaService } from 'src/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private prismaService: PrismaService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'],
    } as StrategyOptions); 
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    };

    // Cari atau buat user di database
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      // Update user dengan data terbaru dari Google
      const updatedUser = await this.prismaService.user.update({
        where: { email: user.email },
        data: {
          fullName: `${user.firstName} ${user.lastName}`.trim(),
          fotoProfil: user.picture,
        },
      });
      return done(null, updatedUser);
    }

    // Buat user baru
    const newUser = await this.prismaService.user.create({
      data: {
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`.trim(),
        fotoProfil: user.picture,
        role: UserRole.JAMAAH, // Default role untuk user Google
        password: '', // Password kosong untuk Google users
        isGoogleAuth: true, // Tambahkan field ini ke schema
      },
    });

    return done(null, newUser);
  }
}