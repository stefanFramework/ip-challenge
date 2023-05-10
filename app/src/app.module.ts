import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TraceService } from './domain/services/TraceService';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressInformationSchema } from './domain/entities/AddressInformation';
import { AddressInformationRepository } from './infrastructure/repositories/AddressInformationRepository';
import { ApiClient } from './infrastructure/apiclient/ApiClient';
import { IpApiClient } from './domain/integrations/IpApiClient';
import { TraceController } from './infrastructure/http/controllers/TraceController';
import { StatisticsController } from './infrastructure/http/controllers/StatisticsController';
import { CurrencyApiClient } from './domain/integrations/CurrencyApiClient';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { HealthController } from './infrastructure/http/controllers/HealthController';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./.env'],
      load: [configuration],
    }),
    HttpModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('database.connString'),
        dbName: config.get('database.name'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'AddressInformation', schema: AddressInformationSchema },
    ]),
  ],
  controllers: [TraceController, StatisticsController, HealthController],
  providers: [
    ConfigService,
    TraceService,
    AddressInformationRepository,
    ApiClient,
    IpApiClient,
    CurrencyApiClient,
  ],
})
export class AppModule {}
