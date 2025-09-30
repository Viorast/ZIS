import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
    constructor(private readonly prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
        });
    }

    async validate(payload: any) {
        // Only validate admin tokens
        if (payload.type !== 'admin') {
            throw new UnauthorizedException('Invalid token for admin access');
        }

        const admin = await this.prismaService.admin.findUnique({
            where: {
                id: payload.sub,
            },
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
                role: true,
            }
        });

        if(!admin){
            throw new UnauthorizedException('Admin not found');
        }

        return {
            userId: admin.id,
            type: 'admin',
            ...admin
        };
    }
}