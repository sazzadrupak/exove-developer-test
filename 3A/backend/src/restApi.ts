import express, { NextFunction, Request, Response } from 'express';
import { PoolClient } from 'pg';

import { getProducts } from './services';
import { parseValidCurrencyCode, parseValidTranslationLanguage } from './utils';

export const setupServer = async (pgpool: PoolClient) => {
  const app = express();
  app.use(express.json());
  const PORT = process.env.PORT || 3000;
  const router = express.Router();

  app.use('/v1', router);

  router.get(
    '/products',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const products = await getProducts(
          pgpool,
          parseValidTranslationLanguage('English'),
          parseValidCurrencyCode('EUR')
        );
        res.send(products);
      } catch (err) {
        next(err);
      }
    }
  );

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
