import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StatisticsController } from './http/controllers/StatisticsController';
import { TraceController } from './http/controllers/TraceController';
import { TraceService } from './domain/services/TraceService';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressInformationSchema } from './domain/entities/AddressInformation';

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
  providers: [TraceService],
})
export class AppModule {}
