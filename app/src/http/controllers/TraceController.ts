import { Controller, Post, Body } from '@nestjs/common';
import { InformationRecord } from '../records/InformationRecord';
import { TraceService } from '../../domain/services/TraceService';

@Controller('traces')
export class TraceController {
  constructor(private readonly traceService: TraceService) {}

  @Post()
  async getInformation(@Body() informationRecord: InformationRecord) {
    /*
     * TODO:
     *  1. Add input validation
     *  2. Add redis for caching
     *  3. Add MongoDB for presistency
     *  4. Add Config file
     *  5. See Currency integration
     */
    const { ip } = informationRecord;
    return await this.traceService.getTraceFromIp(ip);
  }
}
