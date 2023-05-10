import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IpApiClientInterface } from '../../domain/integrations/IpApiClientInterface';
import { ApiClient } from './ApiClient';
import { IpTraceRecord } from './records/IpTraceRecord';

@Injectable()
export class IpApiClient implements IpApiClientInterface {
  constructor(private client: ApiClient, private config: ConfigService) {}

  async getTraceFromIp(ip: string) {
    const url = this.buildUrl(ip);
    const { data } = await this.client.get(url);
    return this.buildResponse(data);
  }

  buildUrl(ip) {
    const url = this.config.get<string>('ipApi.url');
    return url.replace('IP_TO_QUERY', ip);
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
