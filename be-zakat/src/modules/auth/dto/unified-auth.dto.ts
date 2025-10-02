// src/auth/dto/unified-auth.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../users/dto/user-role.enum';

// Unified Login DTO
export class UnifiedLoginDto {
  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

// Unified Register DTO
export class UnifiedRegisterDto {
  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Full name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  nomorHp?: string;

  @ApiPropertyOptional({ enum: UserRole, description: 'User role' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ description: 'pengurus ID (for staff)' })
  @IsOptional()
  @IsString()
  pengurusID?: string;

  // Fields khusus admin (backward compatibility)
  @ApiPropertyOptional({ description: 'Username (legacy admin field)' })
  @IsOptional()
  @IsString()
  username?: string;
}

// Unified Response DTO
export class UnifiedAuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  access_token: string;

  @ApiProperty({ description: 'User data' })
  user: any;
}