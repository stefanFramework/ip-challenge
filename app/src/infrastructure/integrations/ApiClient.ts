import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiClient {
  constructor(private readonly httpService: HttpService) {}

  async get(url: string, options = {}) {
    return await firstValueFrom(
      this.httpService.get(url, { headers: options }).pipe(
        catchError((error: AxiosError) => {
          console.log(error.response.data);
          throw new Error(`Apiclient error: ${error.message}`);
        }),
      ),
    );
  }
}
