import { Injectable } from '@nestjs/common';
import { AddressInformationRepositoryInterface } from '../repositories/AddressInformationRepositoryInterface';

@Injectable()
export class TraceStatisticsService {
  constructor(
    private addressInformationRepository: AddressInformationRepositoryInterface,
  ) {}

  async getLongestDistance() {
    return await this.addressInformationRepository.findLongestDistance();
  }

  async getMostTraced() {
    return await this.addressInformationRepository.findMostTraced();
  }
}
