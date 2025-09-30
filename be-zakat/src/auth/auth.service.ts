import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  AdminLoginDto,
  AdminRegisterDto,
  AdminResponseDto,
  AdminAuthResponseDto,
  UserLoginDto,
  UserRegisterDto,
  UserResponseDto,
  UserAuthResponseDto,
  JwtPayloadDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    //admin Auth
    async adminLogin(AdminLoginDto: AdminLoginDto): Promise<AdminAuthResponseDto> {
        const { email, password} = AdminLoginDto;

        const admin = await this.prismaService.admin.findUnique({
            where: { email },
        })

        if(!admin ){
            throw new UnauthorizedException('Login gagal');
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if(!isPasswordValid) {
            throw new UnauthorizedException('Password salah')
        }

        const payload: JwtPayloadDto = {
            sub: admin.id,
            type: 'admin',
        };

        const access_token = this.jwtService.sign(payload);

        const adminResponse: AdminResponseDto = {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            fullName: admin.fullName,
            role: admin.role,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
        };

        return {
            access_token,
            admin: adminResponse
        }
    }

    async adminRegister(adminRegisterDto: AdminRegisterDto): Promise<AdminResponseDto> {
        const { username, email, password, fullName, role} = adminRegisterDto;

        // Check if admin alredy exists
        const existingAdmin = await this.prismaService.admin.findFirst({
            where: {
                OR: [
                    { username },
                    { email },
                ],
            },
        });

        if(existingAdmin) {
            throw new ConflictException('Admin dengan username atau email ini sudah ada')
        }

        //Hash pass
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create admin
        const admin = await this.prismaService.admin.create({
            data: {
                username,
                email,
                password: hashedPassword,
                fullName,
                role
            },
        });

        return {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            fullName: admin.fullName,
            role: admin.role,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
        };
    }

    // User auth
    async userLogin(userLoginDto: UserLoginDto): Promise<UserAuthResponseDto> {
        const { email, password } = userLoginDto;

        const user = await this.prismaService.user.findUnique({
            where: { email },
        });

        if(!user) {
            throw new UnauthorizedException('Login gagal')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            throw new UnauthorizedException('password salah');
        }

        const payload: JwtPayloadDto = {
            sub: user.id,
            type: 'user',
        };

        const access_token = this.jwtService.sign(payload);

        const userResponse: UserResponseDto = {
        id: user.id,
        fullName: user.fullName ?? '',
        nomorHp: user.nomorHp ?? undefined,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        };

        return {
        access_token,
        user: userResponse,
        };
    }

    async userRegister(userRegisterDto: UserRegisterDto): Promise<UserResponseDto> {
        const { email, password, fullName, nomorHp} = userRegisterDto;

        // Check jika user sudah ada
        const existingUser = await this.prismaService.user.findUnique({
            where: { email },
        });

        if (existingUser){
            throw new ConflictException('User dengan username atau email ini sudah ada')
        }

        //Hash pass
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create User
        const user = await this.prismaService.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName,
                nomorHp,
            }
        })

        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName ?? '',
            nomorHp: user.nomorHp ?? undefined,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    // Password Management
    async changeAdminPassword(adminId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
        const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

        if (newPassword !== confirmPassword) {
        throw new BadRequestException('New passwords do not match');
        }

        const admin = await this.prismaService.admin.findUnique({
        where: { id: adminId },
        });

        if (!admin) {
        throw new NotFoundException('Admin not found');
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await this.prismaService.admin.update({
        where: { id: adminId },
        data: { password: hashedNewPassword },
        });

        return { message: 'Password changed successfully' };
    }

    async changeUserPassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
        const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

        if (newPassword !== confirmPassword) {
        throw new BadRequestException('New passwords do not match');
        }

        const user = await this.prismaService.user.findUnique({
        where: { id: userId },
        });

        if (!user) {
        throw new NotFoundException('User not found');
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await this.prismaService.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
        });

        return { message: 'Password changed successfully' };
    }

    // Forgot Password Management
  async adminForgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    const admin = await this.prismaService.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      // Return success message even if admin not found for security
      return { message: 'If the email exists, a password reset link has been sent' };
    }

    // Generate reset token (6 digit random number)
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // In a real application, you would:
    // 1. Store the reset token in database (you might need to add fields to Admin model)
    // 2. Send email with reset token
    // For now, we'll just log it (remove in production)
    console.log(`Admin Password Reset Token for ${email}: ${resetToken}`);

    // Store reset token (you need to add resetToken and resetTokenExpiry fields to Admin model)
    // await this.prismaService.admin.update({
    //   where: { id: admin.id },
    //   data: {
    //     resetToken,
    //     resetTokenExpiry,
    //   },
    // });

    return { message: 'If the email exists, a password reset link has been sent' };
  }

  async adminResetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword, confirmPassword } = resetPasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // In a real application, you would find admin by reset token and check expiry
    // const admin = await this.prismaService.admin.findFirst({
    //   where: {
    //     resetToken: token,
    //     resetTokenExpiry: {
    //       gt: new Date(),
    //     },
    //   },
    // });

    // if (!admin) {
    //   throw new UnauthorizedException('Invalid or expired reset token');
    // }

    // For demo purposes, we'll just validate the token format
    if (!token || token.length !== 6) {
      throw new UnauthorizedException('Invalid reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    // await this.prismaService.admin.update({
    //   where: { id: admin.id },
    //   data: {
    //     password: hashedPassword,
    //     resetToken: null,
    //     resetTokenExpiry: null,
    //   },
    // });

    return { message: 'Password reset successfully' };
  }

  async userForgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success message even if user not found for security
      return { message: 'If the email exists, a password reset link has been sent' };
    }

    // Generate reset token (6 digit random number)
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // In a real application, you would:
    // 1. Store the reset token in database (you might need to add fields to User model)
    // 2. Send email with reset token
    // For now, we'll just log it (remove in production)
    console.log(`User Password Reset Token for ${email}: ${resetToken}`);

    // Store reset token (you need to add resetToken and resetTokenExpiry fields to User model)
    // await this.prismaService.user.update({
    //   where: { id: user.id },
    //   data: {
    //     resetToken,
    //     resetTokenExpiry,
    //   },
    // });

    return { message: 'If the email exists, a password reset link has been sent' };
  }

  async userResetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword, confirmPassword } = resetPasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // In a real application, you would find user by reset token and check expiry
    // const user = await this.prismaService.user.findFirst({
    //   where: {
    //     resetToken: token,
    //     resetTokenExpiry: {
    //       gt: new Date(),
    //     },
    //   },
    // });

    // if (!user) {
    //   throw new UnauthorizedException('Invalid or expired reset token');
    // }

    // For demo purposes, we'll just validate the token format
    if (!token || token.length !== 6) {
      throw new UnauthorizedException('Invalid reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    // await this.prismaService.user.update({
    //   where: { id: user.id },
    //   data: {
    //     password: hashedPassword,
    //     resetToken: null,
    //     resetTokenExpiry: null,
    //   },
    // });

    return { message: 'Password reset successfully' };
  }

}
