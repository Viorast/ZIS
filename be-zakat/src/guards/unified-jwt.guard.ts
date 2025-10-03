import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UnifiedJwtGuard extends AuthGuard('unified-jwt') {
    constructor(private prisma: PrismaService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Validasi JWT via passport
    const isValid = (await super.canActivate(context)) as boolean;
    if (!isValid) return false;

    // 2. Ambil request & token
    const req = context.switchToHttp().getRequest();
    const token = this.extractToken(req);
    if (!token) {
      throw new UnauthorizedException('Token tidak ditemukan');
    }

    // 3. Cek blacklist
    const blacklisted = await this.prisma.blacklistedToken.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() }, // masih berlaku
      },
    });

    if (blacklisted) {
      throw new UnauthorizedException('Token sudah tidak valid, silakan login ulang');
    }

    return true;
  }

  private extractToken(req: any): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return null;
  }
}