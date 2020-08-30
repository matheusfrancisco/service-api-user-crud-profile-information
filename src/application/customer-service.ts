import Customer from '../domain/customer/customer';
import { CustomerRepository } from '../domain/customer/customer-repository';
import TaxpayerRegistry from '../domain/customer/taxpayer-registry';
import { CountryCode, CountryFactory } from '../domain/customer/country';
import { AmountRepository } from '../infrastructure/postgres-amount-repository';
import AddresService from '../domain/address/address-service';
import bcrypt from 'bcrypt';

export interface CustomerResource {
  id: number;
  name: string;
  email: string;
}

const ENDPOINTS: Record<string, string> = {
  'first': '/api/v1/taxpayer-registry',
  '/api/v1/taxpayer-registry': '/api/v1/full-name',
  '/api/v1/full-name': '/api/v1/birthday',
  '/api/v1/birthday': '/api/v1/phone-number',
  '/api/v1/phone-number': '/api/v1/address',
  '/api/v1/address': '/api/v1/ammount',
  '/api/v1/ammount': 'last',
  'last': 'last',
};

export const cryptPass = async(password: string) => {
  const hashPass = await bcrypt.hash(password, 8);
  return hashPass
}

//#TODO
// CustomerService has members duplicate like choose the next endpoint
// like delaget to update
// instanciate domains class
// may we need to refactory this points in the future haha
export default class CustomerService {
  constructor(private customerRepository: CustomerRepository, private amountRepository: AmountRepository, private countryFactory: CountryFactory ) {}
  
  public async cryptPass (password: string){
    const hashPass = await bcrypt.hash(password, 8);
    return hashPass
  }
  async createCustomer(email: string, password: string) {
    try {
      const hashPass = await this.cryptPass(password);
      const user = new Customer({email, password: hashPass, nextEndpoint: ENDPOINTS.first });
      await this.customerRepository.save(user);
    } catch (error) {
      throw error
    }
  }

  async updateTaxpayerRegistry(email: string, taxpayer: string, countryCode: string)  {
    const country = this.countryFactory.buildCountry(countryCode as CountryCode);
    const taxpayerResgitry = new TaxpayerRegistry(taxpayer, country);
    
    const customer = await this.customerRepository.findByEmail(email);

    if( customer ) {
      const customerDomain = new Customer({
        ...customer, countryCode
      });
      
      customerDomain.updateTaxpayerRegistry(taxpayerResgitry);
      if(customer.nextEndpoint) {
        customerDomain.updateNextEndpoint(
          ENDPOINTS[customer.nextEndpoint]
        )
      }  
      await this.customerRepository.update(customerDomain, customer.id);
      const customerUpdated = await this.customerRepository.findByEmail(email);
      return customerUpdated;
    }
  }

  async updateFullName(email: string, firstName: string, lastName: string): Promise<any> {
    try {
      const customer = await this.customerRepository.findByEmail(email);
      if( customer && customer.taxpayerRegistry ) {
        const country = this.countryFactory.buildCountry(customer.countryCode as CountryCode);
        const taxpayerRegistry = new TaxpayerRegistry(customer.taxpayerRegistry, country);
    
        const customerDomain = new Customer({
          ...customer, taxpayerRegistry
        });
        customerDomain.firstName = firstName;
        customerDomain.lastName = lastName;
        //move this role to domain layer
        //domain need to select your next endpoint
        if(customer.nextEndpoint) {
          customerDomain.updateNextEndpoint(
            ENDPOINTS[customer.nextEndpoint]
          )
        }  
        await this.customerRepository.update(customerDomain, customer.id);
        const customerUpdated = await this.customerRepository.findByEmail(email);

        return customerUpdated;
      }
    } catch (error) {
      throw error
    }
  }

  async updatedBirthday(email: string, birthday: string) {
    const customer = await this.customerRepository.findByEmail(email);  
    if( customer && customer.taxpayerRegistry ) {
      const country = this.countryFactory.buildCountry(customer.countryCode as CountryCode);
      const taxpayerRegistry = new TaxpayerRegistry(customer.taxpayerRegistry, country);
  
      const customerDomain = new Customer({
        ...customer, taxpayerRegistry
      });
      customerDomain.birthday = birthday
      if(customer.nextEndpoint) {
        customerDomain.updateNextEndpoint(
          ENDPOINTS[customer.nextEndpoint]
        )
      }
      await this.customerRepository.update(customerDomain, customer.id);
      const customerUpdated = await this.customerRepository.findByEmail(email);
      return customerUpdated;
    }

  }

  async updatePhoneNumber(email: string, phoneNumber: string) {
    const customer = await this.customerRepository.findByEmail(email);  
    if( customer && customer.taxpayerRegistry ) {
      const country = this.countryFactory.buildCountry(customer.countryCode as CountryCode);
      const taxpayerRegistry = new TaxpayerRegistry(customer.taxpayerRegistry, country);
  
      const customerDomain = new Customer({
        ...customer, taxpayerRegistry
      });
      customerDomain.phoneNumber = phoneNumber
      if(customer.nextEndpoint) {
        customerDomain.updateNextEndpoint(
          ENDPOINTS[customer.nextEndpoint]
        )
      }
      await this.customerRepository.update(customerDomain, customer.id);
      const customerUpdated = await this.customerRepository.findByEmail(email);
      return customerUpdated;
    }

  }
  
  async findByEmail(email: string): Promise<Customer | null> {
    const userFound = await this.customerRepository.findByEmail(email);
    if( userFound ) {
      return new Customer({
        ...userFound
      });
    }
    return null;
  }
  
  async updateAddress(
    email: string,
    address: string,
    cep: string,
    city: string,
    number: number,
    state: string,
  ) {
    const customer = await this.customerRepository.findByEmail(email);  
    if( customer && customer.taxpayerRegistry ) {
      const country = this.countryFactory.buildCountry(customer.countryCode as CountryCode);
      const taxpayerRegistry = new TaxpayerRegistry(customer.taxpayerRegistry, country);
  
      const customerDomain = new Customer({
        ...customer, taxpayerRegistry
      });
      await customerDomain.updateAddres({
        address,
        cep,
        city,
        number,
        state,
      })
      if(customer.nextEndpoint) {
        customerDomain.updateNextEndpoint(
          ENDPOINTS[customer.nextEndpoint]
        )
      }
      await this.customerRepository.update(customerDomain, customer.id);
      const customerUpdated = await this.customerRepository.findByEmail(email);
      return customerUpdated;
    }
  }
  

  async addAmount(
    email: string,
    amount: number,
  ) {
    const customer = await this.customerRepository.findByEmail(email);  
    if( customer && customer.taxpayerRegistry  && customer.address && customer.cep
      && customer.city && customer.state && customer.number) {
      const country = this.countryFactory.buildCountry(customer.countryCode as CountryCode);
      const taxpayerRegistry = new TaxpayerRegistry(customer.taxpayerRegistry, country);
      const address = new AddresService({
        cep:customer.cep,
        city: customer.city,
        state:customer.state,
        address:customer.address,
        number: customer.number
      });
      const customerDomain = new Customer({
        ...customer, taxpayerRegistry, address
      });
      await customerDomain.addAmount({ amount });

      if(customer.nextEndpoint) {
        customerDomain.updateNextEndpoint(
          ENDPOINTS[customer.nextEndpoint]
        )
      }
      await this.amountRepository.save(customerDomain, customer.id);
      await this.customerRepository.update(customerDomain, customer.id);
      const customerUpdated = await this.customerRepository.findByEmail(email);
      return customerUpdated;
    }
  }



}
