'use server';

import { auth } from '@/auth';
import { checkPermission } from '@/authorization';
import { Permission } from '@/types/permissions';

export async function isAuthorized(permission: Permission): Promise<boolean> {
  const session = await auth();
  return Boolean(
    session?.user && checkPermission(session.user.role, permission)
  );
}
