import { IsString, IsOptional, IsNumber } from 'class-validator';

export class MidtransNotificationDto {
  @IsString()
  transaction_time: string;

  @IsString()
  transaction_status: string;

  @IsString()
  transaction_id: string;

  @IsString()
  status_message: string;

  @IsString()
  status_code: string;

  @IsString()
  signature_key: string;

  @IsString()
  payment_type: string;

  @IsString()
  order_id: string;

  @IsString()
  merchant_id: string;

  @IsString()
  gross_amount: string;

  @IsString()
  fraud_status: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  approval_code?: string;

  @IsOptional()
  @IsString()
  masked_card?: string;

  @IsOptional()
  @IsString()
  bank?: string;

  @IsOptional()
  @IsString()
  va_numbers?: string;

  @IsOptional()
  @IsString()
  biller_code?: string;

  @IsOptional()
  @IsString()
  bill_key?: string;
}