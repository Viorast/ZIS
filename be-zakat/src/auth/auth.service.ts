import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { 
  UnifiedLoginDto, 
  UnifiedRegisterDto, 
  UnifiedAuthResponseDto 
} from './dto/unified-auth.dto';
import { UserRole } from '@prisma/client';
import { 
  ChangePasswordDto, 
  ForgotPasswordDto, 
  ResetPasswordDto 
} from './dto/common-auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    // User Login
    async unifiedLogin(loginDto: UnifiedLoginDto): Promise<UnifiedAuthResponseDto> {
        const { email, password } = loginDto;

        const user = await this.prismaService.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Login gagal');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Password salah');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            type: this.determineTokenType(user.role),
        };

        const access_token = this.jwtService.sign(payload);

        const userResponse = this.formatUserResponse(user);

        return {
            access_token,
            user: userResponse
        };
    }

    //  Register 
    async unifiedRegister(registerDto: UnifiedRegisterDto): Promise<any> {
        const { email, password, fullName, nomorHp, role, pengurusID } = registerDto;

        // Check jika user sudah ada
        const existingUser = await this.prismaService.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('User dengan email ini sudah ada');
        }

        // Default role untuk registrasi public
        const userRole = role || UserRole.JAMAAH;

        // Validasi: Hanya JAMAAH yang bisa register via public endpoint
        if (userRole !== UserRole.JAMAAH) {
            throw new UnauthorizedException('Hanya bisa mendaftar sebagai jamaah');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user 
        const user = await this.prismaService.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName,
                nomorHp,
                role: userRole,
                pengurusId: pengurusID,
            },
        });

        return this.formatUserResponse(user);
    }

    // Helper Methods
    private determineTokenType(role: UserRole): string {
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

    private formatUserResponse(user: any) {
        const baseResponse = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            nomorHp: user.nomorHp,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        // Tambahkan fields khusus berdasarkan role
        if (user.role !== UserRole.JAMAAH) {
            return {
                ...baseResponse,
                pengurusId: user.pengurusID, 
            };
        }

        return baseResponse;
    }

    // FORGOT PASSWORD 
    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
        const { email } = forgotPasswordDto;

        const user = await this.prismaService.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { message: 'Jika email terdaftar, link reset password akan dikirim' };
        }

        //  Generate secure token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 15 menit
        
        //  Hash token 
        const hashedToken = await bcrypt.hash(resetToken, 10);

        try {
            await this.prismaService.user.update({
                where: { id: user.id },
                data: {
                    resetToken: hashedToken,
                    resetTokenExpiry,
                },
            });

            // KIRIM EMAIL DENGAN LINK + TOKEN
            // Hanya perlu ganti bagian ini dengan service email yang sebenarnya
            // Contoh link: https://yourdomain.com/reset-password?token=RESET_TOKEN
            // Ganti 'yourdomain.com' dengan domain aplikasi 
            // Kirim email ke user.email dengan link di atas
            const resetLink = `https://yourdomain.com/reset-password?token=${resetToken}`;
            
            console.log(`Reset Password Link untuk ${email}: ${resetLink}`);
            
            // TODO: Implement email service
            // await this.emailService.sendResetPasswordEmail(email, resetLink, resetToken);

        } catch (error) {
            console.error('Error storing reset token:', error);
            throw new BadRequestException('Gagal memproses permintaan reset password');
        }

        return { message: 'Jika email terdaftar, link reset password akan dikirim' };
    }

    // RESET PASSWORD
    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
        const { token, newPassword, confirmPassword } = resetPasswordDto;

        if (newPassword !== confirmPassword) {
            throw new BadRequestException('Password tidak cocok');
        }

        // Validasi token
        const validation = await this.validateResetToken(token);
        if (!validation.valid) {
            throw new UnauthorizedException('Token reset tidak valid atau sudah kedaluwarsa');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password dan clear reset token
        await this.prismaService.user.update({
            where: { id: validation.userId },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return { message: 'Password berhasil direset' };
    }

    async validateResetToken(token: string): Promise<{ 
        valid: boolean; 
        email?: string; 
        userId?: string;
        message?: string;
    }> {
        if (!token || token.length !== 64 || !/^[a-f0-9]+$/i.test(token)) {
            return { valid: false, message: 'Format token tidak valid' };
        }

        const users = await this.prismaService.user.findMany({
            where: {
                resetTokenExpiry: {
                    gt: new Date(), 
                },
            },
        });

        for (const user of users) {
            if (user.resetToken && await bcrypt.compare(token, user.resetToken)) {
                return { 
                    valid: true, 
                    email: user.email,
                    userId: user.id
                };
            }
        }

        return { valid: false, message: 'Token tidak valid atau sudah kedaluwarsa' };
    }

    // CHANGE PASSWORD
    async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
        const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

        if (newPassword !== confirmPassword) {
            throw new BadRequestException('Password baru tidak cocok');
        }

        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User tidak ditemukan');
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new UnauthorizedException('Password saat ini salah');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await this.prismaService.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });

        return { message: 'Password berhasil diubah' };
    }
}