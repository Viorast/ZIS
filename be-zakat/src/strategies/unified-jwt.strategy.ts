import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma.service";
import { AuthService } from "src/modules/auth/auth.service";
import { UserRole } from "@prisma/client";

@Injectable()
export class UnifiedJwtStrategy extends PassportStrategy(Strategy, 'unified-jwt') {
    constructor(
        private readonly prismaService:PrismaService,
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
        });
    }

    async validate(payload: any) {
        // Extract token dari request
        const request = this.getRequest();
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

        // Check jika token di blacklist
        if (token && await this.authService.isTokenBlacklisted(token)) {
            throw new UnauthorizedException('Token telah di-blacklist. Silakan login kembali.');
        }

        const user = await this.prismaService.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                fullName: true,
                email: true,
                nomorHp: true,
                role: true, 
                pengurusId: true,
            }
        });

        if (!user) {
            throw new UnauthorizedException('User tidak ditemukan');
        }

        return {
            userId: user.id,
            email: user.email,
            fullName: user.fullName,
            nomorHp: user.nomorHp,
            role: user.role as UserRole, 
            pengurusID: user.pengurusId,
            type: this.determineTokenType(user.role), 
        };
    }

    private determineTokenType(role: string): string {
        switch (role) {
            case UserRole.JAMAAH:
                return 'user';
            case UserRole.PENGURUS:
            case UserRole.BENDAHARA:
            case UserRole.SUPER_ADMIN:
                return 'admin';
            default:
                return 'user';
        }
    }

    // Helper untuk mendapatkan request object
    private getRequest() {
        // This is a workaround to get the request object in validate method
        const req = this['_verified'];
        if (req) return req;
        
        // Fallback untuk NestJS Passport
        return require('express').request;
    }
}