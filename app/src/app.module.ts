import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TraceService } from './domain/services/TraceService';
import { IpApiClientInterface } from './domain/integrations/IpApiClientInterface';
import { AddressInformationSchema } from './domain/entities/AddressInformation';
import { CurrencyApiClientInterface } from './domain/integrations/CurrencyApiClientInterface';
import { AddressInformationRepositoryInterface } from './domain/repositories/AddressInformationRepositoryInterface';

import configuration from './infrastructure/config/configuration';
import { ApiClient } from './infrastructure/integrations/ApiClient';
import { IpApiClient } from './infrastructure/integrations/IpApiClient';
import { TraceController } from './infrastructure/http/controllers/TraceController';
import { CurrencyApiClient } from './infrastructure/integrations/CurrencyApiClient';
import { HealthController } from './infrastructure/http/controllers/HealthController';
import { StatisticsController } from './infrastructure/http/controllers/StatisticsController';
import { AddressInformationRepository } from './infrastructure/repositories/AddressInformationRepository';
import { TraceStatisticsService } from './domain/services/TraceStatisticsService';

const TraceServiceFactory = {
  provide: TraceService,
  useFactory: (
    ipApiClient: IpApiClientInterface,
    currencyApiClient: CurrencyApiClientInterface,
    addressInformationRepository: AddressInformationRepositoryInterface,
  ) =>
    new TraceService(
      ipApiClient,
      currencyApiClient,
      addressInformationRepository,
    ),
  inject: [IpApiClient, CurrencyApiClient, AddressInformationRepository],
};

const TraceStatisticsServiceFactory = {
  provide: TraceStatisticsService,
  useFactory: (
    addressInformationRepository: AddressInformationRepositoryInterface,
  ) => new TraceStatisticsService(addressInformationRepository),
  inject: [AddressInformationRepository],
};

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
    TraceServiceFactory,
    TraceStatisticsServiceFactory,
    AddressInformationRepository,
    ApiClient,
    IpApiClient,
    CurrencyApiClient,
  ],
})
export class AppModule {}
