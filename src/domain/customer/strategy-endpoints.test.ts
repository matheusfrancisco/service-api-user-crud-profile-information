import {EndpointStrategy} from './strategy-endpoint';

describe('Customer', () => {

  it('allow endpoint', () => {
    const user =  {
      'taxpayerRegistry': '1231231',
    }
    const isAllow = EndpointStrategy.validate(
      '/api/v1/full-name',
      user,
      '/api/v1/full-name',
    )
    expect(isAllow).toEqual(true);
  });


  it('allow endpoint to call again', () => {
    const user =  {
      'taxpayerRegistry': '1231231',
      'lastName': "Francisco",
      'phoneNumber': '1231231',
      'birthday': 'fake',
      'cep': 'fake',
      'ammount': 'fake'
    };

    const isAllow = EndpointStrategy.validate(
      '/api/v1/full-name',
      user,
      '/api/v1/birthday', 
    );

    expect(isAllow).toEqual(true);
  });

  it('allow endpoint to call again xx', () => {
    const user =  {
      'taxpayerRegistry': '1231231',
      'lastName': "Francisco",
      'birthday': ''
    };

    const isAllow = EndpointStrategy.validate(
      '/api/v1/birthday', 
      user,
      '/api/v1/full-name',
    );

    expect(isAllow).toEqual(false);
  });

});
