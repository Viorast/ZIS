import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MidtransService } from './midtrans.service';
import { MidtransController } from './midtrans.controller';
import { PrismaService } from '../../prisma.service';
import midtransConfig from '../../config/midtrans.config';

@Module({
  imports: [
    ConfigModule.forFeature(midtransConfig)
  ],
  controllers: [MidtransController],
  providers: [MidtransService, PrismaService],
  exports: [MidtransService],
})
export class MidtransModule {}