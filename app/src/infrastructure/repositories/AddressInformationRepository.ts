import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AddressInformation,
  AddressInformationDocument,
} from '../../domain/entities/AddressInformation';
import { Injectable } from '@nestjs/common';
import { AddressInformationRepositoryInterface } from '../../domain/repositories/AddressInformationRepositoryInterface';

@Injectable()
export class AddressInformationRepository
  implements AddressInformationRepositoryInterface
{
  constructor(
    @InjectModel('AddressInformation')
    private addressInformationModel: Model<AddressInformationDocument>,
  ) {}

  async create(addressInformation: AddressInformation) {
    const newModel = await new this.addressInformationModel(addressInformation);
    await newModel.save();
  }

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
