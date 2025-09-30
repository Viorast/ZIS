import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AdminRole, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
    UpdateAdminDto,
    SearchAdminDto,
    AdminResponseDto,
    ChangePasswordDto,
} from './dto/admin.dto';
import { hash } from 'crypto';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}

    // Get Profile
    async getProfile(id: string): Promise<AdminResponseDto> {
        const admin = await this.prisma.admin.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if(!admin) {
            throw new NotFoundException('Admin not found');
        }

        return admin;
    }

    async updateProfile(id: string, updateAdminDto: UpdateAdminDto): Promise<AdminResponseDto> {
        const admin = await this.prisma.admin.findUnique({ where: {id} });
        if(!admin){
            throw new NotFoundException('Admin not found');
        }

        if(updateAdminDto.username || updateAdminDto.email) {
            const existingAdmin = await this.prisma.admin.findFirst({
                where: {
                    AND: [
                        { id: { not: id }},
                        {
                            OR: [
                                ...(updateAdminDto.username ? [{ username: updateAdminDto.username }] : [] ),
                                ...(updateAdminDto.email ? [{ email: updateAdminDto.email }] : [] )
                            ]
                        }
                    ]
                }
            });

            if(existingAdmin){
                throw new BadRequestException('Username or email alredyy exists');
            }
        }

        const updateAdmin = await this.prisma.admin.update({
            where: { id },
            data: updateAdminDto,
            select: {
                id: true,
                email: true,
                username: true,
                fullName: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return updateAdmin;
    }

    //change password
    async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
        const admin = await this.prisma.admin.findUnique({ where: { id} });
        if(!admin) {
            throw new NotFoundException('Admin not found');
        }

        const isCurrentPasswordValid = await bcrypt.compare(
            changePasswordDto.currentPassword,
            admin.password
        );

        if(!isCurrentPasswordValid) {
            throw new BadRequestException('Current password is incorrect');
        }

        const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

        await this.prisma.admin.update({
            where: { id },
            data: { password: hashedNewPassword }
        });

        return { message: 'Password changed succesfully'};
    }

    async getAllAdmins(searchDto: SearchAdminDto): Promise<{
        data: AdminResponseDto[];
        total: number;
        page: number;
        limit: number;
    }> {
        const { page = 1, limit = 10, search, role } = searchDto;
        const skip = (page - 1) * limit;

        const where = {
        ...(search && {
            OR: [
            { username: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { fullName: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ]
        }),
        ...(role && { role })
        };

        const [admins, total] = await Promise.all([
        this.prisma.admin.findMany({
            where,
            skip,
            take: limit,
            select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            role: true,
            employeeID: true,
            createdAt: true,
            updatedAt: true
            },
            orderBy: { createdAt: 'desc' }
        }),
        this.prisma.admin.count({ where })
        ]);

        return {
        data: admins,
        total,
        page,
        limit
        };
    }

    async searchAdmins(searchDto: SearchAdminDto): Promise<{
        data: AdminResponseDto[];
        total: number;
    }> {
        const { search, role, limit = 50 } = searchDto;

        const where = {
        ...(search && {
            OR: [
            { username: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { fullName: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ]
        }),
        ...(role && { role })
        };

        const [admins, total] = await Promise.all([
        this.prisma.admin.findMany({
            where,
            take: limit,
            select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            role: true,
            employeeID: true,
            createdAt: true,
            updatedAt: true
            },
            orderBy: { fullName: 'asc' }
        }),
        this.prisma.admin.count({ where })
        ]);

        return { data: admins, total };
    }

    async getAdminById(id: string): Promise<AdminResponseDto> {
        const admin = await this.prisma.admin.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if(!admin) {
            throw new NotFoundException('Admin not found');
        }

        return admin;
    }

    async updateAdmin(id: string, updateAdminDto: UpdateAdminDto): Promise<AdminResponseDto> {
        const admin = await this.prisma.admin.findUnique({ where: { id } });
        if (!admin) {
        throw new NotFoundException('Admin not found');
        }

        // Check if username or email already exists (excluding current admin)
        if (updateAdminDto.username || updateAdminDto.email) {
        const existingAdmin = await this.prisma.admin.findFirst({
            where: {
            AND: [
                { id: { not: id } },
                {
                OR: [
                    ...(updateAdminDto.username ? [{ username: updateAdminDto.username }] : []),
                    ...(updateAdminDto.email ? [{ email: updateAdminDto.email }] : [])
                ]
                }
            ]
            }
        });

        if (existingAdmin) {
            throw new BadRequestException('Username or email already exists');
        }
        }

        const updatedAdmin = await this.prisma.admin.update({
        where: { id },
        data: updateAdminDto,
        select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            role: true,
            employeeID: true,
            createdAt: true,
            updatedAt: true
        }
        });

        return updatedAdmin;
    }

    async deleteAdmin(id: string): Promise<{ message: string }> {
        const admin = await this.prisma.admin.findUnique({ where: { id } });
        if (!admin) {
        throw new NotFoundException('Admin not found');
        }

        await this.prisma.admin.delete({ where: { id } });
        return { message: 'Admin deleted successfully' };
    }
}
