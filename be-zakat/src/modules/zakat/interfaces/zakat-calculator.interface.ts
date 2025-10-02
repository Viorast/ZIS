import { ZakatType } from '@prisma/client';

export interface ZakatCalculationResult {
  jenisZakat: ZakatType;
  nominal: number;
  nisab: number;
  wajibZakat: boolean;
  detail: {
    perhitungan: string;
    keterangan: string;
  };
}

export interface ZakatCalculatorInput {
  [key: string]: any;
}

export interface IZakatCalculator {
  calculate(input: ZakatCalculatorInput): Promise<ZakatCalculationResult>;
  getNisab(): Promise<number>;
  getPercentage(): number;
}