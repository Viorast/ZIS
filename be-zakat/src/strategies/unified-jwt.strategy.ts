import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma.service";
import { UserRole } from "@prisma/client";

@Injectable()
export class UnifiedJwtStrategy extends PassportStrategy(Strategy, 'unified-jwt') {
    constructor(private readonly prisma:PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
        });
    }

    async validate(payload: any) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                fullName: true,
                email: true,
                nomorHp: true,
                role: true, 
                pengurusId: true,
            }
        })

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return {
            userId : user.id,
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
}