import express from 'express';


export const factoryServer = ({
  customerController,
  authController,
}: any) => {
   const server = express();

  server.use(express.json());

  server.get('/', (req, res) => {
    res.send('Hello world');
  });

  server.post('/api/v1/user', customerController.post);

  server.put('/api/v1/taxpayer-registry',
   authController.get,
   customerController.updateTaxpayerRegistry
  );

  server.put('/api/v1/full-name',
   authController.get,
   customerController.updateFullName
  );

  server.put('/api/v1/birthday',
   authController.get,
   customerController.updatedBirthday
  );

  server.put('/api/v1/phone-number',
   authController.get,
   customerController.updatePhoneNumber
  );
  server.put('/api/v1/address', authController.get, customerController.updateAddress);
  server.put('/api/v1/ammount', authController.get, customerController.addAmount);

  server.post('/api/v1/login', authController.post);
  return server;
}