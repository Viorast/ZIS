import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  HttpCode,
  HttpStatus  
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiParam, 
  ApiQuery,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse
} from '@nestjs/swagger';
import { ZakatService } from './zakat.service';
import { ZakatCalculationService } from './services/zakat-calculation.service';
import { ZakatPaymentService } from './services/zakat-payment.service';
import { ZakatTransactionService } from './services/zakat-transaction.service';
import { UnifiedJwtGuard as UserJwtGuard } from 'src/guards/unified-jwt.guard';
import { User } from '../../common/decorators/user.decorator';
import { 
  ZakatFitrahCalculationDto,
  ZakatMaalCalculationDto,
  ZakatPenghasilanCalculationDto,
  ZakatEmasCalculationDto,
  ZakatFidyahCalculationDto,
  ZakatCalculationResponseDto
} from './dto/zakat-calculation.dto';
import { CreateZakatPaymentDto, ZakatPaymentResponseDto } from './dto/zakat-payment.dto';
import { ZakatTransactionQueryDto } from './dto/zakat-transaction.dto';
import { ApiResponse as ApiResponseInterface } from '../../common/interfaces/response.interface';
import { ResponseUtil } from '../../common/utils/response.util';

@ApiTags('Zakat')
@Controller('zakat')
@UseGuards(UserJwtGuard)
@ApiBearerAuth()
export class ZakatController {
  constructor(
    private readonly zakatService: ZakatService,
    private readonly zakatCalculationService: ZakatCalculationService,
    private readonly zakatPaymentService: ZakatPaymentService,
    private readonly zakatTransactionService: ZakatTransactionService,
  ) {}

