import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StatisticsController } from './http/controllers/StatisticsController';
import { TraceController } from './http/controllers/TraceController';
import { TraceService } from './domain/services/TraceService';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressInformationSchema } from './domain/entities/AddressInformation';
import { AddressInformationRepository } from './infrastructure/repositories/AddressInformationRepository';
import { ApiClient } from './infrastructure/apiclient/ApiClient';
import { IpApiClient } from './domain/integrations/IpApiClient';

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
  ],
})
export class AppModule {}
