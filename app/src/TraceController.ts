import { Controller, Post, Get } from '@nestjs/common';

@Controller('traces')
export class TraceController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  @Post()
  getInformation() {
    return 'OK';
  }

  @Get()
  temporal() {
    return 'Temporal';
  }
}
