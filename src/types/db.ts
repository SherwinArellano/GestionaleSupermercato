export * from './entities/category';
export * from './entities/product';
export * from './entities/supplier';
export * from './entities/stock';
export * from './entities/user';

export type GetAll<Entity> = {
  data: Entity[];
  pageSize: number; // how many elements per page
  elementsSize: number; // how many elements returned
  currentPage: number;
  totalPages: number;
  totalElements: number;
};
