import { ApiClient } from '../../infrastructure/apiclient/ApiClient';
import { Injectable } from '@nestjs/common';
import { CurrencyRecord } from './records/CurrencyRecord';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CurrencyApiClient {
  private readonly options;
  constructor(private client: ApiClient, private config: ConfigService) {
    this.options = {
      apikey: this.config.get<string>('currencyApi.apiKey'),
    };
  }

  async getLatestRate(currencyCode: string): Promise<CurrencyRecord[]> {
    const url = this.config.get<string>('currencyApi.url');
    const { data } = await this.client.get(
      url.replace('CURRENCY_CODE', currencyCode),
      this.options,
    );
    return this.buildResponse(data);
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
