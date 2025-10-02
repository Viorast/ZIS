import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/dto/user-role.enum';

export class JwtPayloadDto {
  @ApiProperty({ description: 'Subject (user ID)' })
  sub: string;

  @ApiProperty({ description: 'Email' })
  email: string;

  @ApiProperty({ enum: UserRole, description: 'User role' })
  role: UserRole;

  @ApiProperty({ description: 'Token type for backward compatibility' })
  type: string;
}