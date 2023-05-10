import { Injectable } from '@nestjs/common';
import { AddressInformation } from '../entities/AddressInformation';
import { getDistanceToUSA } from '../helpers/distance';
import { CurrencyInformation } from '../entities/CurrencyInformation';
import { AddressInformationRepositoryInterface } from '../repositories/AddressInformationRepositoryInterface';
import { IpApiClientInterface } from '../integrations/IpApiClientInterface';
import { CurrencyApiClientInterface } from '../integrations/CurrencyApiClientInterface';
import { CurrencyRecordInterface } from '../integrations/records/CurrencyRecordInterface';

@Injectable()
export class TraceService {
  constructor(
    private readonly ipApiClient: IpApiClientInterface,
    private readonly currencyApiClient: CurrencyApiClientInterface,
    private addressInformationRepository: AddressInformationRepositoryInterface,
  ) {}

  async getTraceFromIp(ip: string) {
    const existingAddressInformation =
      await this.addressInformationRepository.findByIp(ip);

    if (existingAddressInformation) {
      existingAddressInformation.counter += 1;
      existingAddressInformation.save();
      return existingAddressInformation;
    }

    const traceRecord = await this.ipApiClient.getTraceFromIp(ip);
    const { currencyCode } = traceRecord;
    const currencyResult = await this.currencyApiClient.getLatestRate(
      currencyCode,
    );

    const addressInformation = this.mapToAddressInformation(
      traceRecord,
      currencyResult,
    );

    this.addressInformationRepository.create(addressInformation);
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
    return currencyResult.map((record: CurrencyRecordInterface) => {
      const ci = new CurrencyInformation();
      ci.iso = record.iso;
      ci.symbol = record.symbol;
      ci.conversionRate = record.conversionRate;
      return ci;
    });
  }
}
