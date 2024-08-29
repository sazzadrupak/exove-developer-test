type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export interface Variation {
  price: number;
  [k: string]: JSONValue;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categories: Category[];
  variations: Variation[];
}

export interface Data {
  products: Product[];
  results: number;
}
