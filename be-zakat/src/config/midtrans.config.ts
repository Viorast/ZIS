// src/config/midtrans.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('midtrans', () => ({
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  merchantId: process.env.MIDTRANS_MERCHANT_ID,
}));