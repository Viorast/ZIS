import { Injectable } from '@nestjs/common';
import { ZakatType } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';
import { IZakatCalculator, ZakatCalculationResult } from '../interfaces/zakat-calculator.interface';

@Injectable()
export class FitrahCalculator implements IZakatCalculator {
  constructor(private prisma: PrismaService) {}

  async calculate(input: { jumlahJiwa: number }): Promise<ZakatCalculationResult> {
    const { jumlahJiwa } = input;
    const nisab = await this.getNisab();
    const nominal = nisab * jumlahJiwa; 

    return {
      jenisZakat: ZakatType.FITRAH,
      nominal,
      nisab,
      wajibZakat: true, // Zakat fitrah wajib untuk setiap Muslim
      detail: {
        perhitungan: `${jumlahJiwa} jiwa × Rp ${nisab.toLocaleString('id-ID')} = Rp ${nominal.toLocaleString('id-ID')}`,
        keterangan: `Zakat fitrah wajib dibayarkan untuk setiap jiwa Muslim sebelum sholat Idul Fitri`
      }
    };
  }

  async getNisab(): Promise<number> {
    const config = await this.prisma.zakatConfig.findFirst({
      where: {
        jenisZakat: ZakatType.FITRAH,
        key: 'AMOUNT_PER_JIWA'
      }
    });

    return config?.value || 35000; // Default value
  }

  getPercentage(): number {
    return 100; // 100% dari nisab per jiwa
  }
}