


export class AmountError extends Error {
  public title: string;
  constructor(message: string) {
    super(message);
    this.title = 'Amount Domain Error';
  }
}

export interface AmountInterface {
  amount: number;
}

export const errorMessages = {
  invalidValue: 'An amount must have a valid amount value',

}


export default class Amount {
  public readonly amount: number;

  constructor({ amount }: AmountInterface) {
    if(!amount) throw new AmountError(errorMessages.invalidValue);
    this.amount = amount
  }

  public get amountValue(): number {
    return this.amount
  }
}