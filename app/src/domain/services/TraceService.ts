import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  AddressInformation,
  AddressInformationDocument,
} from '../entities/AddressInformation';
import { InjectModel } from '@nestjs/mongoose';
import { AddressInformationRepository } from '../../infrastructure/repositories/AddressInformationRepository';
import { IpApiClient } from '../integrations/IpApiClient';
import { getDistanceToUSA } from '../helpers/distance';
import { CurrencyApiClient } from '../integrations/CurrencyApiClient';
import { CurrencyInformation } from '../entities/CurrencyInformation';

@Injectable()
export class TraceService {
  constructor(
    private readonly ipApiClient: IpApiClient,
    private readonly currencyApiClient: CurrencyApiClient,
    @InjectModel('AddressInformation')
    private addressInformationModel: Model<AddressInformationDocument>,
    private addressInformationRepository: AddressInformationRepository,
  ) {}

  async getTraceFromIp(ip: string) {
    const existingAddressInformation =
      await this.addressInformationRepository.findByIp(ip);

    if (existingAddressInformation) {
      existingAddressInformation.counter += 1;
      existingAddressInformation.save();
      return existingAddressInformation;
    }

    const trace = await this.ipApiClient.getTraceFromIp(ip);
    const { currencyCode } = trace;
    const currencyResult = await this.currencyApiClient.getLatestRate(
      currencyCode,
    );

    const addressInformation = this.mapToAddressInformation(
      trace,
      currencyResult,
    );

    const newModel = await new this.addressInformationModel(addressInformation);
    await newModel.save();

    return addressInformation;
  }

  mapToAddressInformation(ipResult, currencyResult) {
    const newAddressInformation = new AddressInformation();
    newAddressInformation.ip = ipResult.ip;
    newAddressInformation.name = ipResult.country;
    newAddressInformation.counter = 0;
    newAddressInformation.currencyCode = ipResult.currencyCode;
    newAddressInformation.countryCode = ipResult.countryCode;
    newAddressInformation.currencyInformation =
      this.mapCurrencyRecord(currencyResult);
    newAddressInformation.lat = ipResult.lat;
    newAddressInformation.lon = ipResult.lon;
    newAddressInformation.distanceToUSA = getDistanceToUSA(
      ipResult.lat,
      ipResult.lon,
    );

    return newAddressInformation;
  }

  mapCurrencyRecord(currencyResult) {
    return currencyResult.map((record) => {
      const ci = new CurrencyInformation();
      ci.iso = record.iso;
      ci.symbol = record.symbol;
      ci.conversionRate = record.conversionRate;
      return ci;
    });
  }
}
