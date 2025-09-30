import {IsString, IsEmail, MinLength, IsOptional} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserLoginDto {
    @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
    @IsEmail()
    email: string;

    @ApiProperty({
      description: 'User password',
      example: 'password123',
      minLength: 6,
    })
    @IsString()
    @MinLength(6)
    password: string;
}

export class UserRegisterDto {
    @ApiProperty({
      description: 'User email',
      example: 'user@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
      description: 'User password',
      example: 'password123',
      minLength: 6,
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({
      description: 'User full name',
      example: 'Jane Doe',
    })
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiPropertyOptional({
    description: 'ID Ktp Number',
    example: '1234567890123456',
  })
    @IsOptional()
    @IsString()
    nomorHp?: string;
}

export class UserResponseDto {
  @ApiProperty({ description: 'User ID', example: 'uuid-string' })
  id: string;

  @ApiPropertyOptional({ description: 'User full name', example: 'Jane Doe' })
  fullName?: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '08123456789' })
  nomorHp?: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;
  
  @ApiProperty({ description: 'Created at', example: '2023-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2023-01-01T00:00:00Z' })
  updatedAt: Date;
}

export class UserAuthResponseDto {
  @ApiProperty({ description: 'JWT access token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ description: 'User data', type: UserResponseDto })
  user: UserResponseDto;
}