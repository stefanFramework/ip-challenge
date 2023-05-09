import { ApiClient } from '../../infrastructure/apiclient/ApiClient';
import { Injectable } from '@nestjs/common';
import { IpApiClientRecord } from './records/IpApiClientRecord';

@Injectable()
export class IpApiClient {
  constructor(private client: ApiClient) {}

  async getTraceFromIp(ip: string): Promise<IpApiClientRecord> {
    const { data } = await this.client.get(`http://ip-api.com/json/${ip}`);
    return this.buildResponse(data);
  }

  buildResponse(data) {
    const response = new IpApiClientRecord();
    response.ip = data.query;
    response.countryCode = data.countryCode;
    response.country = data.country;
    response.lat = data.lat;
    response.lon = data.lon;

    return response;
  }
}
