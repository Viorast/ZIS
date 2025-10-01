// src/auth/dto/common-auth.dto.ts (SHARED DTOs)
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current Password' })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({ description: 'New Password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;

  @ApiProperty({ description: 'Confirm new Password' })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ 
    description: 'Reset token received via email (64 character hex string)',
    example: 'a1b2c3d4e5f6789012345678901234567890123456789012345678901234567'
  })
  @IsNotEmpty()
  @IsString()
  @Length(64, 64)
  @Matches(/^[a-f0-9]+$/i, {
    message: 'Token must be a valid 64-character hex string'
  })
  token: string;

  @ApiProperty({ description: 'New password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;

  @ApiProperty({ description: 'Confirm new password' })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}

export class ValidateResetTokenDto {
  @ApiProperty({ 
    description: 'Reset token to validate',
    example: 'a1b2c3d4e5f6789012345678901234567890123456789012345678901234567'
  })
  @IsNotEmpty()
  @IsString()
  @Length(64, 64)
  @Matches(/^[a-f0-9]+$/i, {
    message: 'Token must be a valid 64-character hex string'
  })
  token: string;
}

export class MessageResponseDto {
  @ApiProperty({ description: 'Response message' })
  message: string;
}