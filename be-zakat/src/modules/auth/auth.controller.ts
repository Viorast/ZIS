import { Body, Controller, HttpCode, HttpStatus, Patch, Post, UseGuards, Request, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiUnauthorizedResponse, 
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UnifiedLoginDto, UnifiedRegisterDto, UnifiedAuthResponseDto } from './dto/unified-auth.dto';
import { ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto, MessageResponseDto, ValidateResetTokenDto } from './dto/common-auth.dto';
import { AdminSetupService } from 'src/scripts/admin-setup.service';

@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly adminSetupService: AdminSetupService,
    ) {}

    @Post('setup-admin')
    async setupAdmin(@Body() setupDto: { secret: string }) {
        // Simple security check
        if (setupDto.secret !== 'dev-setup-2024') {
        throw new UnauthorizedException('Invalid secret');
        }

        if (process.env.NODE_ENV !== 'development') {
        throw new ForbiddenException('This endpoint is for development only');
        }

        return this.adminSetupService.setupAdminUsers();
    }

    // Unified Login Endpoint
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({
        status: 200,
        description: 'Successfully logged in',
        type: UnifiedAuthResponseDto,
    })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async login(@Body() loginDto: UnifiedLoginDto): Promise<UnifiedAuthResponseDto> {
        return this.authService.unifiedLogin(loginDto);
    }

    @Post('register')
    @ApiOperation({ summary: 'Register new user' })
    @ApiResponse({
        status: 201,
        description: 'User successfully registered',
        type: UnifiedAuthResponseDto,
    })
    @ApiConflictResponse({ description: 'User with this email already exists' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async register(@Body() registerDto: UnifiedRegisterDto): Promise<UnifiedAuthResponseDto> {
        return this.authService.unifiedRegister(registerDto);
    }
    
    @Patch('change-password')
    @UseGuards(AuthGuard('unified-jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Change password for logged-in user' })
    @ApiResponse({
        status: 200,
        description: 'Password successfully changed',
        type: MessageResponseDto,
    })
    @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
    @ApiBadRequestResponse({ description: 'Current password is incorrect or new passwords do not match' })
    async changePassword(
        @Request() req,
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<{ message: string}> {
        return this.authService.changePassword(req.user.userId, changePasswordDto);
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Request password reset link' })
    @ApiResponse({
        status: 200,
        description: 'If email exists, reset link will be sent',
        type: MessageResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid email format' })
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Post('validate-reset-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Validate password reset token' })
    @ApiResponse({
        status: 200,
        description: 'Token validation result',
        schema: {
            type: 'object',
            properties: {
                valid: { type: 'boolean' },
                email: { type: 'string', nullable: true },
                message: { type: 'string', nullable: true }
            }
        }
    })
    @ApiBadRequestResponse({ description: 'Invalid token format' })
    async validateResetToken(@Body() validateDto: ValidateResetTokenDto): Promise<{ 
        valid: boolean; 
        email?: string;
        message?: string;
    }> {
        return this.authService.validateResetToken(validateDto.token);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reset password using valid token' })
    @ApiResponse({
        status: 200,
        description: 'Password successfully reset',
        type: MessageResponseDto,
    })
    @ApiUnauthorizedResponse({ description: 'Invalid or expired reset token' })
    @ApiBadRequestResponse({ description: 'Passwords do not match or invalid input' })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
        return this.authService.resetPassword(resetPasswordDto);
    }
}