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

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot('mongodb://admin:admin@database:27017', {
      dbName: 'challenge',
    }),
    MongooseModule.forFeature([
      { name: 'AddressInformation', schema: AddressInformationSchema },
    ]),
  ],
  controllers: [TraceController, StatisticsController],
  providers: [
    TraceService,
    AddressInformationRepository,
    ApiClient,
    IpApiClient,
    CurrencyApiClient,
  ],
})
export class AppModule {}
