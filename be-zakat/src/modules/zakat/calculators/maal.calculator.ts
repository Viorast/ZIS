import { Injectable } from '@nestjs/common';
import { ZakatType } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';
import { IZakatCalculator, ZakatCalculationResult } from '../interfaces/zakat-calculator.interface';

@Injectable()
export class MaalCalculator implements IZakatCalculator {
  constructor(private prisma: PrismaService) {}

  async calculate(input: { totalHarta: number; totalHutang: number }): Promise<ZakatCalculationResult> {
    const { totalHarta, totalHutang } = input;
    const nisab = await this.getNisab();
    const hartaBersih = totalHarta - totalHutang;
    const percentage = this.getPercentage(); 
    const wajibZakat = hartaBersih >= nisab;
    const nominal = wajibZakat ? (hartaBersih * percentage) / 100 : 0;

    return {
      jenisZakat: ZakatType.MAAL,
      nominal,
      nisab,
      wajibZakat,
      detail: {
        perhitungan: wajibZakat 
          ? `(Rp ${totalHarta.toLocaleString('id-ID')} - Rp ${totalHutang.toLocaleString('id-ID')}) × ${percentage}% = Rp ${nominal.toLocaleString('id-ID')}`
          : `Harta bersih Rp ${hartaBersih.toLocaleString('id-ID')} < Nisab Rp ${nisab.toLocaleString('id-ID')}`,
        keterangan: wajibZakat 
          ? `Zakat maal wajib dibayarkan karena harta bersih mencapai nisab`
          : `Zakat maal tidak wajib karena harta bersih belum mencapai nisab`
      }
    };
  }

  async getNisab(): Promise<number> {
    const config = await this.prisma.zakatConfig.findFirst({
      where: {
        jenisZakat: ZakatType.MAAL,
        key: 'NISAB_AMOUNT'
      }
    });

    return config?.value || 85 * 1000000; // Default: 85 gram × Rp 1,000,000
  }

  getPercentage(): number {
    return 2.5;
  }
}