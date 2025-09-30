import { ApiProperty } from '@nestjs/swagger';

export class JwtPayloadDto {
  @ApiProperty({ description: 'User/Admin ID', example: 'uuid-string' })
  sub: string;

  @ApiProperty({ description: 'Token type', enum: ['admin', 'user'], example: 'user' })
  type: 'admin' | 'user';

  @ApiProperty({ description: 'Issued at', example: 1640995200 })
  iat?: number;

  @ApiProperty({ description: 'Expires at', example: 1640995200 })
  exp?: number;
}