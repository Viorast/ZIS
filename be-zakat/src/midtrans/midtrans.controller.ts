import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { MidtransService } from './midtrans.service';
import { MidtransNotificationDto } from './dto/midtrans-notification.dto';

@Controller('midtrans')
export class MidtransController {
  private readonly logger = new Logger(MidtransController.name);

  constructor(private readonly midtransService: MidtransService) {}

  @Post('notification')
  @HttpCode(HttpStatus.OK)
  async handleNotification(@Body() notification: MidtransNotificationDto): Promise<{ message: string }> {
    this.logger.log(`Received Midtrans notification: ${JSON.stringify(notification)}`);
    
    try {
      await this.midtransService.handleNotification(notification);
      return { message: 'Notification processed successfully' };
    } catch (error) {
      this.logger.error(`Failed to process notification: ${error.message}`);
      throw error;
    }
  }
}

