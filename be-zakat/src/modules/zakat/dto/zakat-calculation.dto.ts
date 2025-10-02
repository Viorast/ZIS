import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ZakatType } from '@prisma/client';

export class ZakatCalculationDto {
    @ApiProperty({
        description: 'Jenis zakat yang akan dihitung',
        enum: ZakatType,
        example: ZakatType.FITRAH
    })
    @IsEnum(ZakatType)
    jenisZakat: ZakatType;

    @ApiProperty({
        description: 'Nominal atau jumlah yang akan dihitung zakatnya',
        example: 1000000,
        minimum: 0
    })
    @IsNumber()
    @IsPositive()
    @Min(0)
    nominal: number;

    @ApiProperty({
        description: 'Catatan tambahan (opsional)',
        example: 'Zakat untuk bulan Ramadan',
        required: false
    })
    @IsOptional()
    @IsString() 
    catatan?: string; 
}

export class ZakatFitrahCalculationDto {
    @ApiProperty({
        description: 'Jumlah jiwa yang akan dibayarkan zakat fitrahnya',
        example: 4,
        minimum: 1
    })
    @IsNumber()
    @IsPositive()
    @Min(1)
    jumlahJiwa: number;
}

export class ZakatMaalCalculationDto { 
    @ApiProperty({
        description: 'Total harta yang dimiliki (dalam rupiah)',
        example: 100000000,
        minimum: 0
    })
    @IsNumber()
    @IsPositive()
    @Min(0)
    totalHarta: number;

    @ApiProperty({
        description: 'Total hutang yang dimiliki (dalam rupiah)',
        example: 5000000,
        minimum: 0
    })
    @IsNumber()
    @IsPositive()
    @Min(0)
    totalHutang: number;
}

export class ZakatPenghasilanCalculationDto {
    @ApiProperty({
        description: 'Penghasilan bruto per bulan (dalam rupiah)',
        example: 10000000,
        minimum: 0
    })
    @IsNumber()
    @IsPositive()
    @Min(0)
    penghasilanBruto: number;

    @ApiProperty({
        description: 'Potongan wajib seperti pajak, asuransi, dll (dalam rupiah)',
        example: 1000000,
        minimum: 0
    })
    @IsNumber()
    @IsPositive()
    @Min(0)
    potonganWajib: number;

    @ApiProperty({
        description: 'Kebutuhan pokok bulanan (dalam rupiah)',
        example: 3000000,
        minimum: 0
    })
    @IsNumber()
    @IsPositive()
    @Min(0)
    kebutuhanPokok: number;
}

export class ZakatEmasCalculationDto {
    @ApiProperty({
        description: 'Berat emas yang dimiliki (dalam gram)',
        example: 100,
        minimum: 0
    })
    @IsNumber()
    @IsPositive()
    @Min(0)
    beratEmas: number;

    @ApiProperty({
        description: 'Harga emas per gram (dalam rupiah)',
        example: 1200000,
        minimum: 0
    })
    @IsNumber()
    @IsPositive()
    @Min(0)
    hargaEmasPerGram: number;
}

export class ZakatFidyahCalculationDto {
    @ApiProperty({
        description: 'Jumlah hari yang tidak berpuasa',
        example: 5,
        minimum: 1
    })
    @IsNumber()
    @IsPositive()
    @Min(1)
    jumlahHari: number;
}

export class ZakatCalculationResponseDto {
    @ApiProperty({
        description: 'Jenis zakat yang dihitung',
        enum: ZakatType,
        example: ZakatType.FITRAH
    })
    jenisZakat: ZakatType;

    @ApiProperty({
        description: 'Nominal zakat yang harus dibayar (dalam rupiah)',
        example: 60000
    })
    nominal: number;

    @ApiProperty({
        description: 'Nilai nisab untuk jenis zakat ini',
        example: 85000000
    })
    nisab: number;

    @ApiProperty({
        description: 'Apakah wajib membayar zakat berdasarkan nisab',
        example: true
    })
    wajibZakat: boolean;

    @ApiProperty({
        description: 'Detail perhitungan dan keterangan',
        example: {
            perhitungan: '4 jiwa × Rp 15.000 = Rp 60.000',
            keterangan: 'Zakat fitrah untuk 4 jiwa dengan tarif Rp 15.000 per jiwa'
        }
    })
    detail: {
        perhitungan: string;
        keterangan: string;
    };
}