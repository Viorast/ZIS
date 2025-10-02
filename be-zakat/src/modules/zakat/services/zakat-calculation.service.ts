import { Injectable, BadRequestException } from '@nestjs/common';
import { ZakatType } from '@prisma/client';
import { 
  ZakatCalculationDto,
  ZakatFitrahCalculationDto,
  ZakatMaalCalculationDto,
  ZakatPenghasilanCalculationDto,
  ZakatEmasCalculationDto,
  ZakatFidyahCalculationDto,
  ZakatCalculationResponseDto
} from '../dto/zakat-calculation.dto';
import { FitrahCalculator } from '../calculators/fitrah.calculator';
import { MaalCalculator } from '../calculators/maal.calculator';
import { PenghasilanCalculator } from '../calculators/penghasilan.calculator';
import { EmasCalculator } from '../calculators/emas.calculator';
import { FidyahCalculator } from '../calculators/fidyah.calculator';
import { ZakatCalculationResult } from '../interfaces/zakat-calculator.interface';

@Injectable()
export class ZakatCalculationService {
  constructor(
    private fitrahCalculator: FitrahCalculator,
    private maalCalculator: MaalCalculator,
    private penghasilanCalculator: PenghasilanCalculator,
    private emasCalculator: EmasCalculator,
    private fidyahCalculator: FidyahCalculator,
  ) {}

  async calculateZakat(jenisZakat: ZakatType, input: any): Promise<ZakatCalculationResponseDto> {
    let result: ZakatCalculationResult;

    switch (jenisZakat) {
      case ZakatType.FITRAH:
        result = await this.fitrahCalculator.calculate(input);
        break;
      case ZakatType.MAAL:
        result = await this.maalCalculator.calculate(input);
        break;
      case ZakatType.PENGHASILAN:
        result = await this.penghasilanCalculator.calculate(input);
        break;
      case ZakatType.EMAS:
        result = await this.emasCalculator.calculate(input);
        break;
      case ZakatType.FIDYAH:
        result = await this.fidyahCalculator.calculate(input);
        break;
      default:
        throw new BadRequestException('Jenis zakat tidak valid');
    }

    return {
      jenisZakat: result.jenisZakat,
      nominal: result.nominal,
      nisab: result.nisab,
      wajibZakat: result.wajibZakat,
      detail: result.detail
    };
  }

  async calculateZakatFitrah(dto: ZakatFitrahCalculationDto): Promise<ZakatCalculationResponseDto> {
    return this.calculateZakat(ZakatType.FITRAH, dto);
  }

  async calculateZakatMaal(dto: ZakatMaalCalculationDto): Promise<ZakatCalculationResponseDto> {
    return this.calculateZakat(ZakatType.MAAL, dto);
  }

  async calculateZakatPenghasilan(dto: ZakatPenghasilanCalculationDto): Promise<ZakatCalculationResponseDto> {
    return this.calculateZakat(ZakatType.PENGHASILAN, dto);
  }

  async calculateZakatEmas(dto: ZakatEmasCalculationDto): Promise<ZakatCalculationResponseDto> {
    return this.calculateZakat(ZakatType.EMAS, dto);
  }

  async calculateZakatFidyah(dto: ZakatFidyahCalculationDto): Promise<ZakatCalculationResponseDto> {
    return this.calculateZakat(ZakatType.FIDYAH, dto);
  }
}