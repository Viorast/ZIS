import { IsEmail, IsString, MinLength, IsOptional, IsEnum} from 'class-validator';
import { AdminRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
    @ApiProperty({
      description: 'Admin email',
      example: 'admin@example.com'
    })

    @IsEmail()
    email: string;

    @ApiProperty({
      description: 'Admin password',
      example: 'password123',
      minLength: 6,
    })

    @IsString()
    @MinLength(6)
    password: string;
}

export class AdminRegisterDto {
  @ApiProperty({
    description: 'Admin username',
    example: 'admin123',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Admin email',
    example: 'admin@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Admin password',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Admin full name',
    example: 'Andry Tumaruk',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Admin role (Otomatis Petugas)',
    enum: AdminRole,
    example: AdminRole.PETUGAS,
  })
  @IsEnum(AdminRole)
  role: AdminRole;

}

export class AdminResponseDto {
  @ApiProperty({ description: 'Admin ID', example: 'uuid-string' })
  id: string;

  @ApiProperty({ description: 'Admin username', example: 'admin123' })
  username: string;

  @ApiProperty({ description: 'Admin email', example: 'admin@example.com' })
  email: string;

  @ApiProperty({ description: 'Admin full name', example: 'John Doe' })
  fullName: string;

   @ApiProperty({ description: 'Admin role', enum: AdminRole, example: AdminRole.PETUGAS })
  role: AdminRole;
  
  @ApiProperty({ description: 'Created at', example: '2025-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2025-01-01T00:00:00Z' })
  updatedAt: Date;
}

export class AdminAuthResponseDto {
  @ApiProperty({ description: 'JWT access token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ description: 'Admin data', type: AdminResponseDto })
  admin: AdminResponseDto;
}

