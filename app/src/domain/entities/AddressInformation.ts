import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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

  @Prop({ default: 0 })
  lat: number;

  @Prop({ default: 0 })
  lon: number;

  @Prop({ default: 0 })
  distanceToUSA: number;
}

export const AddressInformationSchema =
  SchemaFactory.createForClass(AddressInformation);

/**
 * const response = {
 *       ip: data.query,
 *       name: data.country,
 *       code: data.countryCode,
 *       lat: data.lat,
 *       lon: data.lon,
 *       currencies: [],
 *       distance_to_usa: this.getDistanceToUSA(data.lat, data.lon),
 *     };
 */
