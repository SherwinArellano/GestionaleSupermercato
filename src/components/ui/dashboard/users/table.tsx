import db from '@/lib/db';
import { columns } from './columns';
import { User } from '@/types/db';
import { isAxiosError } from 'axios';
import { DataTable } from '../../data-table';

type UsersTableProps = {
  search: string;
  currentPage: number;
  order: 'asc' | 'desc';
  sort: string;
};

export async function UsersTable({
  search,
  currentPage,
  order,
  sort,
}: UsersTableProps) {
  let users: User[];
  let totalPages = 1;
  let isError = false;

  try {
    // For now, this is getting all users.
    users = await db.users.get();
    totalPages = Math.ceil(
      users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))
        .length / 20
    );
  } catch (e) {
    if (isAxiosError(e) && e.code === 'ECONNREFUSED') {
      isError = true;
    }

    users = [];
  }

  return (
    <DataTable
      label="users"
      search={search}
      currentPage={currentPage}
      totalPages={totalPages}
      order={order}
      sort={sort}
      columns={columns}
      data={users}
      isError={isError}
    />
  );
}
