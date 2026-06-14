import Dexie, { Table } from 'dexie';

export interface Store {
  id: string;
  name: string;
}

export interface Product {
  barcode: string;
  name: string;
}

export interface Price {
  id: string;
  storeId: string;
  barcode: string;
  price: number;
  updatedAt: number;
}

export interface CartItem {
  id: string;
  barcode: string | null;
  name: string;
  price: number;
  quantity: number;
}

export class ScanCartDB extends Dexie {
  stores!: Table<Store, string>;
  products!: Table<Product, string>;
  prices!: Table<Price, string>;
  cart!: Table<CartItem, string>;

  constructor() {
    super('ScanCartDB');
    this.version(1).stores({
      stores: 'id',
      products: 'barcode',
      prices: 'id, storeId, barcode, [storeId+barcode]',
      cart: 'id'
    });
  }
}

export const db = new ScanCartDB();
