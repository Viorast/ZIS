import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { ZakatModule } from './modules/zakat/zakat.module';
import { MidtransController } from './modules/midtrans/midtrans.controller';
import { MidtransService } from './modules/midtrans/midtrans.service';
import { MidtransModule } from './modules/midtrans/midtrans.module';
import { ScriptsModule } from './scripts/scripts.module';
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
    MidtransModule,
    ScriptsModule
  ],
  controllers: [MidtransController],
  providers: [MidtransService],
})
export class AppModule {}
