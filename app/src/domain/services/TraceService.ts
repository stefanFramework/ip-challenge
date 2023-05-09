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

@Injectable()
export class TraceService {
  constructor(
    private readonly ipApiClient: IpApiClient,
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

    const result = await this.ipApiClient.getTraceFromIp(ip);

    const newAddressInformation = new AddressInformation();
    newAddressInformation.ip = result.ip;
    newAddressInformation.name = result.country;
    newAddressInformation.counter = 0;
    newAddressInformation.countryCode = result.countryCode;
    newAddressInformation.lat = result.lat;
    newAddressInformation.lon = result.lon;
    newAddressInformation.distanceToUSA = getDistanceToUSA(
      result.lat,
      result.lon,
    );

    const newModel = await new this.addressInformationModel(
      newAddressInformation,
    );
    await newModel.save();

    // const API_KEY = 'KC30HA5bWxve72csC0RNcRJ9QreWYBxU';
    // const urlIso = 'https://data.fixer.io/api/latest?&symbols=CA,ARG';
    // const iso = await firstValueFrom(
    //   this.httpService.get(urlIso).pipe(
    //     catchError((error: AxiosError) => {
    //       console.log(error.response.data);
    //       throw 'Unable to obtain data';
    //     }),
    //   ),
    // );
    //
    // console.log(iso);

    return newAddressInformation;
  }
}
