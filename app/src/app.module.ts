import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TraceController } from './TraceController';

@Module({
  imports: [],
  controllers: [AppController, TraceController],
  providers: [AppService],
})
export class AppModule {}
