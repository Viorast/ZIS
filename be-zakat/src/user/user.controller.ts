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
import { UserJwtGuard } from './../guards/user-jwt.guard';
import { AdminJwtGuard } from './../guards/admin-jwt.guard';
import { 
  UpdateUserDto, 
  SearchUserDto, 
  UserResponseDto,
  ChangePasswordDto,
//   UpdateProfilePictureDto
} from './dto/user.dto';


@ApiTags('User Management')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('profile')
    @UseGuards(UserJwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
    async getProfile(@Request() req): Promise<UserResponseDto> {
        return this.userService.getProfile(req.user.id);
    }

    @Put('profile')
    @UseGuards(UserJwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiResponse({ status: 200, description: 'User profile updated successfully' })
    async updateProfile(
        @Request() req,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<UserResponseDto> {
        return this.userService.updateProfile(req.user.id, updateUserDto);
    }

    @Put('change-password')
    @UseGuards(UserJwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Change user password' })
    @ApiResponse({ status: 200, description: 'Password changed successfully' })
    async changePassword(
        @Request() req,
        @Body() changePasswordDto: ChangePasswordDto
    ): Promise<{ message: string }> {
        return this.userService.changePassword(req.user.id, changePasswordDto);
    }

    // @Put('profile-picture')
    // @UseGuards(UserJwtGuard)
    // @ApiBearerAuth()
    // @UseInterceptors(FileInterceptor('file'))
    // @ApiConsumes('multipart/form-data')
    // @ApiOperation({ summary: 'Update user profile picture' })
    // @ApiResponse({ status: 200, description: 'Profile picture updated successfully' })
    // async updateProfilePicture(
    //     @Request() req,
    //     @UploadedFile() file: Express.Multer.File
    // ): Promise<{ message: string; profilePicture: string }> {
    //     return this.userService.updateProfilePicture(req.user.id, file);
    // }

    // @Delete('profile-picture')
    // @UseGuards(UserJwtGuard)
    // @ApiBearerAuth()
    // @ApiOperation({ summary: 'Delete user profile picture' })
    // @ApiResponse({ status: 200, description: 'Profile picture deleted successfully' })
    // async deleteProfilePicture(@Request() req): Promise<{ message: string }> {
    //     return this.userService.deleteProfilePicture(req.user.id);
    // }

    @Get('list')
    @UseGuards(AdminJwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all users (Admin only)' })
    @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
    async getAllUsers(@Query() searchDto: SearchUserDto): Promise<{
        data: UserResponseDto[];
        total: number;
        page: number;
        limit: number;
    }> {
        return this.userService.getAllUsers(searchDto);
    }

    @Get('search')
    @UseGuards(AdminJwtGuard)
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
    @UseGuards(AdminJwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user by ID (Admin only)' })
    @ApiResponse({ status: 200, description: 'User retrieved successfully' })
    async getUserById(
        @Param('id', ParseUUIDPipe) id: string
    ): Promise<UserResponseDto> {
        return this.userService.getUserById(id);
    }

    @Delete('account')
    @UseGuards(UserJwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete user account (soft delete)' })
    @ApiResponse({ status: 200, description: 'User account deleted successfully' })
    async deleteAccount(@Request() req): Promise<{ message: string }> {
        return this.userService.deleteAccount(req.user.id);
    }

    @Get('transaction-history')
    @UseGuards(UserJwtGuard)
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
        return this.userService.getTransactionHistory(req.user.id, query);
    }
}
