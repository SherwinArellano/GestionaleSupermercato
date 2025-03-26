import instance from './instance';
import * as products from './products';
import * as users from './users';
import * as suppliers from './suppliers';
import * as stocks from './stocks';

const db = {
  instance,
  products,
  suppliers,
  stocks,
  users,
};

export default db;
