export interface MidtransConfig {
  serverKey: string;
  clientKey: string;
  isProduction: boolean;
  merchantId: string;
}

export interface MidtransTransaction {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  customer_details: {
    first_name: string;
    last_name?: string;
    email: string;
    phone?: string;
  };
  item_details: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
    brand?: string;
    category?: string;
  }>;
  callbacks?: {
    finish?: string;
    error?: string;
    pending?: string;
  };
  custom_expiry?: {
    order_time: string;
    expiry_duration: number;
    unit: string;
  };
}

export interface MidtransResponse {
  token: string;
  redirect_url: string;
}

export interface MidtransNotification {
  transaction_time: string;
  transaction_status: string;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  payment_type: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  fraud_status: string;
  currency?: string;
  approval_code?: string;
  masked_card?: string;
  bank?: string;
  va_numbers?: string;
  biller_code?: string;
  bill_key?: string;
}