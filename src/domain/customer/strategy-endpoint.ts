

const ValidEnpoints: Record<string, Array<string>> = {
  '/api/v1/taxpayer-registry': ['taxpayerRegistry'],
  '/api/v1/full-name': ['taxpayerRegistry', 'lastName',],
  '/api/v1/birthday': ['taxpayerRegistry', 'lastName', 'birthday'],
  '/api/v1/phone-number': ['taxpayerRegistry', 'lastName', 'birthday', 'phoneNumber'],
  '/api/v1/address': ['taxpayerRegistry', 'lastName', 'birthday', 'phoneNumber', 'cep'],
  '/api/v1/ammount': ['taxpayerRegistry', 'lastName', 'birthday', 'phoneNumber', 'cep', 'amount'],
  'last': ['taxpayerRegistry', 'lastName', 'birthday', 'phoneNumber', 'cep', 'amount'],
};


export class EndpointStrategy {
  public static validate(url: string, user: any, nextEdnpoint?: string,) {
    const validateFields = ValidEnpoints[url];
    if( nextEdnpoint === url) {
      return true;
    } else {
      const hasFalse = validateFields.filter((field)=> {
        if(!user[field]) { 
          return true
        }
      })
      return hasFalse.length > 0 ? false: true
    }
  }
  public static validateChange(user: any, nextEdnpoint: string) {
    const validateFields = ValidEnpoints[nextEdnpoint];

    const hasFalse = validateFields.filter((field)=> {
      if(!user[field]) { 
        return true
      }
    })
    return hasFalse.length > 0 ? false: true
  }
}