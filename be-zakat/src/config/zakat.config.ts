import { registerAs } from '@nestjs/config';

export default registerAs('zakat', () => ({
  nisabEmasGram: parseInt(process.env.NISAB_EMAS_GRAM || '85'),
  hargaEmasPerGram: parseInt(process.env.HARGA_EMAS_PER_GRAM || '1000000'),
  nisabPerakGram: parseInt(process.env.NISAB_PERAK_GRAM || '595'),
  hargaPerakPerGram: parseInt(process.env.HARGA_PERAK_PER_GRAM || '15000'),
  zakatFitrahAmount: parseInt(process.env.ZAKAT_FITRAH_AMOUNT || '35000'),
  penghasilanNisabMultiplier: parseFloat(process.env.PENGHASILAN_NISAB_MULTIPLIER || '1.0'),
  fidyahPerHari: parseInt(process.env.FIDYAH_PER_HARI || '35000'),
}));