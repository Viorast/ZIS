import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { ZakatModule } from './zakat/zakat.module';
import { MidtransController } from './midtrans/midtrans.controller';
import { MidtransService } from './midtrans/midtrans.service';
import { MidtransModule } from './midtrans/midtrans.module';
import { ConfigModule } from '@nestjs/config';
import midtransConfig from './config/midtrans.config';
import zakatConfig from './config/zakat.config';
import databaseConfig from './config/database.config';
import { PrismaModule } from './prisma.module';


@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
      load: [midtransConfig, zakatConfig, databaseConfig],
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,  
    UserModule, 
    ZakatModule, 
    MidtransModule
  ],
  controllers: [MidtransController],
  providers: [MidtransService],
})
export class AppModule {}
