import { Amount } from './entity/amount-entity';
import { Connection, getRepository } from 'typeorm';
import Customer from 'src/domain/customer/customer';

export interface AmountRepository {
  save: (customer: Customer, customerId: number) => Promise<void>
}


export class PostgresAmountRepository implements AmountRepository {
  constructor(public connection: Connection) {}
  public async save(customer: Customer, customerId: number): Promise<void> {
     
    const entity = {
      amount: customer.amountVAlue?.amountValue,
      customer: {...customer.toRepository(), id: customerId},
    };
    const entityAmount = await getRepository(Amount).create(entity);
    await getRepository(Amount).save(entityAmount)
  }

}
