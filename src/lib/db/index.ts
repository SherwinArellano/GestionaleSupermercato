import instance from './instance';
import * as products from './products';
import * as sales from './sales';
import * as stocks from './stocks';
import * as suppliers from './suppliers';
import * as users from './users';

const db = {
  instance,
  products,
  sales,
  stocks,
  suppliers,
  users,
};

export default db;
