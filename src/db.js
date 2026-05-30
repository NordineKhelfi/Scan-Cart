import Dexie from 'dexie';

export const db = new Dexie('GroceryScannerDB');

db.version(1).stores({
  stores: 'id, name', 
  products: 'barcode, name', 
  prices: 'id, storeId, barcode, price, updatedAt', 
  cart: 'id, barcode, name, price, quantity' 
});

db.version(2).stores({
  stores: 'id, name', 
  products: 'barcode, name', 
  prices: 'id, storeId, barcode, price, updatedAt, [storeId+barcode]', 
  cart: 'id, barcode, name, price, quantity' 
});
