// src/user/user.service.ts
import { BadRequestException, Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import * as fs from 'fs';
import {
    UpdateUserDto,
    SearchUserDto,
    UserResponseDto,
    ChangePasswordDto,
    UserFilterDto,
    UpdateUserRoleDto,
    CreateAdminUserDto
} from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async getProfile(userId: string): Promise<UserResponseDto> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                fullName: true,
                gender: true,
                tempatLahir: true,
                tanggalLahir: true,
                nomorHp: true,
                nomorKtp: true,
                alamat: true,
                email: true,
                fotoProfil: true,
                role: true, 
                pengurusId: true, 
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.formatUserResponse(user);
    }

    async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const existingUser = await this.findUserOrThrow(userId);

        // Email uniqueness check
        if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
            const emailExists = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email }
            });

            if (emailExists) {
                throw new BadRequestException('Email already exists');
            }
        }

        // Phone uniqueness check
        if (updateUserDto.nomorHp && updateUserDto.nomorHp !== existingUser.nomorHp) {
            const phoneExists = await this.prisma.user.findFirst({
                where: { 
                    nomorHp: updateUserDto.nomorHp,
                    id: { not: userId } // Exclude current user
                }
            });

            if (phoneExists) {
                throw new BadRequestException('Phone number already exists');
            }
        }

        // KTP uniqueness check
        if (updateUserDto.nomorKtp && updateUserDto.nomorKtp !== existingUser.nomorKtp) {
            const ktpExists = await this.prisma.user.findFirst({
                where: { 
                    nomorKtp: updateUserDto.nomorKtp,
                    id: { not: userId } // Exclude current user
                }
            });

            if (ktpExists) {
                throw new BadRequestException('KTP number already exists');
            }
        }

        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: updateUserDto,
            select: {
                id: true,
                fullName: true,
                gender: true,
                tempatLahir: true,
                tanggalLahir: true,
                nomorHp: true,
                nomorKtp: true,
                alamat: true,
                email: true,
                fotoProfil: true,
                role: true,
                pengurusId: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return this.formatUserResponse(updatedUser);
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
        const user = await this.findUserOrThrow(userId);

        const isCurrentPasswordValid = await bcrypt.compare(
            changePasswordDto.currentPassword,
            user.password
        );

        if (!isCurrentPasswordValid) {
            throw new BadRequestException('Current password is incorrect');
        }

        if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
            throw new BadRequestException('New passwords do not match');
        }

        const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        });

        return { message: 'Password changed successfully' };
    }

    // New method for updating user role (admin only)
    async updateUserRole(userId: string, updateRoleDto: UpdateUserRoleDto): Promise<UserResponseDto> {
        const user = await this.findUserOrThrow(userId);

        // Additional validation for role changes
        if (updateRoleDto.role === UserRole.SUPER_ADMIN) {
            throw new ForbiddenException('Cannot assign SUPER_ADMIN role');
        }

        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                role: updateRoleDto.role,
                pengurusId: updateRoleDto.pengurusID
            },
            select: {
                id: true,
                fullName: true,
                gender: true,
                tempatLahir: true,
                tanggalLahir: true,
                nomorHp: true,
                nomorKtp: true,
                alamat: true,
                email: true,
                fotoProfil: true,
                role: true,
                pengurusId: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return this.formatUserResponse(updatedUser);
    }

    async getAllUsers(filterDto: UserFilterDto): Promise<{
        data: UserResponseDto[];
        total: number;
        page: number;
        limit: number;
    }> {
        const { page = 1, limit = 10, search, role } = filterDto;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { nomorHp: { contains: search, mode: 'insensitive' } },
                { nomorKtp: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (role) {
            where.role = role;
        }

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    fullName: true,
                    gender: true,
                    tempatLahir: true,
                    tanggalLahir: true,
                    nomorHp: true,
                    nomorKtp: true,
                    alamat: true,
                    email: true,
                    fotoProfil: true,
                    role: true,
                    pengurusId: true,
                    createdAt: true,
                    updatedAt: true
                }
            }),
            this.prisma.user.count({ where })
        ]);

        return {
            data: users.map(user => this.formatUserResponse(user)),
            total,
            page,
            limit
        };
    }

    async searchUsers(searchDto: SearchUserDto): Promise<{
        data: UserResponseDto[];
        total: number;
    }> {
        const { search, gender, role } = searchDto;

        const where: any = {};

        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { nomorHp: { contains: search, mode: 'insensitive' } },
                { nomorKtp: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (gender) {
            where.gender = gender;
        }

        if (role) {
            where.role = role;
        }

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                take: 50,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    fullName: true,
                    gender: true,
                    tempatLahir: true,
                    tanggalLahir: true,
                    nomorHp: true,
                    nomorKtp: true,
                    alamat: true,
                    email: true,
                    fotoProfil: true,
                    role: true,
                    pengurusId: true,
                    createdAt: true,
                    updatedAt: true
                }
            }),
            this.prisma.user.count({ where })
        ]);

        return {
            data: users.map(user => this.formatUserResponse(user)),
            total
        };
    }

    async getUserById(id: string): Promise<UserResponseDto> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                fullName: true,
                gender: true,
                tempatLahir: true,
                tanggalLahir: true,
                nomorHp: true,
                nomorKtp: true,
                alamat: true,
                email: true,
                fotoProfil: true,
                role: true,
                pengurusId: true,
                createdAt: true,
                updatedAt: true,
                infaqTransactions: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        nominal: true,
                        status: true,
                        createdAt: true
                    }
                },
                zakatTransactions: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        nominal: true,
                        jenisZakat: true,
                        status: true,
                        createdAt: true
                    }
                }
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.formatUserResponse(user);
    }

    async getTransactionHistory(userId: string, query: { page?: number; limit?: number; type?: 'infaq' | 'zakat' }): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }> {
        // TODO: Implement actual logic here
        return {
            data: [],
            total: 0,
            page: query.page ?? 1,
            limit: query.limit ?? 10
        };
    }

    async deleteAccount(userId: string): Promise<{ message: string }> {
        // Example implementation: delete the user and return a message
        await this.prisma.user.delete({ where: { id: userId } });
        return { message: 'Account deleted successfully' };
    }

    private formatUserResponse(user: any): UserResponseDto {
        return {
            id: user.id,
            fullName: user.fullName,
            gender: user.gender,
            tempatLahir: user.tempatLahir,
            tanggalLahir: user.tanggalLahir,
            nomorHp: user.nomorHp,
            nomorKtp: user.nomorKtp,
            alamat: user.alamat,
            email: user.email,
            fotoProfil: user.fotoProfil,
            role: user.role, // ✅ Include role
            pengurusID: user.pengurusID, // ✅ Include pengurusID
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            infaqTransactions: user.infaqTransactions,
            zakatTransactions: user.zakatTransactions,
        };
    }

    private async findUserOrThrow(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        
        if (!user) throw new NotFoundException('User not found');

        return user;
    }

    // Create admin user (Super Admin only)
    async createAdminUser(createAdminDto: CreateAdminUserDto): Promise<UserResponseDto> {
        const { email, password, fullName, role, pengurusId, nomorHp } = createAdminDto;

        // Validasi: Hanya role admin yang boleh dibuat
        const allowedRoles: UserRole[] = [UserRole.PENGURUS, UserRole.BENDAHARA];
        if (!allowedRoles.includes(role)) {
        throw new BadRequestException('Hanya bisa membuat user dengan role PENGURUS atau BENDAHARA');
        }

        const existingUser = await this.prisma.user.findUnique({
        where: { email },
        });

        if (existingUser) {
        throw new ConflictException('User dengan email ini sudah ada');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            fullName,
            role,
            pengurusId,
            nomorHp,
        },
        });

        return this.formatUserResponse(user);
    }

    // Delete user (Super Admin only)
    async deleteUser(userId: string): Promise<{ message: string }> {
        const user = await this.prisma.user.findUnique({
        where: { id: userId },
        });

        if (!user) {
        throw new NotFoundException('User tidak ditemukan');
        }
        
        if (user.role === UserRole.SUPER_ADMIN) {
        throw new BadRequestException('Tidak bisa menghapus Super Admin');
        }

        await this.prisma.user.delete({
        where: { id: userId },
        });

        return { message: 'User berhasil dihapus' };
    }
}