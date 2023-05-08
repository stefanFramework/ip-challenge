import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class TraceService {
  constructor(private readonly httpService: HttpService) {}

  async getTraceFromIp(ip: string) {
    const { data } = await firstValueFrom(
      this.httpService.get('http://ip-api.com/json/' + ip).pipe(
        catchError((error: AxiosError) => {
          console.log(error.response.data);
          throw 'Unable to obtain data';
        }),
      ),
    );

    // const API_KEY = 'KC30HA5bWxve72csC0RNcRJ9QreWYBxU';
    // const urlIso = 'https://data.fixer.io/api/latest?&symbols=CA,ARG';
    // const iso = await firstValueFrom(
    //   this.httpService.get(urlIso).pipe(
    //     catchError((error: AxiosError) => {
    //       console.log(error.response.data);
    //       throw 'Unable to obtain data';
    //     }),
    //   ),
    // );
    //
    // console.log(iso);

    const response = {
      ip: data.query,
      name: data.country,
      code: data.countryCode,
      lat: data.lat,
      lon: data.lon,
      currencies: [],
      distance_to_usa: this.getDistanceToUSA(data.lat, data.lon),
    };
    console.log(data);
    return response;
  }

  getDistanceToUSA(lat1, lon1) {
    const lat2 = 40.73061;
    const lon2 = -73.935242;
    const R = 6371; // Radius of the earth in km

    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }
}
