import { Injectable } from '@nestjs/common';
import { ZakatType } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { IZakatCalculator, ZakatCalculationResult } from '../interfaces/zakat-calculator.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FidyahCalculator implements IZakatCalculator {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {} 

  async calculate(input: { jumlahHari: number }): Promise<ZakatCalculationResult> {
    const { jumlahHari } = input;
    const nisab = await this.getNisab();
    const nominal = nisab * jumlahHari;

    return {
      jenisZakat: ZakatType.FIDYAH,
      nominal,
      nisab,
      wajibZakat: true, // Fidyah wajib untuk yang tidak bisa berpuasa
      detail: {
        perhitungan: `${jumlahHari} hari × Rp ${nisab.toLocaleString('id-ID')} = Rp ${nominal.toLocaleString('id-ID')}`,
        keterangan: `Fidyah wajib dibayarkan untuk setiap hari yang tidak bisa berpuasa karena alasan syar'i`
      }
    };
  }

  async getNisab(): Promise<number> {
    const config = await this.prisma.zakatConfig.findFirst({
      where: {
        jenisZakat: ZakatType.FIDYAH,
        key: 'AMOUNT_PER_HARI'
      }
    });

    if (config?.value) return config.value;

    // Ambil dari config service jika tidak ada di DB
    return this.configService.get<number>('zakat.fidyahPerHari', 35000);
  }

  getPercentage(): number {
    return 100; // 100% dari nisab per hari
  }
}