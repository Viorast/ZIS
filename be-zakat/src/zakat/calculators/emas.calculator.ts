import { Injectable } from '@nestjs/common';
import { ZakatType } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { IZakatCalculator, ZakatCalculationResult } from '../interfaces/zakat-calculator.interface';

@Injectable()
export class EmasCalculator implements IZakatCalculator {
  constructor(private prisma: PrismaService) {}

  async calculate(input: { 
    beratEmas: number; 
    hargaEmasPerGram: number; 
  }): Promise<ZakatCalculationResult> {
    const { beratEmas, hargaEmasPerGram } = input;
    const nisabGram = await this.getNisabGram();
    const nisab = nisabGram * hargaEmasPerGram;
    const totalNilaiEmas = beratEmas * hargaEmasPerGram;
    const percentage = this.getPercentage();
    const wajibZakat = beratEmas >= nisabGram;
    const nominal = wajibZakat ? (totalNilaiEmas * percentage) / 100 : 0;

    return {
      jenisZakat: ZakatType.EMAS,
      nominal,
      nisab,
      wajibZakat,
      detail: {
        perhitungan: wajibZakat 
          ? `${beratEmas} gram × Rp ${hargaEmasPerGram.toLocaleString('id-ID')} × ${percentage}% = Rp ${nominal.toLocaleString('id-ID')}`
          : `Berat emas ${beratEmas} gram < Nisab ${nisabGram} gram`,
        keterangan: wajibZakat 
          ? `Zakat emas wajib dibayarkan karena berat emas mencapai nisab (${nisabGram} gram)`
          : `Zakat emas tidak wajib karena berat emas belum mencapai nisab (${nisabGram} gram)`
      }
    };
  }

  async getNisab(): Promise<number> {
    const nisabGram = await this.getNisabGram();
    const hargaEmasPerGram = await this.getHargaEmasPerGram();
    return nisabGram * hargaEmasPerGram; 
  }

  private async getNisabGram(): Promise<number> {
    const config = await this.prisma.zakatConfig.findFirst({
      where: {
        jenisZakat: ZakatType.EMAS,
        key: 'NISAB_GRAM'
      }
    });

    return config?.value || 85; // Default: 85 gram
  }

  private async getHargaEmasPerGram(): Promise<number> {
    const config = await this.prisma.zakatConfig.findFirst({
      where: {
        jenisZakat: ZakatType.EMAS,
        key: 'HARGA_PER_GRAM'
      }
    });

    return config?.value || 1000000; // Default: Rp 1,000,000
  }

  getPercentage(): number {
    return 2.5;
  } 
}