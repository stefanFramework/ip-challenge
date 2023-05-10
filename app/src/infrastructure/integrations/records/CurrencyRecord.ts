import { CurrencyRecordInterface } from '../../../domain/integrations/records/CurrencyRecordInterface';

export class CurrencyRecord implements CurrencyRecordInterface {
  iso: string;
  symbol: string;
  conversionRate: number;
}
