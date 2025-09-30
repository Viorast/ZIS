import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod, ZakatType } from '@prisma/client';

export class CreateZakatPaymentDto {
    @ApiProperty({
        description: 'Jenis zakat yang akan dibayar',
        enum: ZakatType,
        example: ZakatType.FITRAH
    })
    @IsEnum(ZakatType)
    jenisZakat: ZakatType;

    @ApiProperty({
        description: 'Nominal pembayaran zakat (dalam rupiah)',
        example: 60000,
        minimum: 1000
    })
    @IsNumber()
    @IsPositive()
    @Min(1000)
    nominal: number;

    @ApiProperty({
        description: 'Metode pembayaran yang dipilih',
        enum: PaymentMethod,
        example: PaymentMethod.MIDTRANS
    })
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @ApiProperty({
        description: 'Catatan tambahan untuk pembayaran (opsional)',
        example: 'Zakat fitrah untuk keluarga',
        required: false
    })
    @IsOptional()
    @IsString()
    catatan?: string;
}

export class ZakatPaymentResponseDto { 
    @ApiProperty({
        description: 'ID unik pembayaran',
        example: 'uuid-string-here'
    })
    id: string;

    @ApiProperty({
        description: 'Jenis zakat yang dibayar',
        enum: ZakatType,
        example: ZakatType.FITRAH
    })
    jenisZakat: ZakatType;

    @ApiProperty({
        description: 'Nominal pembayaran zakat',
        example: 60000
    })
    nominal: number;

    @ApiProperty({ 
        description: 'Metode pembayaran yang digunakan',
        enum: PaymentMethod,
        example: PaymentMethod.MIDTRANS
    })
    paymentMethod: PaymentMethod;

    @ApiProperty({
        description: 'Status pembayaran',
        example: 'PENDING'
    })
    status: string;

    @ApiProperty({
        description: 'Token pembayaran dari payment gateway (jika ada)',
        example: 'midtrans-token-here',
        required: false
    })
    paymentToken?: string;

    @ApiProperty({
        description: 'URL untuk melakukan pembayaran (jika ada)',
        example: 'https://app.midtrans.com/snap/v1/transactions/token',
        required: false
    })
    paymentUrl?: string;

    @ApiProperty({
        description: 'Tanggal pembayaran dibuat',
        example: '2024-01-15T10:30:00Z'
    })
    createdAt: Date;
}