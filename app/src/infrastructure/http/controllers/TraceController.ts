import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { ValidationError } from '../errors/ValidationError';
import { TraceService } from '../../../domain/services/TraceService';
import { isValidIpAddress } from '../../../domain/helpers/validation';

@Controller('traces')
export class TraceController {
  constructor(private readonly traceService: TraceService) {}

  @Post()
  async getInformation(@Body() body, @Res() response) {
    try {
      const { ip } = body;
      this.assertIpAddressIsValid(ip);
      const addressInformation = await this.traceService.getTraceFromIp(ip);
      return response
        .status(HttpStatus.OK)
        .json(this.buildResponse(addressInformation));
    } catch (error) {
      if (error instanceof ValidationError) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: error.message,
        });
      }

      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  assertIpAddressIsValid(ip) {
    if (!ip || !isValidIpAddress(ip)) {
      throw new ValidationError('Invalid input');
    }
  }

  buildResponse(addressInformation) {
    return {
      ip: addressInformation.ip,
      name: addressInformation.name,
      code: addressInformation.countryCode,
      lat: addressInformation.lat,
      lon: addressInformation.lon,
      currencies: [],
      distance_to_usa: addressInformation.distanceToUSA,
    };
  }
}
