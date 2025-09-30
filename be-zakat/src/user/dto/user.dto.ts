import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
    IsString, 
    IsEmail, 
    IsOptional, 
    IsEnum, 
    IsDateString, 
    IsPhoneNumber,
    MinLength,
    MaxLength,
    Matches,
    IsNotEmpty,
    IsNumberString,
    IsInt,
    Min,
    IsDate
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '@prisma/client';

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
    newPassword: string

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