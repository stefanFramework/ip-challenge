import { IpTraceRecordInterface } from '../../../domain/integrations/records/IpTraceRecordInterface';

export class IpTraceRecord implements IpTraceRecordInterface {
  ip: string;
  countryCode: string;
  currencyCode: string;
  country: string;
  lat: number;
  lon: number;
}
