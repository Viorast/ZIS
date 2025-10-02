// src/users/dto/create-user.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
    IsString, 
    IsEmail, 
    IsOptional, 
    IsEnum, 
    IsDateString, 
    MinLength,
    MaxLength,
    Matches,
    IsNotEmpty,
    IsNumberString,
    IsInt,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '@prisma/client';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
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
  @MaxLength(100)
  fullName: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  @Matches(/^(\+62|62|0)8[1-9]{6,13}$/, {
    message: 'Phone number must be a valid Indonesian phone number'
  })
  nomorHp?: string;

  @ApiPropertyOptional({ enum: UserRole, description: 'User role' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ description: 'pengurus ID (for staff)' })
  @IsOptional()
  @IsString()
  pengurusID?: string;

  @ApiPropertyOptional({ enum: Gender, description: 'User gender' })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ description: 'Place of birth' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tempatLahir?: string;

  @ApiPropertyOptional({ description: 'Date of birth' })
  @IsOptional()
  @IsDateString()
  tanggalLahir?: string;

  @ApiPropertyOptional({ description: 'KTP Number' })
  @IsOptional()
  @IsNumberString()
  @MinLength(16)
  @MaxLength(16)
  nomorKtp?: string;

  @ApiPropertyOptional({ description: 'Address' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  alamat?: string;
}

// Existing DTOs (tetap dipertahankan untuk backward compatibility)
export class UpdateUserDto {
    @ApiPropertyOptional({ description: 'User full name'})
    @IsOptional()
    @IsString()
    @MaxLength(100)
    fullName?: string;

    @ApiPropertyOptional({ enum: Gender, description: 'User Gender'})
    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @ApiPropertyOptional({ description: 'Place of birth'})
    @IsOptional()
    @IsString()
    @MaxLength(100)
    tempatLahir?: string;

    @ApiPropertyOptional({ description: 'Date of Birth'})
    @IsOptional()
    @IsDateString()
    tanggalLahir?: string;

    @ApiPropertyOptional({ description: 'Phone number'})
    @IsOptional()
    @IsString()
    @Matches(/^(\+62|62|0)8[1-9]{6,13}$/, {
        message: 'Phone number must be a valid Indonesian phone number'
    })
    nomorHp?: string;

    @ApiPropertyOptional({ description: 'KTP Number'})
    @IsOptional()
    @IsNumberString()
    @MinLength(16)
    @MaxLength(16)
    nomorKtp?: string;

    @ApiPropertyOptional({ description: 'Email address'})
    @IsOptional()
    @IsString()
    @MaxLength(255)
    alamat?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email?: string;
}

export class ChangePasswordDto {
    @ApiProperty({ description: 'Current Password'})
    @IsNotEmpty()
    @IsString()
    currentPassword: string;

    @ApiProperty({ description: 'New Password'})
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    newPassword: string;

    @ApiProperty({ description: 'Confirm new Password'})
    @IsNotEmpty()
    @IsString()
    confirmPassword: string;
}

export class SearchUserDto {
    @ApiPropertyOptional({ description: 'Search term'})
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ enum: Gender,  description: 'Filter by gender'})
    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @ApiPropertyOptional({ enum: UserRole, description: 'Filter by role' })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiPropertyOptional({description: 'Page Number', minimum: 1, default: 1})
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 100, default: 10})
    @IsOptional()
    @Type(()=> Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
}

// export class UpdateProfilePictureDto {
//     @ApiProperty({ type: 'string', format: 'binary', description: 'Profile picture file (JPEG, PNG, JPG, max 5MB'})
//     file: Express.Multer.File;
// }

// Update UserResponseDto untuk include role
export class UserResponseDto {
    @ApiProperty({ description: 'User ID' })
    id: string;

    @ApiProperty({ description: 'User full name' })
    fullName: string;

    @ApiProperty({ enum: Gender, description: 'User gender' })
    gender: Gender;

    @ApiProperty({ description: 'Place of birth' })
    tempatLahir: string;

    @ApiProperty({ description: 'Date of birth' })
    tanggalLahir: Date;

    @ApiProperty({ description: 'Phone number' })
    nomorHp: string;

    @ApiProperty({ description: 'KTP number' })
    nomorKtp: string;

    @ApiProperty({ description: 'Address' })
    alamat: string;

    @ApiProperty({ description: 'Email address' })
    email: string;

    @ApiProperty({ enum: UserRole, description: 'User role' })
    role: UserRole;

    @ApiPropertyOptional({ description: 'pengurus ID' })
    pengurusID?: string;

    @ApiProperty({ description: 'Profile picture URL' })
    fotoProfil: string;

    @ApiProperty({ description: 'Created at' })
    createdAt: Date;

    @ApiProperty({ description: 'Updated at' })
    updatedAt: Date;

    @ApiPropertyOptional({ description: 'Recent infaq transactions' })
    infaqTransactions?: any[];

    @ApiPropertyOptional({ description: 'Recent zakat transactions' })
    zakatTransactions?: any[];
}

export class TransactionHistoryQueryDto {
    @ApiPropertyOptional({ description: 'Page number', minimum: 1, default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 100, default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @ApiPropertyOptional({ enum: ['infaq', 'zakat'], description: 'Transaction type filter' })
    @IsOptional()
    @IsEnum(['infaq', 'zakat'])
    type?: 'infaq' | 'zakat';
}

// DTO untuk Update User Role (Admin only)
export class UpdateUserRoleDto {
  @ApiProperty({ enum: UserRole, description: 'New user role' })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiPropertyOptional({ description: 'pengurus ID' })
  @IsOptional()
  @IsString()
  pengurusID?: string;
}

//  DTO untuk Filter Users by Role
export class UserFilterDto {
  @ApiPropertyOptional({ enum: UserRole, description: 'Filter by role' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Search term (name, email, etc.)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number', minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

// Khusus SUPER_ADMIN untuk membuat admin user

export class CreateAdminUserDto {
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

  @ApiProperty({ enum: UserRole, description: 'User role' })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: 'pengurus dD' })
  @IsString()
  @IsNotEmpty()
  pengurusId: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  nomorHp?: string;
}