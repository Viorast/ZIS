import { Body, Controller, HttpCode, HttpStatus, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiUnauthorizedResponse, 
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  AdminLoginDto,
  AdminRegisterDto,
  AdminResponseDto,
  AdminAuthResponseDto,
  UserLoginDto,
  UserRegisterDto,
  UserResponseDto,
  UserAuthResponseDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  MessageResponseDto,
} from './dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    //Admin Auth Endpoints
    @Post('admin/login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Admin login' })
    @ApiResponse({
        status: 200,
        description: 'Admin successfully logged in',
        type: AdminAuthResponseDto,
    })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    async adminLogin(@Body() adminLoginDto: AdminLoginDto): Promise<AdminAuthResponseDto> {
        return this.authService.adminLogin(adminLoginDto);
    }

    @Post('admin/register')
    @ApiOperation({ summary: 'Register new admin' })
    @ApiResponse({
        status: 201,
        description: 'Admin successfully created',
        type: AdminResponseDto,
    })
    @ApiConflictResponse({ description: 'Admin with this username or email already exists' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async adminRegister(@Body() adminRegisterDto: AdminRegisterDto): Promise<AdminResponseDto> {
        return this.authService.adminRegister(adminRegisterDto);
    }

    @Patch('admin/change-password')
    @UseGuards(AuthGuard('admin-jwt'))
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Change admin password' })
    @ApiResponse({
        status: 200,
        description: 'Password changed successfully',
        type: MessageResponseDto,
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing token / Current password is incorrect' })
    @ApiBadRequestResponse({ description: 'New passwords do not match' })
    async changeAdminPassword(
        @Request() req,
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<{ message: string}> {
        return this.authService.changeAdminPassword(req.user.UserId, changePasswordDto);
    }

    // User Auth Endpoints
    @Post('user/login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({
        status: 200,
        description: 'User successfully logged in',
        type: UserAuthResponseDto,
    })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    async userLogin(
        @Body() userLoginDto: UserLoginDto
    ): Promise<UserAuthResponseDto>{
        return this.authService.userLogin(userLoginDto);
    }
    
    @Post('user/register')
    @ApiOperation({ summary: 'Register new user' })
    @ApiResponse({
        status: 201,
        description: 'User successfully created',
        type: UserResponseDto,
    })
    @ApiConflictResponse({ description: 'User with this email already exists' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async userRegister(
        @Body() userRegisterDto: UserRegisterDto
    ): Promise<UserResponseDto>{
        return this.authService.userRegister(userRegisterDto);
    }

    @Patch('user/change-password')
    @UseGuards(AuthGuard('user-jwt'))
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Change user password' })
    @ApiResponse({
        status: 200,
        description: 'Password changed successfully',
        type: MessageResponseDto,
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing token / Current password is incorrect' })
    @ApiBadRequestResponse({ description: 'New passwords do not match' })
    async changeUserPassword(
        @Request() req,
        @Body() changePasswordDto: ChangePasswordDto
    ): Promise<{message: string}> {
        return this.authService.changeUserPassword(req.user.userId, changePasswordDto)
    }

    // Forgot Password Endpoints
    @Post('admin/forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Admin forgot password' })
    @ApiResponse({
        status: 200,
        description: 'Reset password email sent (if email exists)',
        type: MessageResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid email format' })
    async adminForgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
        return this.authService.adminForgotPassword(forgotPasswordDto);
    }

    @Post('admin/reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reset admin password' })
    @ApiResponse({
        status: 200,
        description: 'Password reset successfully',
        type: MessageResponseDto,
    })
    @ApiUnauthorizedResponse({ description: 'Invalid or expired reset token' })
    @ApiBadRequestResponse({ description: 'Passwords do not match' })
    async adminResetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
        return this.authService.adminResetPassword(resetPasswordDto);
    }

    @Post('user/forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'User forgot password' })
    @ApiResponse({
        status: 200,
        description: 'Reset password email sent (if email exists)',
        type: MessageResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid email format' })
    async userForgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
        return this.authService.userForgotPassword(forgotPasswordDto);
    }

    @Post('user/reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reset user password' })
    @ApiResponse({
        status: 200,
        description: 'Password reset successfully',
        type: MessageResponseDto,
    })
    @ApiUnauthorizedResponse({ description: 'Invalid or expired reset token' })
    @ApiBadRequestResponse({ description: 'Passwords do not match' })
    async userResetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
        return this.authService.userResetPassword(resetPasswordDto);
    }
}
