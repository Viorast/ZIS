import { Controller, Get, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@ApiTags('Google Authentication')
@Controller('auth/google')
export class GoogleAuthController {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    @Get()
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Initiate Google OAuth flow' })
    async googleAuth(@Req() req) {
        // Guard akan redirect ke Google
    }

    @Get('redirect')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Google OAuth callback' })
    @ApiResponse({ status: 200, description: 'Successfully authenticated with Google' })
    @ApiResponse({ status: 401, description: 'Google authentication failed' })
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        try {
        // Generate JWT token
        const payload = {
            sub: req.user.id,
            email: req.user.email,
            role: req.user.role,
            type: 'user',
        };

        const access_token = this.jwtService.sign(payload);

        // Redirect ke frontend dengan token
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3001';
        return res.redirect(
            `${frontendUrl}/auth/success?token=${access_token}&user=${encodeURIComponent(JSON.stringify(req.user))}`
        );
        } catch (error) {
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3001';
        return res.redirect(`${frontendUrl}/auth/error?message=Google auth failed`);
        }
    }
}