import { Controller, Post, Body } from '@nestjs/common';
import { TraceService } from '../../domain/services/TraceService';

@Controller('traces')
export class TraceController {
  constructor(private readonly traceService: TraceService) {}

  @Post()
  async getInformation(@Body() body) {
    /*
     * TODO:
     *  1. Add input validation
     *  2. Add redis for caching
     *  3. Add MongoDB for presistency
     *  4. Add Config file
     *  5. See Currency integration
     *  6. Move calculation to utils
     */
    const { ip } = body;
    return await this.traceService.getTraceFromIp(ip);
  }
}
