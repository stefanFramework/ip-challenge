import { ApiClient } from '../../infrastructure/apiclient/ApiClient';
import { Injectable } from '@nestjs/common';
import { CurrencyRecord } from './records/CurrencyRecord';

@Injectable()
export class CurrencyApiClient {
  private readonly options;
  constructor(private client: ApiClient) {
    this.options = {
      apikey: 'KC30HA5bWxve72csC0RNcRJ9QreWYBxU',
    };
  }

  async getLatestRate(currencyCode: string): Promise<CurrencyRecord[]> {
    const { data } = await this.client.get(
      `https://api.apilayer.com/fixer/latest?symbols=${currencyCode}&base=USD`,
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
      result.symbol = '$';
      result.conversionRate = rates[iso];
      response.push(result);
    });
    return response;
  }
}
