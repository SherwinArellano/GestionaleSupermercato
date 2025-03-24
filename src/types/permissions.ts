export const ViewPermissions = [
  'view-overview',
  'view-products',
  'view-stocks',
  'view-suppliers',
  'view-sales',
  'view-discounts',
  'view-promotions',
  'view-users',
  'view-analytics',
] as const;

export const CreatePermissions = [
  'create-product',
  'create-stock',
  'create-supplier',
  'create-sale',
  'create-discount',
  'create-promotion',
  'create-user',
] as const;

export const EditPermissions = [
  'edit-product',
  'edit-stock',
  'edit-supplier',
  'edit-sale',
  'edit-discount',
  'edit-promotion',
  'edit-user',
] as const;

export const DeletePermissions = [
  'delete-product',
  'delete-stock',
  'delete-supplier',
  'delete-sale',
  'delete-discount',
  'delete-promotion',
  'delete-user',
] as const;

export type Permission =
  | (typeof ViewPermissions)[number]
  | (typeof CreatePermissions)[number]
  | (typeof EditPermissions)[number]
  | (typeof DeletePermissions)[number];
