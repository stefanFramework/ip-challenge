import { Controller, Get } from '@nestjs/common';

@Controller('statistics')
export class StatisticsController {
  @Get()
  getStatistics() {
    return 'OK';
  }
}
