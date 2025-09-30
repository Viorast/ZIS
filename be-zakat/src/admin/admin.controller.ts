import { 
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Controller,
  UseGuards,
  Request
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminJwtGuard } from './../guards/admin-jwt.guard';
import { AdminRole } from '@prisma/client';
import { 
  UpdateAdminDto, 
  SearchAdminDto, 
  AdminResponseDto,
  ChangePasswordDto 
} from './dto/admin.dto';

@ApiTags('Admin Management')
@Controller('admin')
@UseGuards(AdminJwtGuard)
@ApiBearerAuth()
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('profile')
    @ApiOperation({ summary: 'Get current admin profile' })
    @ApiResponse({ status: 200, description: 'Admin profile retrieved successfully' })
    async getProfile(@Request() req): Promise<AdminResponseDto> {
        return this.adminService.getProfile(req.user.id);
    }

    @Put('profile')
    @ApiOperation({ summary: 'Update current admin profile' })
    @ApiResponse({ status: 200, description: 'Admin profile updated successfully' })
    async updateProfile(
        @Request() req,
        @Body() updateAdminDto: UpdateAdminDto
    ): Promise<AdminResponseDto> {
        return this.adminService.updateProfile(req.user.id, updateAdminDto);
    }

    @Put('change-password')
    @ApiOperation({ summary: 'Change admin password' })
    @ApiResponse({ status: 200, description: 'Password changed successfully' })
    async changePassword(
        @Request() req,
        @Body() changePasswordDto: ChangePasswordDto
    ): Promise<{ message: string }> {
        return this.adminService.changePassword(req.user.id, changePasswordDto);
    }

    // @Get('list')
    // @Roles(AdminRole.BENDAHARA)
    // @ApiOperation({ summary: 'Get all admins (Bendahara only)' })
    // @ApiResponse({ status: 200, description: 'Admins retrieved successfully' })
    // async getAllAdmins(@Query() searchDto: SearchAdminDto): Promise<{
    //     data: AdminResponseDto[];
    //     total: number;
    //     page: number;
    //     limit: number;
    // }> {
    //     return this.adminService.getAllAdmins(searchDto);
    // }

    @Get('search')
    @ApiOperation({ summary: 'Search admins' })
    @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
    async searchAdmins(@Query() searchDto: SearchAdminDto): Promise<{
        data: AdminResponseDto[];
        total: number;
    }> {
        return this.adminService.searchAdmins(searchDto);
    }

    // @Get(':id')
    // @Roles(AdminRole.BENDAHARA)
    // @ApiOperation({ summary: 'Get admin by ID (Bendahara only)' })
    // @ApiResponse({ status: 200, description: 'Admin retrieved successfully' })
    // async getAdminById(
    //     @Param('id', ParseUUIDPipe) id: string
    // ): Promise<AdminResponseDto> {
    //     return this.adminService.getAdminById(id);
    // }

    // @Put(':id')
    // @Roles(AdminRole.BENDAHARA)
    // @ApiOperation({ summary: 'Update admin by ID (Bendahara only)' })
    // @ApiResponse({ status: 200, description: 'Admin updated successfully' })
    // async updateAdmin(
    //     @Param('id', ParseUUIDPipe) id: string,
    //     @Body() updateAdminDto: UpdateAdminDto
    // ): Promise<AdminResponseDto> {
    //     return this.adminService.updateAdmin(id, updateAdminDto);
    // }

    // @Delete(':id')
    // @Roles(AdminRole.BENDAHARA)
    // @ApiOperation({ summary: 'Delete admin by ID (Bendahara only)' })
    // @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
    // async deleteAdmin(
    //     @Param('id', ParseUUIDPipe) id: string
    // ): Promise<{ message: string }> {
    //     return this.adminService.deleteAdmin(id);
    // }
}
