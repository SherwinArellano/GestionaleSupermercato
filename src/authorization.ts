import {
  CreatePermissions,
  DeletePermissions,
  EditPermissions,
  Permission,
  ViewPermissions,
} from './types/permissions';
import { Role } from './types/roles';

const authorization: Record<Role, Permission[]> = {
  admin: [
    ...ViewPermissions,
    ...CreatePermissions,
    ...EditPermissions,
    ...DeletePermissions,
  ],
  manager: [
    'view-products',
    'view-stocks',
    'view-suppliers',
    'create-product',
    'edit-product',
    'delete-product',
    'create-stock',
    'edit-stock',
    'delete-stock',
    'create-supplier',
    'edit-supplier',
    'delete-supplier',
  ],
  cashier: [
    'view-sales',
    'view-discounts',
    'view-promotions',
    'create-sale',
    'edit-sale',
    'delete-sale',
    'create-discount',
    'edit-discount',
    'delete-discount',
    'create-promotion',
    'edit-promotion',
    'delete-promotion',
  ],
};

export function checkPermission(role: Role, permission: Permission) {
  return authorization[role].includes(permission);
}

export function checkUrlPermission(role: Role, url: string) {
  let path = url.substring(1);

  if (role === 'admin' && path === '') return true; // overview page

  let index: number | undefined = path.indexOf('/');
  if (index < 0) index = path.indexOf('?');
  if (index < 0) index = undefined;
  path = path.substring(0, index);

  return checkPermission(role, `view-${path}` as Permission);
}
