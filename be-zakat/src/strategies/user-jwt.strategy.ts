import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
    constructor(private readonly prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
        });
    }

    async validate(payload: any) {
        // Only validate user tokens
        if (payload.type !== 'user') {
            throw new UnauthorizedException('Invalid token for user access');
        }

        const user = await this.prismaService.user.findUnique({
            where: {
                id: payload.sub,
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                nomorHp: true,
            }
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return {
            userId: user.id,
            type: 'user',
            ...user
        };
    }
}