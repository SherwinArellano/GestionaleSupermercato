import Link from 'next/link';
import { DropdownMenuItem } from '../../dropdown-menu';
import { Product } from '@/types/db';
import { auth } from '@/auth';
import { checkPermission } from '@/authorization';
import { use } from 'react';

export function EditDropdownMenuItem({ product }: { product: Product }) {
  const session = use(auth());

  if (!session?.user || checkPermission(session.user.role, 'edit-product')) {
    return null;
  }

  return (
    <DropdownMenuItem asChild>
      <Link href={`/dashboard/products/${product.id}/edit`}>Edit</Link>
    </DropdownMenuItem>
  );
}
