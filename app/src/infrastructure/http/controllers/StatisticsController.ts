import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddressInformationDocument } from '../../../domain/entities/AddressInformation';

@Controller('statistics')
export class StatisticsController {
  constructor(
    @InjectModel('AddressInformation')
    private addressInformationModel: Model<AddressInformationDocument>,
  ) {}

  @Get()
  async getStatistics() {
    const longestDistance = await this.addressInformationModel
      .findOne()
      .sort({ distanceToUSA: -1 });

    console.log(longestDistance);
    //
    // return {
    //   longest_distance: {
    //     country: 'United States',
    //     value: 0,
    //   },
    //   most_traced: {
    //     country: 'United States',
    //     value: 1,
    //   },
    // };
  }
}
