    import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
    import { PrismaService } from 'src/prisma.service';
    import { User, Gender } from '@prisma/client';
    import * as bcrypt from 'bcrypt';
    import * as path from 'path';
    import * as fs from 'fs';
    import {
        UpdateUserDto,
        SearchUserDto,
        UserResponseDto,
        ChangePasswordDto
    } from './dto/user.dto';

    @Injectable()
    export class UserService {
        constructor(private readonly prisma: PrismaService) {}

        async getProfile(userId: string): Promise<UserResponseDto> {
            const user = await this.prisma.user.findUnique({
                where: {id: userId},
                select: {
                    id: true,
                    fullName: true,
                    tempatLahir: true,
                    tanggalLahir: true,
                    nomorHp: true,
                    nomorKtp: true,
                    alamat: true,
                    email: true,
                    fotoProfil: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });

            if(!user) {
                throw new NotFoundException('User not Found')
            }

            return this.formatUserResponse(user);
        }

        async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
            const existingUser = await this.findUserOrThrow(userId)

            if (updateUserDto.email && updateUserDto.email !== existingUser.email){
                const emailExists = await this.prisma.user.findUnique({
                    where: { email: updateUserDto.email}
                });

                if(emailExists) {
                    throw new BadRequestException('Email already exists');
                }
            }

            if (updateUserDto.nomorHp && updateUserDto.nomorHp !== existingUser.nomorHp) {
                const phoneExists = await this.prisma.user.findFirst({
                    where: { nomorHp: updateUserDto.nomorHp }
                });

                if (phoneExists) {
                    throw new BadRequestException('Phone number already exists');
                }
            }

            if (updateUserDto.nomorKtp && updateUserDto.nomorKtp !== existingUser.nomorKtp) {
                const ktpExists = await this.prisma.user.findFirst({
                    where: { nomorKtp: updateUserDto.nomorKtp }
                });

                if (ktpExists) {
                    throw new BadRequestException('KTP number already exists');
                }
            }

            const updatedUser = await this.prisma.user.update({
                where: { id: userId},
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
                    createdAt: true,
                    updatedAt: true
                }
            })

            return this.formatUserResponse(updatedUser);
        }

        async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string}> {
            const user =  await this.findUserOrThrow(userId);

            const isCurrentPasswordValid = await bcrypt.compare(
                changePasswordDto.currentPassword,
                user.password
            );

            if(!isCurrentPasswordValid) {
                throw new BadRequestException('Current password is incorrect');
            }

            const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

            await this.prisma.user.update({
                where: { id: userId},
                data: { password: hashedNewPassword }
            });

            return { message: 'Password changed successfully'}
        }

        // async updateProfilePicture(userId: string, file: Express.Multer.File): Promise<{ message: string; profilePicture: string }> {
        //     if (!file) {
        //         throw new BadRequestException('No file uploaded');
        //     }

        //     // Validate file type
        //     const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        //     if (!allowedTypes.includes(file.mimetype)) {
        //         throw new BadRequestException('Only JPEG, PNG, and JPG files are allowed');
        //     }

        //     // Validate file size (max 5MB)
        //     const maxSize = 5 * 1024 * 1024; // 5MB
        //     if (file.size > maxSize) {
        //         throw new BadRequestException('File size must be less than 5MB');
        //     }

        //     const user = await this.prisma.user.findUnique({
        //         where: { id: userId }
        //     });

        //     if (!user) {
        //         throw new NotFoundException('User not found');
        //     }

        //     // Delete old profile picture if exists
        //     if (user.fotoProfil) {
        //         const oldFilePath = path.join(process.cwd(), 'uploads', user.fotoProfil);
        //         if (fs.existsSync(oldFilePath)) {
        //             fs.unlinkSync(oldFilePath);
        //         }
        //     }

        //     // Generate unique filename
        //     const fileName = `${userId}_${Date.now()}${path.extname(file.originalname)}`;
        //     const uploadPath = path.join(process.cwd(), 'uploads', 'profiles');
            
        //     // Create directory if it doesn't exist
        //     if (!fs.existsSync(uploadPath)) {
        //         fs.mkdirSync(uploadPath, { recursive: true });
        //     }

        //     const filePath = path.join(uploadPath, fileName);
            
        //     // Save file
        //     fs.writeFileSync(filePath, file.buffer);

        //     // Update user profile picture path
        //     const profilePicturePath = `profiles/${fileName}`;
        //     await this.prisma.user.update({
        //         where: { id: userId },
        //         data: { fotoProfil: profilePicturePath }
        //     });

        //     return {
        //         message: 'Profile picture updated successfully',
        //         profilePicture: profilePicturePath
        //     };
        // }

        // async deleteProfilePicture(userId: string): Promise<{message: string} {
        //     const user = await this.findUserOrThrow(userId); 

        //     if (user.fotoProfil) {
        //         const filePath = path.join(process.cwd(), 'uploads', user.fotoProfil);
        //         if (fs.existsSync(filePath)) {
        //             fs.unlinkSync(filePath);
        //         }

        //         await this.prisma.user.update({
        //             where: { id: userId },
        //             data: { fotoProfil: null }
        //         });
        //     }

        //     return { message: 'Profile picture deleted successfully' };
        // }

        async getAllUsers(searchDto: SearchUserDto): Promise<{
            data: UserResponseDto[];
            total: number;
            page: number;
            limit: number;
        }> {
            const { page = 1, limit = 10, search, gender } = searchDto;
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

            if (gender) {
                where.gender = gender;
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
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                infaqTransactions: user.infaqTransactions,
                zakatTransactions: user.zakatTransactions,
            }
        }

        async searchUsers(searchDto: SearchUserDto): Promise<{
            data: UserResponseDto[];
            total: number;
        }> {
            const { search, gender } = searchDto;

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

            const [users, total] = await Promise.all([
                this.prisma.user.findMany({
                    where,
                    take: 50, // Limit search results
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
            const { page = 1, limit = 10, type } = query;
            const skip = (page - 1) * limit;

            let transactions: any[] = [];
            let total = 0;

            if (!type || type === 'infaq') {
                const infaqTransactions = await this.prisma.infaqTransaction.findMany({
                    where: { userId },
                    skip: !type ? skip : 0,
                    take: !type ? limit : undefined,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        nominal: true,
                        paymentMethod: true,
                        status: true,
                        catatan: true,
                        tanggalPembayaran: true,
                        createdAt: true,
                        updatedAt: true
                    }
                });

                const infaqTotal = await this.prisma.infaqTransaction.count({
                    where: { userId }
                });

                transactions = [...transactions, ...infaqTransactions.map(t => ({ ...t, type: 'infaq' }))];
                total += infaqTotal;
            }

            if (!type || type === 'zakat') {
                const zakatTransactions = await this.prisma.zakatTransaction.findMany({
                    where: { userId },
                    skip: !type ? 0 : skip,
                    take: !type ? undefined : limit,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        nominal: true,
                        jenisZakat: true,
                        paymentMethod: true,
                        status: true,
                        catatan: true,
                        tanggalPembayaran: true,
                        createdAt: true,
                        updatedAt: true
                    }
                });

                const zakatTotal = await this.prisma.zakatTransaction.count({
                    where: { userId }
                });

                transactions = [...transactions, ...zakatTransactions.map(t => ({ ...t, type: 'zakat' }))];
                total += zakatTotal;
            }

            // Sort by creation date if both types are included
            if (!type) {
                transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                transactions = transactions.slice(skip, skip + limit);
            }

            return {
                data: transactions,
                total,
                page,
                limit
            };
        }

        async deleteAccount(userId: string): Promise<{ message: string }> {
            const user = await this.prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            // Check if user has pending transactions
            const pendingTransactions = await this.prisma.infaqTransaction.count({
                where: {
                    userId,
                    status: 'PENDING'
                }
            }) + await this.prisma.zakatTransaction.count({
                where: {
                    userId,
                    status: 'PENDING'
                }
            });

            if (pendingTransactions > 0) {
                throw new BadRequestException('Cannot delete account with pending transactions');
            }

            // Delete profile picture if exists
            if (user.fotoProfil) {
                const filePath = path.join(process.cwd(), 'uploads', user.fotoProfil);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            // Soft delete - you might want to implement a proper soft delete mechanism
            // For now, we'll just delete the user (which will cascade delete transactions)
            await this.prisma.user.delete({
                where: { id: userId }
            });

            return { message: 'Account deleted successfully' };
        }

        async findUserOrThrow(userId: string) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            
            if (!user) throw new NotFoundException('User not found');

            return user;
        }
    }
