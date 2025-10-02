// src/user/user.controller.ts
import { 
  Get,
  Post,
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
import { UnifiedJwtGuard } from '../../guards/unified-jwt.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Permissions } from '../../decorators/permissons.decorator';
import { Permission } from 'src/modules/auth/roles/permissions.enum';
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
@UseGuards(UnifiedJwtGuard, RolesGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    // ==================== USER SELF-MANAGEMENT ENDPOINTS ====================

    @Get('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ 
        status: 200, 
        description: 'User profile retrieved successfully', 
        type: UserResponseDto 
    })
    async getProfile(@Request() req): Promise<UserResponseDto> {
        return this.userService.getProfile(req.user.userId);
    }

    @Put('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiResponse({ 
        status: 200, 
        description: 'User profile updated successfully', 
        type: UserResponseDto 
    })
    async updateProfile(
        @Request() req,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<UserResponseDto> {
        return this.userService.updateProfile(req.user.userId, updateUserDto);
    }

    @Put('change-password')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Change user password' })
    @ApiResponse({ 
        status: 200, 
        description: 'Password changed successfully' 
    })
    async changePassword(
        @Request() req,
        @Body() changePasswordDto: ChangePasswordDto
    ): Promise<{ message: string }> {
        return this.userService.changePassword(req.user.userId, changePasswordDto);
    }

    @Get('transaction-history')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user transaction history' })
    @ApiResponse({ 
        status: 200, 
        description: 'Transaction history retrieved successfully' 
    })
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
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete user account' })
    @ApiResponse({ 
        status: 200, 
        description: 'User account deleted successfully' 
    })
    async deleteAccount(@Request() req): Promise<{ message: string }> {
        return this.userService.deleteAccount(req.user.userId);
    }

    // ==================== ADMIN USER MANAGEMENT ENDPOINTS ====================

    @Get('list')
    @Permissions(Permission.USER_READ)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ 
        status: 200, 
        description: 'Users retrieved successfully' 
    })
    async getAllUsers(@Query() filterDto: UserFilterDto): Promise<{
        data: UserResponseDto[];
        total: number;
        page: number;
        limit: number;
    }> {
        return this.userService.getAllUsers(filterDto);
    }

    @Get('search')
    @Permissions(Permission.USER_READ)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Search users' })
    @ApiResponse({ 
        status: 200, 
        description: 'Search results retrieved successfully' 
    })
    async searchUsers(@Query() searchDto: SearchUserDto): Promise<{
        data: UserResponseDto[];
        total: number;
    }> {
        return this.userService.searchUsers(searchDto);
    }

    @Get(':id')
    @Permissions(Permission.USER_READ) 
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ 
        status: 200, 
        description: 'User retrieved successfully', 
        type: UserResponseDto 
    })
    async getUserById(
        @Param('id', ParseUUIDPipe) id: string
    ): Promise<UserResponseDto> {
        return this.userService.getUserById(id);
    }

    @Put(':id/role')
    @Permissions(Permission.USER_WRITE)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user role' })
    @ApiResponse({ 
        status: 200, 
        description: 'User role updated successfully', 
        type: UserResponseDto 
    })
    async updateUserRole(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateRoleDto: UpdateUserRoleDto
    ): Promise<UserResponseDto> {
        return this.userService.updateUserRole(id, updateRoleDto);
    }

    // ==================== SUPER ADMIN ONLY ENDPOINTS ====================

    @Post('admin')
    @Permissions(Permission.USER_WRITE, Permission.SYSTEM_CONFIG) 
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create admin user (Super Admin only)' })
    @ApiResponse({ 
        status: 201, 
        description: 'Admin user created successfully', 
        type: UserResponseDto 
    })
    async createAdminUser(
        @Body() createAdminDto: any // Buat DTO khusus untuk create admin
    ): Promise<UserResponseDto> {
        return this.userService.createAdminUser(createAdminDto);
    }

    @Delete(':id/admin')
    @Permissions(Permission.USER_WRITE, Permission.SYSTEM_CONFIG)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete user (Super Admin only)' })
    @ApiResponse({ 
        status: 200, 
        description: 'User deleted successfully' 
    })
    async deleteUser(
        @Param('id', ParseUUIDPipe) id: string
    ): Promise<{ message: string }> {
        return this.userService.deleteUser(id);
    }

    // Profile picture endpoints (commented for now)
    // @Put('profile-picture')
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
    // @ApiBearerAuth()
    // @ApiOperation({ summary: 'Delete user profile picture' })
    // @ApiResponse({ status: 200, description: 'Profile picture deleted successfully' })
    // async deleteProfilePicture(@Request() req): Promise<{ message: string }> {
    //     return this.userService.deleteProfilePicture(req.user.userId);
    // }
}