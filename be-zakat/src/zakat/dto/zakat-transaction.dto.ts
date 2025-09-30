import { IsEnum, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from '@prisma/client';

export class UpdateZakatTransactionDto {
    @ApiProperty({
        description: 'Status transaksi yang akan diupdate',
        enum: TransactionStatus,
        example: TransactionStatus.SUCCESS,
        required: false
    })
    @IsOptional()
    @IsEnum(TransactionStatus)
    status?: TransactionStatus;

    @ApiProperty({
        description: 'URL atau path bukti pembayaran',
        example: 'https://example.com/bukti-pembayaran.jpg',
        required: false
    })
    @IsOptional()
    @IsString()
    buktiPembayaran?: string;

    @ApiProperty({
        description: 'ID transaksi dari Midtrans',
        example: 'midtrans-transaction-id-123',
        required: false
    })
    @IsOptional()
    @IsString()
    midtransId?: string;

    @ApiProperty({
        description: 'Tanggal pembayaran berhasil (ISO 8601 format)',
        example: '2024-01-15T10:30:00Z',
        required: false
    })
    @IsOptional()
    @IsDateString()
    tanggalPembayaran?: string;
}

export class ZakatTransactionQueryDto { 
    @ApiProperty({
        description: 'Filter berdasarkan status transaksi',
        enum: TransactionStatus,
        example: TransactionStatus.SUCCESS,
        required: false
    })
    @IsOptional()
    @IsEnum(TransactionStatus)
    status?: TransactionStatus;

    @ApiProperty({
        description: 'Tanggal mulai filter (YYYY-MM-DD)',
        example: '2024-01-01',
        required: false
    })
    @IsOptional()
    @IsString()
    startDate?: string;

    @ApiProperty({
        description: 'Tanggal akhir filter (YYYY-MM-DD)',
        example: '2024-12-31',
        required: false
    })
    @IsOptional()
    @IsString()
    endDate?: string;

    @ApiProperty({
        description: 'Nomor halaman untuk pagination',
        example: '1',
        required: false
    })
    @IsOptional()
    @IsString()
    page?: string;

    @ApiProperty({
        description: 'Jumlah data per halaman',
        example: '10',
        required: false
    })
    @IsOptional()
    @IsString()
    limit?: string;
}

export class ZakatTransactionResponseDto {
    @ApiProperty({
        description: 'ID unik transaksi',
        example: 'uuid-string-here'
    })
    id: string;

    @ApiProperty({
        description: 'Jenis zakat yang dibayar',
        enum: ['FITRAH', 'MAAL', 'PENGHASILAN', 'EMAS', 'FIDYAH'],
        example: 'FITRAH'
    })
    jenisZakat: string;

    @ApiProperty({
        description: 'Nominal transaksi',
        example: 60000
    })
    nominal: number;

    @ApiProperty({
        description: 'Status transaksi',
        enum: TransactionStatus,
        example: TransactionStatus.SUCCESS
    })
    status: TransactionStatus;

    @ApiProperty({
        description: 'Metode pembayaran',
        example: 'MIDTRANS'
    })
    paymentMethod: string;

    @ApiProperty({
        description: 'Bukti pembayaran',
        example: 'https://example.com/bukti.jpg',
        required: false
    })
    buktiPembayaran?: string;

    @ApiProperty({
        description: 'Tanggal transaksi dibuat',
        example: '2024-01-15T10:30:00Z'
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Tanggal pembayaran berhasil',
        example: '2024-01-15T11:00:00Z',
        required: false
    })
    tanggalPembayaran?: Date;
}

export class ZakatTransactionStatisticsDto {
    @ApiProperty({
        description: 'Total jumlah transaksi',
        example: 25
    })
    totalTransactions: number;

    @ApiProperty({
        description: 'Total nominal yang telah dibayar',
        example: 1500000
    })
    totalAmount: number;

    @ApiProperty({
        description: 'Statistik berdasarkan jenis zakat',
        example: {
            FITRAH: { count: 10, amount: 600000 },
            MAAL: { count: 5, amount: 500000 },
            PENGHASILAN: { count: 8, amount: 300000 },
            EMAS: { count: 2, amount: 100000 },
            FIDYAH: { count: 0, amount: 0 }
        }
    })
    byType: {
        [key: string]: {
            count: number;
            amount: number;
        }
    };

    @ApiProperty({
        description: 'Statistik berdasarkan status transaksi',
        example: {
            SUCCESS: { count: 20, amount: 1200000 },
            PENDING: { count: 3, amount: 200000 },
            FAILED: { count: 2, amount: 100000 }
        }
    }) 
    byStatus: {
        [key: string]: {
            count: number;
            amount: number;
        }
    };
}