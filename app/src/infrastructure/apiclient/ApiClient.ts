import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiClient {
  constructor(private readonly httpService: HttpService) {}

  async get(url: string) {
    return await firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error: AxiosError) => {
          console.log(error.response.data);
          throw `Apiclient error: ${error.message}`;
        }),
      ),
    );
  }
}
