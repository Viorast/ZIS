import { Module } from '@nestjs/common';
import { ZakatController } from './zakat.controller';
import { ZakatService } from './zakat.service';
import { ZakatCalculationService } from './services/zakat-calculation.service';
import { ZakatPaymentService } from './services/zakat-payment.service';
import { ZakatTransactionService } from './services/zakat-transaction.service';

// Import calculator classes
import { FitrahCalculator } from './calculators/fitrah.calculator';
import { MaalCalculator } from './calculators/maal.calculator';
import { PenghasilanCalculator } from './calculators/penghasilan.calculator';
import { EmasCalculator } from './calculators/emas.calculator';
import { FidyahCalculator } from './calculators/fidyah.calculator';

// Import other required modules
import { PrismaService } from '../../prisma.service';
import { MidtransModule } from '../midtrans/midtrans.module';

@Module({
  imports: [
    MidtransModule, // Import MidtransModule to make MidtransService available
  ],
  controllers: [ZakatController],
  providers: [
    PrismaService,
    ZakatService,
    ZakatCalculationService,
    ZakatPaymentService,
    ZakatTransactionService,
    // Calculator providers
    FitrahCalculator,
    MaalCalculator,
    PenghasilanCalculator,
    EmasCalculator,
    FidyahCalculator,
  ],
  exports: [
    ZakatService,
    ZakatCalculationService,
    ZakatPaymentService,
    ZakatTransactionService,
  ],
})
export class ZakatModule {}