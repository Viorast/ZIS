// src/zakat/interfaces/zakat-config.interface.ts
export interface ZakatConfigValue {
  jenisZakat: string;
  key: string;
  value: number;
  satuan?: string;
}

export interface ZakatNisabConfig {
  NISAB_EMAS_GRAM: number;
  HARGA_EMAS_PER_GRAM: number;
  NISAB_PERAK_GRAM: number;
  HARGA_PERAK_PER_GRAM: number;
  ZAKAT_FITRAH_AMOUNT: number;
//   PENGHASILAN_NISAB_MULTIPLIER: number;
  FIDYAH_PER_HARI: number;
}