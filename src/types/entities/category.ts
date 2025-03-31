export interface Category {
  id: number;
  name: string;
}

export type CreateCategoryDTO = Omit<Category, 'id'>;
export type UpdateCategoryDTO = Omit<Category, 'id'>;
