import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as midtransClient from 'midtrans-client';
import { 
  MidtransTransaction, 
  MidtransResponse, 
  MidtransNotification,
  MidtransConfig 
} from './interfaces/midtrans.interface';
import {  CreateMidtransPaymentDto } from './dto/midtrans-payment.dto';
import { MidtransNotificationDto } from './dto/midtrans-notification.dto';
import { PrismaService } from '../prisma.service';
import { TransactionStatus } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class MidtransService {
  private readonly logger = new Logger(MidtransService.name);
  private snap: any;
  private coreApi: any;
  private config: MidtransConfig;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.config = {
      serverKey: this.configService.getOrThrow<string>('MIDTRANS_SERVER_KEY'),
      clientKey: this.configService.getOrThrow<string>('MIDTRANS_CLIENT_KEY'),
      isProduction: this.configService.get<boolean>('MIDTRANS_IS_PRODUCTION', false),
      merchantId: this.configService.getOrThrow<string>('MIDTRANS_MERCHANT_ID'),
    };

    // Initialize Midtrans Snap
    this.snap = new midtransClient.Snap({
      isProduction: this.config.isProduction,
      serverKey: this.config.serverKey,
      clientKey: this.config.clientKey,
    });

    // Initialize Midtrans Core API
    this.coreApi = new midtransClient.CoreApi({
      isProduction: this.config.isProduction,
      serverKey: this.config.serverKey,
      clientKey: this.config.clientKey,
    });
  }

  async createTransaction(dto: CreateMidtransPaymentDto): Promise<MidtransResponse> {
    try {
      const parameter: MidtransTransaction = {
        transaction_details: {
          order_id: dto.transaction_id,
          gross_amount: dto.gross_amount,
        },
        customer_details: dto.customer_details,
        item_details: dto.item_details,
        callbacks: {
          finish: `${process.env.FRONTEND_URL}/payment/success`,
          error: `${process.env.FRONTEND_URL}/payment/error`,
          pending: `${process.env.FRONTEND_URL}/payment/pending`,
        },
        custom_expiry: {
          order_time: new Date().toISOString(),
          expiry_duration: 24,
          unit: 'hour',
        },
      };

      const transaction = await this.snap.createTransaction(parameter);
      
      this.logger.log(`Transaction created: ${dto.transaction_id}`);
      
      return {
        token: transaction.token,
        redirect_url: transaction.redirect_url,
      };
    } catch (error) {
      this.logger.error(`Failed to create transaction: ${error.message}`);
      throw new BadRequestException('Gagal membuat transaksi pembayaran');
    }
  }

  async handleNotification(notification: MidtransNotificationDto): Promise<void> {
    try {
      // Verify signature
      const isValidSignature = this.verifySignature(notification);
      if (!isValidSignature) {
        throw new BadRequestException('Invalid signature');
      }

      const orderId = notification.order_id;
      const transactionStatus = notification.transaction_status;
      const fraudStatus = notification.fraud_status;

      this.logger.log(`Received notification for order: ${orderId}, status: ${transactionStatus}`);

      // Map Midtrans status to our status
      let status: TransactionStatus;
      
      if (transactionStatus === 'capture') {
        status = fraudStatus === 'challenge' ? TransactionStatus.PENDING : TransactionStatus.SUCCESS;
      } else if (transactionStatus === 'settlement') {
        status = TransactionStatus.SUCCESS;
      } else if (transactionStatus === 'pending') {
        status = TransactionStatus.PENDING;
      } else if (transactionStatus === 'deny' || transactionStatus === 'cancel') {
        status = TransactionStatus.CANCELLED;
      } else if (transactionStatus === 'expire') {
        status = TransactionStatus.EXPIRED;
      } else {
        status = TransactionStatus.FAILED;
      }

      // Update transaction status
      await this.updateTransactionStatus(orderId, status, notification);

    } catch (error) {
      this.logger.error(`Failed to handle notification: ${error.message}`);
      throw error;
    }
  }

  private verifySignature(notification: MidtransNotificationDto): boolean {
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
    } = notification;

    const serverKey = this.config.serverKey;
    const input = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const hash = crypto.createHash('sha512').update(input).digest('hex');

    return hash === signature_key;
  }

  private async updateTransactionStatus(
    orderId: string,
    status: TransactionStatus,
    notification: MidtransNotificationDto,
  ): Promise<void> {
    try {
      const updateData: any = {
        status,
        midtransId: notification.transaction_id,
      };

      if (status === TransactionStatus.SUCCESS) {
        updateData.tanggalPembayaran = new Date();
      }

      // Update zakat transaction
      const zakatTransaction = await this.prisma.zakatTransaction.findUnique({
        where: { id: orderId },
      });

      if (zakatTransaction) {
        await this.prisma.zakatTransaction.update({
          where: { id: orderId },
          data: updateData,
        });
        
        this.logger.log(`Zakat transaction ${orderId} updated to ${status}`);
        return;
      }

      // Update infaq transaction
      const infaqTransaction = await this.prisma.infaqTransaction.findUnique({
        where: { id: orderId },
      });

      if (infaqTransaction) {
        await this.prisma.infaqTransaction.update({
          where: { id: orderId },
          data: updateData,
        });
        
        this.logger.log(`Infaq transaction ${orderId} updated to ${status}`);
        return;
      }

      this.logger.warn(`Transaction ${orderId} not found`);
    } catch (error) {
      this.logger.error(`Failed to update transaction ${orderId}: ${error.message}`);
      throw error;
    }
  }

  async getTransactionStatus(orderId: string): Promise<any> {
    try {
      const response = await this.coreApi.transaction.status(orderId);
      return response;
    } catch (error) {
      this.logger.error(`Failed to get transaction status: ${error.message}`);
      throw new BadRequestException('Gagal mendapatkan status transaksi');
    }
  }

  async cancelTransaction(orderId: string): Promise<any> {
    try {
      const response = await this.coreApi.transaction.cancel(orderId);
      return response;
    } catch (error) {
      this.logger.error(`Failed to cancel transaction: ${error.message}`);
      throw new BadRequestException('Gagal membatalkan transaksi');
    }
  }

  async refundTransaction(orderId: string, amount?: number): Promise<any> {
    try {
      const parameter: any = {
        order_id: orderId,
      };

      if (amount) {
        parameter.amount = amount;
      }

      const response = await this.coreApi.transaction.refund(parameter);
      return response;
    } catch (error) {
      this.logger.error(`Failed to refund transaction: ${error.message}`);
      throw new BadRequestException('Gagal melakukan refund');
    }
  }
}