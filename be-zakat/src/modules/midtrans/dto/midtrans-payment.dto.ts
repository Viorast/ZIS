import { IsString, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class MidtransItemDetailDto {
  @IsString()
  id: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  category?: string;
}

export class MidtransCustomerDetailDto {
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class CreateMidtransPaymentDto {
  @IsString()
  transaction_id: string;

  @IsNumber()
  gross_amount: number;

  @ValidateNested()
  @Type(() => MidtransCustomerDetailDto)
  customer_details: MidtransCustomerDetailDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MidtransItemDetailDto)
  item_details: MidtransItemDetailDto[];
}