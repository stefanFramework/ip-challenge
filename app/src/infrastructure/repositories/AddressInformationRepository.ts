import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddressInformationDocument } from '../../domain/entities/AddressInformation';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AddressInformationRepository {
  constructor(
    @InjectModel('AddressInformation')
    private addressInformationModel: Model<AddressInformationDocument>,
  ) {}

  async findByIp(ip: string) {
    return this.addressInformationModel.findOne({ ip: ip });
  }

  async findLongestDistance() {
    return this.addressInformationModel.findOne().sort({ distanceToUSA: -1 });
  }

  async findMostTraced() {
    return this.addressInformationModel.findOne().sort({ counter: -1 });
  }
}
