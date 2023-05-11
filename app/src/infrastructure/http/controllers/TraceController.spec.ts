import { TraceController } from './TraceController';
import { AddressInformation } from '../../../domain/entities/AddressInformation';
import { CurrencyInformation } from '../../../domain/entities/CurrencyInformation';
import { HttpStatus } from '@nestjs/common';

describe('TraceController', () => {
  let traceService: any;
  let traceController: TraceController;

  const expectedResponse = {
    ip: '190.195.193.95',
    name: 'Argentina',
    code: 'AR',
    lat: 1,
    lon: 1,
    currencies: [
      {
        iso: 'ARS',
        symbol: '$',
        conversion_rate: 220,
      },
    ],
    distance_to_usa: 800,
  };

  beforeEach(() => {
    traceService = {
      getTraceFromIp: jest.fn(),
    };

    traceController = new TraceController(traceService);
  });

  it('getInformation with valid ip address should return json object', async () => {
    const body: any = { ip: '190.195.193.95' };
    const response: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const expectedCurrencyInformation = new CurrencyInformation();
    expectedCurrencyInformation.iso = 'ARS';
    expectedCurrencyInformation.symbol = '$';
    expectedCurrencyInformation.conversionRate = 220;

    const expectedAddressInformation = new AddressInformation();
    expectedAddressInformation.ip = '190.195.193.95';
    expectedAddressInformation.name = 'Argentina';
    expectedAddressInformation.counter = 0;
    expectedAddressInformation.currencyCode = 'ARS';
    expectedAddressInformation.countryCode = 'AR';
    expectedAddressInformation.lat = 1;
    expectedAddressInformation.lon = 1;
    expectedAddressInformation.distanceToUSA = 800;
    expectedAddressInformation.currencyInformation = [
      expectedCurrencyInformation,
    ];

    traceService.getTraceFromIp.mockReturnValueOnce(expectedAddressInformation);

    await traceController.getInformation(body, response);

    expect(traceService.getTraceFromIp).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(response.json).toHaveBeenCalledWith(expectedResponse);
  });

  it('getInformation should return a 400 error for an invalid IP', async () => {
    const body: any = { ip: 'invalid-ip' };
    const response: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await traceController.getInformation(body, response);

    expect(traceService.getTraceFromIp).toHaveBeenCalledTimes(0);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith({ message: 'Invalid input' });
  });

  it('getInformation should return a 500 error for a service error', async () => {
    const body: any = { ip: '190.195.193.95' };
    const response: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    traceService.getTraceFromIp.mockImplementation(() => {
      throw new Error('Service Error');
    });

    await traceController.getInformation(body, response);

    expect(traceService.getTraceFromIp).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(response.json).toHaveBeenCalledWith({ message: 'Service Error' });
  });
});
