import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentMethod, TransactionStatus, ZakatType } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { MidtransService } from '../../midtrans/midtrans.service';
import { CreateZakatPaymentDto, ZakatPaymentResponseDto } from '../dto/zakat-payment.dto';
import { ZakatCalculationService } from './zakat-calculation.service';

@Injectable()
export class ZakatPaymentService {
  constructor(
    private prisma: PrismaService,
    private midtransService: MidtransService,
    private zakatCalculationService: ZakatCalculationService,
  ) {}

  async createPayment(userId: string, dto: CreateZakatPaymentDto): Promise<ZakatPaymentResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    // Validate nominal minimum
    if (dto.nominal < 1000) {
      throw new BadRequestException('Nominal minimum adalah Rp 1.000');
    }

    // Create transaction record
    const transaction = await this.prisma.zakatTransaction.create({
      data: {
        userId,
        jenisZakat: dto.jenisZakat,
        nominal: dto.nominal,
        paymentMethod: dto.paymentMethod,
        status: TransactionStatus.PENDING,
        catatan: dto.catatan,
      }
    });

    let paymentToken: string | undefined;
    let paymentUrl: string | undefined;

    // Handle payment method
    if (dto.paymentMethod === PaymentMethod.MIDTRANS) {
      const midtransResponse = await this.midtransService.createTransaction({
        transaction_id: transaction.id,
        gross_amount: dto.nominal,
        customer_details: {
          first_name: user.fullName || 'User',
          email: user.email,
          phone: user.nomorHp || undefined,
        },
        item_details: [{
          id: `zakat-${dto.jenisZakat.toLowerCase()}`,
          name: `Zakat ${this.getZakatTypeName(dto.jenisZakat)}`,
          price: dto.nominal,
          quantity: 1,
        }]
      });

      paymentToken = midtransResponse.token;
      paymentUrl = midtransResponse.redirect_url;

      // Update transaction with midtrans token
      await this.prisma.zakatTransaction.update({
        where: { id: transaction.id },
        data: { midtransId: paymentToken }
      });
    }

    return {
      id: transaction.id,
      jenisZakat: transaction.jenisZakat,
      nominal: Number(transaction.nominal),
      paymentMethod: transaction.paymentMethod,
      status: transaction.status,
      paymentToken,
      paymentUrl,
      createdAt: transaction.createdAt
    };
  }

  private getZakatTypeName(type: ZakatType): string {
    const names = {
      [ZakatType.FITRAH]: 'Fitrah',
      [ZakatType.MAAL]: 'Maal',
      [ZakatType.PENGHASILAN]: 'Penghasilan',
      [ZakatType.EMAS]: 'Emas',
      [ZakatType.FIDYAH]: 'Fidyah'
    };
    return names[type] || type;
  }
}