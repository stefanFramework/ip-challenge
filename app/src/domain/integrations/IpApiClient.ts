import { ApiClient } from '../../infrastructure/apiclient/ApiClient';
import { Injectable } from '@nestjs/common';
import { IpTraceRecord } from './records/IpTraceRecord';

@Injectable()
export class IpApiClient {
  constructor(private client: ApiClient) {}

  async getTraceFromIp(ip: string): Promise<IpTraceRecord> {
    const { data } = await this.client.get(
      `http://ip-api.com/json/${ip}?fields=query,country,countryCode,lat,lon,currency`,
    );
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
