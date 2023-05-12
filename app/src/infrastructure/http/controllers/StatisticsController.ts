import { Controller, Get } from '@nestjs/common';
import { TraceStatisticsService } from '../../../domain/services/TraceStatisticsService';

@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: TraceStatisticsService) {}

  @Get()
  async getStatistics() {
    const longestDistance = await this.statisticsService.getLongestDistance();
    const mostTraced = await this.statisticsService.getMostTraced();

    if (!longestDistance || !mostTraced) {
      return {
        message: 'Unable to show information',
      };
    }

    return {
      longest_distance: {
        country: longestDistance.name,
        value: longestDistance.distanceToUSA,
      },
      most_traced: {
        country: mostTraced.name,
        value: mostTraced.counter,
      },
    };
  }
}
