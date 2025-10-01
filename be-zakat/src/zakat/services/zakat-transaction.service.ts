import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionStatus } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { UpdateZakatTransactionDto, ZakatTransactionQueryDto } from '../dto/zakat-transaction.dto';
import { PaginatedResponse } from '../../common/interfaces/response.interface';

@Injectable()
export class ZakatTransactionService {
  constructor(private prisma: PrismaService) {}

  async getUserTransactions(
    userId: string,
    query: ZakatTransactionQueryDto
  ): Promise<PaginatedResponse<any>> {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (query.status) {
      where.status = query.status;
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) {
        where.createdAt.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.createdAt.lte = new Date(query.endDate);
      }
    }

    const [transactions, total] = await Promise.all([
      this.prisma.zakatTransaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          }
        }
      }),
      this.prisma.zakatTransaction.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message: 'Transaksi berhasil diambil',
      data: transactions,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      timestamp: new Date().toISOString()
    };
  }

  async getTransactionById(id: string, userId?: string): Promise<any> {
    const where: any = { id };
    if (userId) {
      where.userId = userId;
    }

    const transaction = await this.prisma.zakatTransaction.findFirst({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
      }
    });

    if (!transaction) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    return transaction;
  }

  async updateTransaction(id: string, dto: UpdateZakatTransactionDto): Promise<any> {
    const transaction = await this.prisma.zakatTransaction.findUnique({
      where: { id }
    });

    if (!transaction) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    const updateData: any = {};

    if (dto.status) {
      updateData.status = dto.status;
    }

    if (dto.buktiPembayaran) {
      updateData.buktiPembayaran = dto.buktiPembayaran;
    }

    if (dto.midtransId) {
      updateData.midtransId = dto.midtransId;
    }

    if (dto.tanggalPembayaran) {
      updateData.tanggalPembayaran = new Date(dto.tanggalPembayaran);
    }

    if (dto.status === TransactionStatus.SUCCESS && !updateData.tanggalPembayaran) {
      updateData.tanggalPembayaran = new Date();
    }

    const updatedTransaction = await this.prisma.zakatTransaction.update({
      where: { id },
      data: updateData
    });

    return updatedTransaction;
  }

  async getTransactionStatistics(userId?: string): Promise<any> {
    const where: any = userId ? { userId } : {};

    const [total, success, pending, failed] = await Promise.all([
      this.prisma.zakatTransaction.count({ where }),
      this.prisma.zakatTransaction.count({ 
        where: { ...where, status: TransactionStatus.SUCCESS } 
      }),
      this.prisma.zakatTransaction.count({ 
        where: { ...where, status: TransactionStatus.PENDING } 
      }),
      this.prisma.zakatTransaction.count({ 
        where: { ...where, status: TransactionStatus.FAILED } 
      })
    ]);

    const totalAmount = await this.prisma.zakatTransaction.aggregate({
      where: { ...where, status: TransactionStatus.SUCCESS },
      _sum: { nominal: true }
    });

    return {
      total,
      success,
      pending,
      failed,
      totalAmount: Number(totalAmount._sum.nominal || 0)
    };
  }
}