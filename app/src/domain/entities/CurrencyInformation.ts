import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CurrencyInformationDocument = HydratedDocument<CurrencyInformation>;

@Schema()
export class CurrencyInformation {
  @Prop()
  iso: string;

  @Prop()
  symbol: string;

  @Prop()
  conversionRate: number;
}

export const CurrencyInformationSchema =
  SchemaFactory.createForClass(CurrencyInformation);
