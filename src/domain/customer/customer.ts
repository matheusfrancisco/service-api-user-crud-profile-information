import Email from './email';
import TaxpayerRegistry from './taxpayer-registry';
import { AddressInterface } from '../address/address';
import  AddressService, { validateAddress } from '../address/address-service';
import Amount, { AmountInterface } from '../amount/amount';
import {EndpointStrategy} from './strategy-endpoint';
import {ENDPOINTS} from '../../application/customer-service';

export default class Customer {
  public nextEndpoint: string;
  private _firstName?: string;
  private _lastName?: string;
  private _birthday?: string;
  private _phoneNumber?: string;
  private _amount?: Amount|undefined;
  public readonly email: Email;
  public readonly password: string;
  private _taxpayerRegistry?: TaxpayerRegistry;
  private _address?: AddressService;
  private _countryCode?: string;

  constructor({
    email,
    password,
    lastName, 
    firstName, 
    nextEndpoint, 
    birthday, 
    taxpayerRegistry, 
    phoneNumber, 
    address, 
    amount,
    countryCode,
  }: any) {
    this.email = new Email(email); 
    this.password = password;
    this._lastName = lastName;
    this._firstName = firstName;
    this._birthday = birthday;
    this._taxpayerRegistry = taxpayerRegistry;
    this.nextEndpoint = nextEndpoint;
    this._phoneNumber = phoneNumber;
    this._address = address;
    this._amount = amount;
    this._countryCode = countryCode
  }

  get firstName(): Partial<string | undefined> {
    return this._firstName;
  }
  
  set firstName(firstName: Partial<string | undefined>) {
    if( firstName ) {
      this._firstName = firstName;
    }
  }

  get lastName(): Partial<string | undefined> {
    return this._lastName;
  }
  
  set lastName(lastName: Partial<string | undefined>) {
    if( lastName ) {
      this._lastName = lastName;
    }
  }

  get phoneNumber(): Partial<string | undefined> {
    return this._phoneNumber;
  }
  
  set phoneNumber(phoneNumber: Partial<string | undefined>) {
    if( phoneNumber ) {
      this._phoneNumber = phoneNumber;
    }
  }

  get birthday(): Partial<string | undefined> {
    return this._birthday;
  }
  
  set birthday(birthday: Partial<string | undefined>) {
    if( birthday  ) {
      !isNaN(new Date(birthday).getDate()) ?  this._birthday = birthday : ''
    }
  }

  public updateTaxpayerRegistry(taxpayerRegistry: TaxpayerRegistry): void {
    this._taxpayerRegistry = taxpayerRegistry;
  }

  get taxpayerRegistry(): string|undefined {
    return this._taxpayerRegistry?.value
  }

  public updateNextEndpoint(nextEndpoint: string) {
    this.nextEndpoint = nextEndpoint;
  }

  public async updateAddres({
    address,
    cep,
    city,
    number,
    state,
  }: AddressInterface) {
    const data =  await validateAddress({
      address,
      cep,
      city,
      number,
      state,
    })
    this._address = new AddressService({ ...data });
  }

  public async addAmount({
    amount
  }: AmountInterface) {
    this._amount = new Amount({ amount });
  }

  public changeNextEndpoint(nextEndpoint: string) {
    const user = this.toRepository();

    const changeEndpoint = EndpointStrategy.validateChange({...user, amount: this._amount?.amountValue}, nextEndpoint)
    if(changeEndpoint) { 
      this.updateNextEndpoint(ENDPOINTS[nextEndpoint]);
    }
  }

  public get amountVAlue(): Amount| undefined {
    return this._amount
  }
  
  public toRepository(): Record<string,string|undefined|number> {
    return {
      firstName: this._firstName,
      lastName: this._lastName,
      email: this.email.value,
      taxpayerRegistry: this._taxpayerRegistry?.value,
      password: this.password,
      nextEndpoint: this.nextEndpoint,
      birthday: this._birthday,
      phoneNumber: this._phoneNumber,
      address: this._address?.address,
      cep: this._address?.cep,
      state: this._address?.state,
      number: this._address?.number,
      city: this._address?.city,
      countryCode: this._countryCode,
    }
  }
  
}
