import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AddressInformationDocument = HydratedDocument<AddressInformation>;

@Schema()
export class AddressInformation {
  @Prop()
  ip: string;

  @Prop()
  name: string;

  @Prop()
  countryCode: string;

  @Prop()
  lat: number;

  @Prop()
  lon: number;

  @Prop()
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
