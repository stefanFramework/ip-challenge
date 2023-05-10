import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CurrencyInformation } from './CurrencyInformation';

export type AddressInformationDocument = HydratedDocument<AddressInformation>;

@Schema()
export class AddressInformation {
  @Prop({ default: '' })
  ip: string;

  @Prop({ default: '' })
  name: string;

  @Prop({ default: 0 })
  counter: number;

  @Prop({ default: '' })
  countryCode: string;

  @Prop({ default: '' })
  currencyCode: string;

  @Prop({ default: 0 })
  lat: number;

  @Prop({ default: 0 })
  lon: number;

  @Prop({ default: 0 })
  distanceToUSA: number;

  @Prop({ default: [] })
  currencyInformation: [CurrencyInformation];
}

export const AddressInformationSchema =
  SchemaFactory.createForClass(AddressInformation);
