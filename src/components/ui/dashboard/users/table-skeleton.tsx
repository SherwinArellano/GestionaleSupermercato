import { DataTableSkeleton } from '../../data-table';
import { UserSkeleton, skeletonColumns } from './columns';

export function UsersTableSkeleton() {
  const data = Array.from(Array(20)).map<UserSkeleton>(() => ({
    name: Math.floor(Math.random() * 110 + 50),
    surname: Math.floor(Math.random() * 110 + 50),
    email: Math.floor(Math.random() * 110 + 50),
    role: Math.floor(Math.random() * 30 + 40),
  }));

  return (
    <DataTableSkeleton label="users" columns={skeletonColumns} data={data} />
  );
}
