import { PoolClient } from 'pg';
import { LanguageCode } from 'iso-639-1';
import Boom from '@hapi/boom';

import { Product, Variation } from './types';
import { CurrencyCodeRecord } from 'currency-codes';
import { getCurrencyName } from './utils';

async function saveProduct(pg: PoolClient, productId: string) {
  await pg.query(
    `
      INSERT INTO products (id)
      VALUES ($1)
      ON CONFLICT (id)
      DO NOTHING
    `,
    [productId]
  );
}

async function saveProductName(
  pg: PoolClient,
  productId: string,
  productName: string,
  langCode: LanguageCode
) {
  await pg.query(
    `
      INSERT INTO product_names (product_id, product_name, lang_code)
      VALUES ($1, $2, $3)
      ON CONFLICT (product_id, lang_code)
      DO NOTHING
    `,
    [productId, productName, langCode]
  );
}

async function saveProductDescription(
  pg: PoolClient,
  productId: string,
  productDesc: string,
  langCode: LanguageCode
) {
  await pg.query(
    `
      INSERT INTO product_descriptions (product_id, product_description, lang_code)
      VALUES ($1, $2, $3)
      ON CONFLICT (product_id, lang_code)
      DO NOTHING
    `,
    [productId, productDesc, langCode]
  );
}

async function saveCategory(pg: PoolClient, categoryId: string) {
  await pg.query(
    `
      INSERT INTO categories (id)
      VALUES ($1)
      ON CONFLICT (id)
      DO NOTHING
    `,
    [categoryId]
  );
}

async function saveCategoryName(
  pg: PoolClient,
  categoryId: string,
  categoryName: string,
  langCode: LanguageCode
) {
  await pg.query(
    `
      INSERT INTO category_names (category_id, category_name, lang_code)
      VALUES ($1, $2, $3)
      ON CONFLICT (category_id, lang_code)
      DO NOTHING
    `,
    [categoryId, categoryName, langCode]
  );
}

async function saveProductCategory(
  pg: PoolClient,
  productId: string,
  categoryId: string
) {
  await pg.query(
    `
      INSERT INTO product_categories (product_id, category_id)
      VALUES ($1, $2)
      ON CONFLICT (product_id, category_id)
      DO NOTHING
    `,
    [productId, categoryId]
  );
}

async function saveVariation(
  pg: PoolClient,
  productId: string,
  variation: Variation
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { price, ...rest } = variation;
  // if it fails on conflicts, it will return nothing, then the second SELECT will get the existing row;
  // if it inserts successfully, then there will be two same records, then we need UNION to merge the result.
  const { rows } = await pg.query(
    `
      WITH new_variation AS (
        INSERT INTO product_variations (product_id, attributes)
        VALUES ($1, $2)
        ON CONFLICT (product_id, attributes)
        DO NOTHING
        RETURNING id
      )
        SELECT * FROM new_variation
        UNION
          SELECT id FROM product_variations
          WHERE product_id = $1 AND attributes = $2
    `,
    [productId, rest]
  );
  if (rows.length === 0) {
    throw Boom.internal('Variation failure!');
  }
  return rows[0].id;
}

async function saveCurrency(
  pg: PoolClient,
  currencyCode: CurrencyCodeRecord
): Promise<string> {
  const currencyNumber = currencyCode.number;
  const { rows } = await pg.query(
    `
      WITH new_currency AS (
        INSERT INTO currencies (id)
        VALUES ($1)
        ON CONFLICT (id)
        DO NOTHING
        RETURNING id
      )
        SELECT * FROM new_currency
        UNION
          SELECT * FROM currencies
          WHERE id = $1
    `,
    [currencyNumber]
  );
  if (rows.length === 0) {
    throw Boom.internal('Currency failure!');
  }
  return currencyNumber;
}

async function saveVariationPrice(
  pg: PoolClient,
  variationId: string,
  currencyId: string,
  price: number
) {
  await pg.query(
    `
      INSERT INTO variation_prices (variation_id, currency_id, price)
      VALUES ($1, $2, $3)
      ON CONFLICT (variation_id, currency_id)
      DO NOTHING
    `,
    [variationId, currencyId, price]
  );
}

export const saveProductsData = async (
  pg: PoolClient,
  products: Product[],
  langCode: LanguageCode,
  currencyCode: CurrencyCodeRecord
) => {
  try {
    await pg.query('BEGIN');
    for (const product of products) {
      const {
        id: productId,
        name,
        description,
        categories,
        variations,
      } = product;
      await saveProduct(pg, productId);
      await saveProductName(pg, productId, name, langCode);
      await saveProductDescription(pg, productId, description, langCode);

      for (const category of categories) {
        const { id: categoryId, name: categoryName } = category;
        await saveCategory(pg, categoryId);
        await saveCategoryName(pg, categoryId, categoryName, langCode);
        await saveProductCategory(pg, productId, categoryId);
      }

      for (const variation of variations) {
        const variationId: string = await saveVariation(
          pg,
          productId,
          variation
        );
        const currencyId: string = await saveCurrency(pg, currencyCode);
        await saveVariationPrice(pg, variationId, currencyId, variation.price);
      }
    }
    await pg.query('COMMIT');
  } catch (err) {
    await pg.query('ROLLBACK');
    console.log(err);
    throw Boom.internal('Failed to save product! RIP!!');
  }
};

export const getProducts = async (
  pg: PoolClient,
  langCode: LanguageCode,
  currencyCode: CurrencyCodeRecord
) => {
  const { rows } = await pg.query(
    `
          SELECT
                  p.id,
                  pn.product_name AS name,
                  pd.product_description AS description,
                  (
                    SELECT JSON_AGG (
                             JSON_BUILD_OBJECT (
                               'id', c.id,
                               'name', cn.category_name
                             )
                           )
                      FROM product_categories pc
                      JOIN categories c ON pc.category_id = c.id
                      JOIN category_names cn ON c.id = cn.category_id
                     WHERE pc.product_id = p.id
                       AND cn.lang_code = $1
                  ) AS categories,
                  (
                    SELECT JSON_AGG (
                             JSON_BUILD_OBJECT (
                               'price', vp.price,
                               'currency_number', vp.currency_id,
                               'attributes', v.attributes
                             )
                           )
                      FROM product_variations v
                      JOIN variation_prices vp ON v.id = vp.variation_id
                     WHERE v.product_id = p.id
                       AND vp.currency_id = $2
                  ) AS variations
            FROM products p
            JOIN product_names pn ON pn.product_id = p.id
            JOIN product_descriptions pd ON pd.product_id = p.id
           WHERE pn.lang_code = $1
             AND pd.lang_code = $1
    `,
    [langCode, currencyCode.number]
  );
  if (rows.length === 0) {
    return [];
  }

  return rows.map((row) => ({
    ...row,
    variations: row.variations.map((variation: Variation) => ({
      price: `${variation.price} ${getCurrencyName(JSON.stringify(variation.currency_number))}`,
      ...(variation.attributes as object),
    })),
  }));
};
