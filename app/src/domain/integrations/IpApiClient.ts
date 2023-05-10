import { ApiClient } from '../../infrastructure/apiclient/ApiClient';
import { Injectable } from '@nestjs/common';
import { IpTraceRecord } from './records/IpTraceRecord';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IpApiClient {
  constructor(private client: ApiClient, private config: ConfigService) {}

  async getTraceFromIp(ip: string): Promise<IpTraceRecord> {
    const url = this.config.get<string>('ipApi.url');
    const { data } = await this.client.get(url.replace('IP_TO_QUERY', ip));
    return this.buildResponse(data);
  }

  buildResponse(data) {
    const response = new IpTraceRecord();
    response.ip = data.query;
    response.countryCode = data.countryCode;
    response.currencyCode = data.currency;
    response.country = data.country;
    response.lat = data.lat;
    response.lon = data.lon;

    return response;
  }
}
