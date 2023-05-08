import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StatisticsController } from './http/controllers/StatisticsController';
import { TraceController } from './http/controllers/TraceController';
import { TraceService } from './domain/services/TraceService';

@Module({
  imports: [HttpModule],
  controllers: [TraceController, StatisticsController],
  providers: [TraceService],
})
export class AppModule {}
