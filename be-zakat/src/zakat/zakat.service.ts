import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ZakatType, TransactionStatus } from '@prisma/client';

@Injectable()
export class ZakatService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get zakat configuration from database
   * This method retrieves all zakat configurations grouped by type
   */
  async getZakatConfig(): Promise<{
    [key in ZakatType]: { [key: string]: { value: number; satuan?: string } }
  }> {
    const configs = await this.prisma.zakatConfig.findMany();
    
    const groupedConfigs = configs.reduce((acc, config) => {
      if (!acc[config.jenisZakat]) {
        acc[config.jenisZakat] = {};
      }
      acc[config.jenisZakat][config.key] = {
        value: config.value,
        satuan: config.satuan ?? undefined
      };
      return acc;
    }, {} as any);

    return groupedConfigs;
  }

  /**
   * Get specific zakat configuration by type and key
   */
  async getZakatConfigByTypeAndKey(
    jenisZakat: ZakatType, 
    key: string
  ): Promise<{ value: number; satuan?: string } | null> {
    const config = await this.prisma.zakatConfig.findUnique({
      where: {
        jenisZakat_key: {
          jenisZakat,
          key
        }
      }
    });

    if (!config) {
      return null;
    }

    return {
      value: config.value,
      satuan: config.satuan ?? undefined
    };
  }

  /**
   * Update zakat configuration
   */
  async updateZakatConfig(
    jenisZakat: ZakatType,
    key: string,
    value: number,
    satuan?: string
  ): Promise<void> {
    await this.prisma.zakatConfig.upsert({
      where: {
        jenisZakat_key: {
          jenisZakat,
          key
        }
      },
      update: {
        value,
        satuan,
        updatedAt: new Date()
      },
      create: {
        jenisZakat,
        key,
        value,
        satuan
      }
    });
  }

  /**
   * Get all zakat transactions summary
   */
  async getZakatTransactionsSummary(): Promise<{
    totalTransactions: number;
    totalAmount: number;
    byType: { [key in ZakatType]: { count: number; amount: number } };
    byStatus: { [key: string]: { count: number; amount: number } };
  }> {
    const transactions = await this.prisma.zakatTransaction.findMany({
      select: {
        jenisZakat: true,
        nominal: true,
        status: true
      }
    });

    const summary = {
      totalTransactions: transactions.length,
      totalAmount: 0,
      byType: {} as any,
      byStatus: {} as any
    };

    // Initialize counters
    Object.values(ZakatType).forEach(type => {
      summary.byType[type] = { count: 0, amount: 0 };
    });

    Object.values(TransactionStatus).forEach(status => {
      summary.byStatus[status] = { count: 0, amount: 0 };
    });

    // Calculate summary
    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.nominal.toString()); 
      
      summary.totalAmount += amount;
      summary.byType[transaction.jenisZakat].count++;
      summary.byType[transaction.jenisZakat].amount += amount;
      summary.byStatus[transaction.status].count++;
      summary.byStatus[transaction.status].amount += amount; 
    });

    return summary;
  }

  /**
   * Get zakat transactions by date range
   */
  async getZakatTransactionsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<{
    transactions: any[];
    summary: {
      totalCount: number;
      totalAmount: number;
      byType: { [key in ZakatType]: { count: number; amount: number } };
    };
  }> {
    const transactions = await this.prisma.zakatTransaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const summary = {
      totalCount: transactions.length,
      totalAmount: 0,
      byType: {} as any
    };

    // Initialize type counters
    Object.values(ZakatType).forEach(type => {
      summary.byType[type] = { count: 0, amount: 0 };
    });

    // Calculate summary
    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.nominal.toString());
      summary.totalAmount += amount;
      summary.byType[transaction.jenisZakat].count++;
      summary.byType[transaction.jenisZakat].amount += amount;
    });

    return {
      transactions,
      summary
    };
  }

  /**
   * Get nisab values for different zakat types
   */
  async getNisabValues(): Promise<{
    [key in ZakatType]: { nisab: number; satuan?: string };
  }> {
    const nisabConfigs = await this.prisma.zakatConfig.findMany({
      where: {
        key: 'nisab'
      }
    });

    const nisabValues = {} as any;

    nisabConfigs.forEach(config => {
      nisabValues[config.jenisZakat] = {
        nisab: config.value,
        satuan: config.satuan
      };
    });

    return nisabValues;
  }

  /**
   * Initialize default zakat configurations
   * This method can be called during application startup
   */
  async initializeDefaultConfigs(): Promise<void> {
    const defaultConfigs = [
      // Zakat Fitrah
      { jenisZakat: ZakatType.FITRAH, key: 'nisab', value: 0, satuan: 'kg' },
      { jenisZakat: ZakatType.FITRAH, key: 'tarif', value: 2.5, satuan: 'kg' },
      { jenisZakat: ZakatType.FITRAH, key: 'harga_beras', value: 15000, satuan: 'rupiah/kg' },
      
      // Zakat Maal
      { jenisZakat: ZakatType.MAAL, key: 'nisab', value: 85000000, satuan: 'rupiah' },
      { jenisZakat: ZakatType.MAAL, key: 'tarif', value: 2.5, satuan: 'persen' },
      
      // Zakat Penghasilan
      { jenisZakat: ZakatType.PENGHASILAN, key: 'nisab', value: 85000000, satuan: 'rupiah' },
      { jenisZakat: ZakatType.PENGHASILAN, key: 'tarif', value: 2.5, satuan: 'persen' },
      
      // Zakat Emas
      { jenisZakat: ZakatType.EMAS, key: 'nisab', value: 85, satuan: 'gram' },
      { jenisZakat: ZakatType.EMAS, key: 'tarif', value: 2.5, satuan: 'persen' },
      
      // Fidyah
      { jenisZakat: ZakatType.FIDYAH, key: 'tarif', value: 15000, satuan: 'rupiah/hari' },
    ];

    for (const config of defaultConfigs) {
      await this.prisma.zakatConfig.upsert({
        where: {
          jenisZakat_key: {
            jenisZakat: config.jenisZakat,
            key: config.key
          }
        },
        update: {},
        create: config
      });
    }
  }

  /**
   * Check if amount meets nisab requirement
   */
  async checkNisab(jenisZakat: ZakatType, amount: number): Promise<{
    meetsNisab: boolean;
    nisabValue: number;
    difference: number;
  }> {
    const nisabConfig = await this.getZakatConfigByTypeAndKey(jenisZakat, 'nisab');
    
    if (!nisabConfig) {
      throw new Error(`Nisab configuration not found for ${jenisZakat}`);
    }

    const nisabValue = nisabConfig.value;
    const meetsNisab = amount >= nisabValue;
    const difference = amount - nisabValue;

    return {
      meetsNisab,
      nisabValue,
      difference
    };
  }

  /**
   * Get zakat rate for specific type
   */
  async getZakatRate(jenisZakat: ZakatType): Promise<number> {
    const rateConfig = await this.getZakatConfigByTypeAndKey(jenisZakat, 'tarif');
    
    if (!rateConfig) {
      throw new Error(`Rate configuration not found for ${jenisZakat}`);
    }

    return rateConfig.value;
  }

  /**
   * Validate zakat calculation parameters
   */
  async validateZakatCalculation(
    jenisZakat: ZakatType,
    amount: number
  ): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    // Check nisab
    try {
      const nisabCheck = await this.checkNisab(jenisZakat, amount);
      if (!nisabCheck.meetsNisab) {
        warnings.push(`Amount does not meet nisab requirement (${nisabCheck.nisabValue})`);
      }
    } catch (error) {
      errors.push(`Cannot validate nisab: ${error.message}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}