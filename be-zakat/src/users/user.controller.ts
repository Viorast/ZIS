// src/user/user.controller.ts
import { 
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Controller,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UnifiedJwtGuard } from '../guards/unified-jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { 
  UpdateUserDto, 
  SearchUserDto, 
  UserResponseDto,
  ChangePasswordDto,
  UserFilterDto,
  UpdateUserRoleDto
} from './dto/create-user.dto';

@ApiTags('User Management')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // ✅ Public endpoints - untuk user sendiri
    @Get('profile')
    @UseGuards(UnifiedJwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'User profile retrieved successfully', type: UserResponseDto })
    async getProfile(@Request() req): Promise<UserResponseDto> {
        return this.userService.getProfile(req.user.userId);
    }

    @Put('profile')
    @UseGuards(UnifiedJwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiResponse({ status: 200, description: 'User profile updated successfully', type: UserResponseDto })
    async updateProfile(
        @Request() req,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<UserResponseDto> {
        return this.userService.updateProfile(req.user.userId, updateUserDto);
    }

    @Put('change-password')
    @UseGuards(UnifiedJwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Change user password' })
    @ApiResponse({ status: 200, description: 'Password changed successfully' })
    async changePassword(
        @Request() req,
        @Body() changePasswordDto: ChangePasswordDto
    ): Promise<{ message: string }> {
        return this.userService.changePassword(req.user.userId, changePasswordDto);
    }

    @Get('transaction-history')
    @UseGuards(UnifiedJwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user transaction history' })
    @ApiResponse({ status: 200, description: 'Transaction history retrieved successfully' })
    async getTransactionHistory(
        @Request() req,
        @Query() query: { page?: number; limit?: number; type?: 'infaq' | 'zakat' }
    ): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }> {
        return this.userService.getTransactionHistory(req.user.userId, query);
    }

    @Delete('account')
    @UseGuards(UnifiedJwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete user account (soft delete)' })
    @ApiResponse({ status: 200, description: 'User account deleted successfully' })
    async deleteAccount(@Request() req): Promise<{ message: string }> {
        return this.userService.deleteAccount(req.user.userId);
    }

    // ✅ Admin only endpoints
    @Get('list')
    @UseGuards(UnifiedJwtGuard, RolesGuard)
    @Roles(UserRole.PENGURUS, UserRole.BENDAHARA, UserRole.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all users (Admin only)' })
    @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
    async getAllUsers(@Query() filterDto: UserFilterDto): Promise<{
        data: UserResponseDto[];
        total: number;
        page: number;
        limit: number;
    }> {
        return this.userService.getAllUsers(filterDto);
    }

    @Get('search')
    @UseGuards(UnifiedJwtGuard, RolesGuard)
    @Roles(UserRole.PENGURUS, UserRole.BENDAHARA, UserRole.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Search users (Admin only)' })
    @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
    async searchUsers(@Query() searchDto: SearchUserDto): Promise<{
        data: UserResponseDto[];
        total: number;
    }> {
        return this.userService.searchUsers(searchDto);
    }

    @Get(':id')
    @UseGuards(UnifiedJwtGuard, RolesGuard)
    @Roles(UserRole.PENGURUS, UserRole.BENDAHARA, UserRole.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user by ID (Admin only)' })
    @ApiResponse({ status: 200, description: 'User retrieved successfully', type: UserResponseDto })
    async getUserById(
        @Param('id', ParseUUIDPipe) id: string
    ): Promise<UserResponseDto> {
        return this.userService.getUserById(id);
    }

    @Put(':id/role')
    @UseGuards(UnifiedJwtGuard, RolesGuard)
    @Roles(UserRole.BENDAHARA, UserRole.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user role (Bendahara/Super Admin only)' })
    @ApiResponse({ status: 200, description: 'User role updated successfully', type: UserResponseDto })
    async updateUserRole(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateRoleDto: UpdateUserRoleDto
    ): Promise<UserResponseDto> {
        return this.userService.updateUserRole(id, updateRoleDto);
    }

    // Profile picture endpoints (commented for now)
    // @Put('profile-picture')
    // @UseGuards(UnifiedJwtGuard)
    // @ApiBearerAuth()
    // @UseInterceptors(FileInterceptor('file'))
    // @ApiConsumes('multipart/form-data')
    // @ApiOperation({ summary: 'Update user profile picture' })
    // @ApiResponse({ status: 200, description: 'Profile picture updated successfully' })
    // async updateProfilePicture(
    //     @Request() req,
    //     @UploadedFile() file: Express.Multer.File
    // ): Promise<{ message: string; profilePicture: string }> {
    //     return this.userService.updateProfilePicture(req.user.userId, file);
    // }

    // @Delete('profile-picture')
    // @UseGuards(UnifiedJwtGuard)
    // @ApiBearerAuth()
    // @ApiOperation({ summary: 'Delete user profile picture' })
    // @ApiResponse({ status: 200, description: 'Profile picture deleted successfully' })
    // async deleteProfilePicture(@Request() req): Promise<{ message: string }> {
    //     return this.userService.deleteProfilePicture(req.user.userId);
    // }
}