CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE products (
  id uuid PRIMARY KEY
);

CREATE TABLE product_names (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  lang_code CHAR(2),
  PRIMARY KEY (product_id, lang_code),
  product_name VARCHAR(255) NOT NULL
);

CREATE TABLE product_descriptions (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  lang_code CHAR(2),
  PRIMARY KEY (product_id, lang_code),
  product_description TEXT NOT NULL
);


CREATE TABLE categories (
  id uuid PRIMARY KEY
);

CREATE TABLE category_names (
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  lang_code CHAR(2),
  PRIMARY KEY (category_id, lang_code),
  category_name TEXT NOT NULL
);

CREATE TABLE product_categories (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

CREATE TABLE product_variations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id),
  attributes JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE UNIQUE INDEX idx_product_variation_attributes
ON product_variations(product_id, attributes);

CREATE TABLE currencies(
  id CHAR(3) PRIMARY KEY
);

CREATE TABLE variation_prices (
  variation_id uuid REFERENCES product_variations(id) ON DELETE CASCADE,
  currency_id CHAR(3) REFERENCES currencies(id) ON DELETE CASCADE,
  PRIMARY KEY (variation_id, currency_id),
  price DECIMAL NOT NULL
);