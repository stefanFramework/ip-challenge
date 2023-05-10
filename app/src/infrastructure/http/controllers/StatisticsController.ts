import { Controller, Get } from '@nestjs/common';
import { AddressInformationRepository } from '../../repositories/AddressInformationRepository';

@Controller('statistics')
export class StatisticsController {
  constructor(
    private addressInformationRepository: AddressInformationRepository,
  ) {}

  @Get()
  async getStatistics() {
    const longestDistance =
      await this.addressInformationRepository.findLongestDistance();
    const mostTraced = await this.addressInformationRepository.findMostTraced();

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
