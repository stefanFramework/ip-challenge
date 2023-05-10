import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CurrencyRecord } from './records/CurrencyRecord';
import { CurrencyApiClientInterface } from '../../domain/integrations/CurrencyApiClientInterface';
import { ApiClient } from './ApiClient';

@Injectable()
export class CurrencyApiClient implements CurrencyApiClientInterface {
  private readonly options;
  constructor(private client: ApiClient, private config: ConfigService) {
    this.options = {
      apikey: this.config.get<string>('currencyApi.apiKey'),
    };
  }

  async getLatestRate(currencyCode: string) {
    const url = this.buildUrl(currencyCode);
    const { data } = await this.client.get(url, this.options);
    return this.buildResponse(data);
  }

  buildUrl(currencyCode) {
    const url = this.config.get<string>('currencyApi.url');
    return url.replace('CURRENCY_CODE', currencyCode);
  }

  buildResponse(data) {
    const response = [];
    const { rates } = data;
    Object.keys(rates).forEach((iso) => {
      const result = new CurrencyRecord();
      result.iso = iso;
      result.symbol = '$'; // TODO: Look for symbol on api documentation
      result.conversionRate = rates[iso];
      response.push(result);
    });
    return response;
  }
}
