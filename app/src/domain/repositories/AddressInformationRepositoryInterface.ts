import { AddressInformation } from '../entities/AddressInformation';

export interface AddressInformationRepositoryInterface {
  create(addressInformation: AddressInformation);
  findByIp(ip: string);
  findLongestDistance();
  findMostTraced();
}
