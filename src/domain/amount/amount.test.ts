import Amount from './amount';

describe('Customer', () => {

  
  it('has a valid value', () => {
    const amount = new Amount({amount: 10.0});
    expect(amount.amountValue).toEqual(10.0);
  });

  it('has a throw error', () => {
    expect(() => { new Amount({amount: ''})}).toThrow()
  });
});
