import { TraceService } from './TraceService';

describe('TraceService', () => {
  let traceService: TraceService;

  let ipApiClient: any;
  let currencyApiClient: any;
  let addressInformationRepository: any;

  beforeEach(async () => {
    addressInformationRepository = {
      create: jest.fn(),
      findByIp: jest.fn(),
    };

    ipApiClient = {
      getTraceFromIp: jest.fn(),
    };

    currencyApiClient = {
      getLatestRate: jest.fn(),
    };

    traceService = new TraceService(
      ipApiClient,
      currencyApiClient,
      addressInformationRepository,
    );
  });

  it('should return existing Addressinformation, if ip address exists on database', async () => {
    const ip = '123.456.789.012';
    const expectedResponse = {
      ip: ip,
      counter: 1,
    };

    addressInformationRepository.findByIp.mockReturnValueOnce({
      ip: ip,
      counter: 0,
      save: jest.fn(() => {
        return;
      }),
    });

    const result = await traceService.getTraceFromIp(ip);

    expect(addressInformationRepository.findByIp).toHaveBeenCalled();
    expect(ipApiClient.getTraceFromIp).toHaveBeenCalledTimes(0);
    expect(currencyApiClient.getLatestRate).toHaveBeenCalledTimes(0);
    expect(result.ip).toEqual(expectedResponse.ip);
    expect(result.counter).toEqual(expectedResponse.counter);
  });

  it('should return new AddressInformation if ip address does not exists on database', async () => {
    const ip = '123.456.789.012';
    const expectedApiClientResponse = {
      ip: ip,
      countryCode: 'AR',
      currencyCode: 'ARS',
      country: 'Argentina',
      lat: 1,
      lon: 1,
    };

    const expectedCurrencyClientResponse = [
      {
        iso: 'ARS',
        symbol: '$',
        conversionRate: 200,
      },
    ];

    addressInformationRepository.findByIp.mockReturnValueOnce(null);
    ipApiClient.getTraceFromIp.mockReturnValueOnce(expectedApiClientResponse);
    currencyApiClient.getLatestRate.mockReturnValueOnce(
      expectedCurrencyClientResponse,
    );

    const result = await traceService.getTraceFromIp(ip);

    expect(addressInformationRepository.findByIp).toHaveBeenCalled();
    expect(ipApiClient.getTraceFromIp).toHaveBeenCalled();
    expect(currencyApiClient.getLatestRate).toHaveBeenCalled();
    expect(addressInformationRepository.create).toHaveBeenCalled();
    expect(result.ip).toEqual(ip);
  });

  it('should throw error if API Client fails', async () => {
    const ip = '123.456.789.012';

    addressInformationRepository.findByIp.mockReturnValueOnce(null);
    ipApiClient.getTraceFromIp.mockImplementation(() => {
      throw new Error('Api Client error');
    });

    try {
      await traceService.getTraceFromIp(ip);
    } catch (e) {
      expect(e.message).toBe('Api Client error');
    }

    expect(addressInformationRepository.findByIp).toHaveBeenCalled();
    expect(ipApiClient.getTraceFromIp).toHaveBeenCalled();
    expect(currencyApiClient.getLatestRate).toHaveBeenCalledTimes(0);
    expect(addressInformationRepository.create).toHaveBeenCalledTimes(0);
  });

  it('should throw error if Currency API Client fails', async () => {
    const ip = '123.456.789.012';
    const expectedApiClientResponse = {
      ip: ip,
      countryCode: 'AR',
      currencyCode: 'ARS',
      country: 'Argentina',
      lat: 1,
      lon: 1,
    };

    addressInformationRepository.findByIp.mockReturnValueOnce(null);
    ipApiClient.getTraceFromIp.mockReturnValueOnce(expectedApiClientResponse);
    currencyApiClient.getLatestRate.mockImplementation(() => {
      throw new Error('Currency Api Client error');
    });

    try {
      await traceService.getTraceFromIp(ip);
    } catch (e) {
      expect(e.message).toBe('Currency Api Client error');
    }

    expect(addressInformationRepository.findByIp).toHaveBeenCalled();
    expect(ipApiClient.getTraceFromIp).toHaveBeenCalled();
    expect(currencyApiClient.getLatestRate).toHaveBeenCalled();
    expect(addressInformationRepository.create).toHaveBeenCalledTimes(0);
  });
});