  // Calculator endpoints
  @Post('calculate/fitrah')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Kalkulasi Zakat Fitrah',
    description: 'Menghitung jumlah zakat fitrah berdasarkan jumlah jiwa yang akan dibayarkan' 
  })
  @ApiBody({ 
    type: ZakatFitrahCalculationDto,
    description: 'Data untuk kalkulasi zakat fitrah' 
  })
  @ApiOkResponse({ 
    description: 'Kalkulasi zakat fitrah berhasil',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponseDto' },
        {
          properties: {
            data: { $ref: '#/components/schemas/ZakatCalculationResponseDto' }
          }
        }
      ]
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Data input tidak valid' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Token tidak valid' 
  })
  async calculateFitrah(@Body() dto: ZakatFitrahCalculationDto): Promise<ApiResponseInterface> {
    const result = await this.zakatCalculationService.calculateZakatFitrah(dto);
    return ResponseUtil.success('Kalkulasi zakat fitrah berhasil', result);
  }

  @Post('calculate/maal')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Kalkulasi Zakat Maal',
    description: 'Menghitung jumlah zakat maal berdasarkan total harta dan hutang' 
  })
  @ApiBody({ 
    type: ZakatMaalCalculationDto,
    description: 'Data untuk kalkulasi zakat maal'
  })
  @ApiOkResponse({ 
    description: 'Kalkulasi zakat maal berhasil',
    type: ZakatCalculationResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Data input tidak valid' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Token tidak valid' 
  })
  async calculateMaal(@Body() dto: ZakatMaalCalculationDto): Promise<ApiResponseInterface> {
    const result = await this.zakatCalculationService.calculateZakatMaal(dto);
    return ResponseUtil.success('Kalkulasi zakat maal berhasil', result);
  }

  @Post('calculate/penghasilan')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Kalkulasi Zakat Penghasilan',
    description: 'Menghitung jumlah zakat penghasilan berdasarkan penghasilan bruto dan potongan' 
  })
  @ApiBody({ 
    type: ZakatPenghasilanCalculationDto,
    description: 'Data untuk kalkulasi zakat penghasilan'
  })
  @ApiOkResponse({ 
    description: 'Kalkulasi zakat penghasilan berhasil',
    type: ZakatCalculationResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Data input tidak valid' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Token tidak valid' 
  })
  async calculatePenghasilan(@Body() dto: ZakatPenghasilanCalculationDto): Promise<ApiResponseInterface> {
    const result = await this.zakatCalculationService.calculateZakatPenghasilan(dto);
    return ResponseUtil.success('Kalkulasi zakat penghasilan berhasil', result);
  }

  @Post('calculate/emas')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Kalkulasi Zakat Emas',
    description: 'Menghitung jumlah zakat emas berdasarkan berat emas dan harga per gram' 
  })
  @ApiBody({ 
    type: ZakatEmasCalculationDto,
    description: 'Data untuk kalkulasi zakat emas'
  })
  @ApiOkResponse({ 
    description: 'Kalkulasi zakat emas berhasil',
    type: ZakatCalculationResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Data input tidak valid' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Token tidak valid' 
  })
  async calculateEmas(@Body() dto: ZakatEmasCalculationDto): Promise<ApiResponseInterface> {
    const result = await this.zakatCalculationService.calculateZakatEmas(dto);
    return ResponseUtil.success('Kalkulasi zakat emas berhasil', result);
  }

  @Post('calculate/fidyah')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Kalkulasi Fidyah',
    description: 'Menghitung jumlah fidyah berdasarkan jumlah hari yang tidak berpuasa' 
  })
  @ApiBody({ 
    type: ZakatFidyahCalculationDto,
    description: 'Data untuk kalkulasi fidyah'
  })
  @ApiOkResponse({ 
    description: 'Kalkulasi fidyah berhasil',
    type: ZakatCalculationResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Data input tidak valid' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Token tidak valid' 
  })
  async calculateFidyah(@Body() dto: ZakatFidyahCalculationDto): Promise<ApiResponseInterface> {
    const result = await this.zakatCalculationService.calculateZakatFidyah(dto);
    return ResponseUtil.success('Kalkulasi fidyah berhasil', result);
  }

  // Payment endpoints
  @Post('payment')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Buat Pembayaran Zakat',
    description: 'Membuat pembayaran zakat baru dengan berbagai metode pembayaran' 
  })
  @ApiBody({ 
    type: CreateZakatPaymentDto,
    description: 'Data pembayaran zakat'
  })
  @ApiCreatedResponse({ 
    description: 'Pembayaran berhasil dibuat',
    type: ZakatPaymentResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Data input tidak valid' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Token tidak valid' 
  })
  async createPayment(
    @User('id') userId: string,
    @Body() dto: CreateZakatPaymentDto
  ): Promise<ApiResponseInterface> {
    const result = await this.zakatPaymentService.createPayment(userId, dto);
    return ResponseUtil.success('Pembayaran berhasil dibuat', result);
  }

  // Transaction endpoints
  @Get('transactions')
  @ApiOperation({ 
    summary: 'Ambil Daftar Transaksi Zakat',
    description: 'Mengambil daftar transaksi zakat pengguna dengan filtering dan pagination' 
  })
  @ApiQuery({ 
    name: 'status', 
    required: false, 
    description: 'Filter berdasarkan status transaksi',
    enum: ['PENDING', 'SUCCESS', 'EXPIRED', 'CANCELLED', 'FAILED']
  })
  @ApiQuery({ 
    name: 'startDate', 
    required: false, 
    description: 'Tanggal mulai filter (YYYY-MM-DD)',
    type: String
  })
  @ApiQuery({ 
    name: 'endDate', 
    required: false, 
    description: 'Tanggal akhir filter (YYYY-MM-DD)',
    type: String
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Nomor halaman',
    type: String
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Jumlah data per halaman',
    type: String
  })
  @ApiOkResponse({ 
    description: 'Daftar transaksi berhasil diambil'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Token tidak valid' 
  })
  async getTransactions(
    @User('id') userId: string,
    @Query() query: ZakatTransactionQueryDto
  ) {
    const result = await this.zakatTransactionService.getUserTransactions(userId, query);
    return result;
  }

  @Get('transactions/:id')
  @ApiOperation({ 
    summary: 'Ambil Detail Transaksi Zakat',
    description: 'Mengambil detail transaksi zakat berdasarkan ID' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID transaksi zakat',
    type: String
  })
  @ApiOkResponse({ 
    description: 'Detail transaksi berhasil diambil'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Token tidak valid' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Not Found - Transaksi tidak ditemukan' 
  })
  async getTransactionById(
    @User('id') userId: string,
    @Param('id') id: string
  ): Promise<ApiResponseInterface> {
    const result = await this.zakatTransactionService.getTransactionById(id, userId);
    return ResponseUtil.success('Transaksi berhasil diambil', result);
  }

  @Get('statistics')
  @ApiOperation({ 
    summary: 'Ambil Statistik Zakat',
    description: 'Mengambil statistik transaksi zakat pengguna' 
  })
  @ApiOkResponse({ 
    description: 'Statistik berhasil diambil'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Token tidak valid' 
  })
  async getStatistics(@User('id') userId: string): Promise<ApiResponseInterface> {
    const result = await this.zakatTransactionService.getTransactionStatistics(userId);
    return ResponseUtil.success('Statistik berhasil diambil', result);
  }

//   // Config endpoints
//   @Get('config')
//   @ApiOperation({ 
//     summary: 'Ambil Konfigurasi Zakat',
//     description: 'Mengambil konfigurasi zakat seperti nisab dan tarif' 
//   })
//   @ApiOkResponse({ 
//     description: 'Konfigurasi zakat berhasil diambil'
//   })
//   @ApiResponse({ 
//     status: 401, 
//     description: 'Unauthorized - Token tidak valid' 
//   })
//   async getZakatConfig(): Promise<ApiResponseInterface> {
//     const result = await this.zakatService.getZakatConfig();
//     return ResponseUtil.success('Konfigurasi zakat berhasil diambil', result);
//   }
}