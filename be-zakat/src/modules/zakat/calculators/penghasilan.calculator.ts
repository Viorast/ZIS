import { Injectable } from '@nestjs/common';
import { ZakatType } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';
import { IZakatCalculator, ZakatCalculationResult } from '../interfaces/zakat-calculator.interface';

@Injectable()
export class PenghasilanCalculator implements IZakatCalculator {
  constructor(private prisma: PrismaService) {}

  async calculate(input: { 
    penghasilanBruto: number; 
    potonganWajib: number; 
    kebutuhanPokok: number; 
  }): Promise<ZakatCalculationResult> {
    const { penghasilanBruto, potonganWajib, kebutuhanPokok } = input;
    const nisab = await this.getNisab();
    const penghasilanBersih = penghasilanBruto - potonganWajib - kebutuhanPokok;
    const percentage = this.getPercentage();
    const wajibZakat = penghasilanBersih >= nisab;
    const nominal = wajibZakat ? (penghasilanBersih * percentage) / 100 : 0; 

    return {
      jenisZakat: ZakatType.PENGHASILAN,
      nominal,
      nisab,
      wajibZakat,
      detail: {
        perhitungan: wajibZakat 
          ? `(Rp ${penghasilanBruto.toLocaleString('id-ID')} - Rp ${potonganWajib.toLocaleString('id-ID')} - Rp ${kebutuhanPokok.toLocaleString('id-ID')}) × ${percentage}% = Rp ${nominal.toLocaleString('id-ID')}`
          : `Penghasilan bersih Rp ${penghasilanBersih.toLocaleString('id-ID')} < Nisab Rp ${nisab.toLocaleString('id-ID')}`,
        keterangan: wajibZakat 
          ? `Zakat penghasilan wajib dibayarkan karena penghasilan bersih mencapai nisab`
          : `Zakat penghasilan tidak wajib karena penghasilan bersih belum mencapai nisab`
      }
    };
  }

  async getNisab(): Promise<number> {
    const config = await this.prisma.zakatConfig.findFirst({
      where: {
        jenisZakat: ZakatType.PENGHASILAN,
        key: 'NISAB_AMOUNT'
      }
    });

    return config?.value || 85 * 1000000; // Default: 85 gram × Rp 1,000,000
  }

  getPercentage(): number {
    return 2.5;
  }
}