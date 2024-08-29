import { Pool, PoolClient } from 'pg';
import Boom from '@hapi/boom';

import {
  http,
  parseValidCurrencyCode,
  parseValidTranslationLanguage,
} from './utils';
import { Data, Product } from './types';
import { saveProductsData } from './services';
import { setupServer } from './restApi';

const getProducts = async () => {
  if (!process.env.PRODUCTS_URL) {
    throw Boom.internal('Invalid product URL');
  }
  const response = await http<Data>(process.env.PRODUCTS_URL);
  return response.products;
};

async function main() {
  try {
    const pgpool = new Pool({ connectionString: process.env.POSTGRES_URL });
    const pg: PoolClient = await pgpool.connect();

    console.log('Fetching products from URL...');
    const products: Product[] = await getProducts();
    console.log('Products fetched successfully');

    console.log('Saving products ...');
    await saveProductsData(
      pg,
      products,
      parseValidTranslationLanguage('English'),
      parseValidCurrencyCode('EUR')
    );

    await setupServer(pg);
    console.log('Product saved successfully!');
  } catch (err) {
    console.log('Error', err);
  }
}

process.on('unhandledRejection', (err: Error) => {
  console.error(err.stack);
  process.exit(1);
});

main();
