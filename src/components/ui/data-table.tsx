'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import * as Tanstack from '@tanstack/react-table';
import {
  ArrowDown01,
  ArrowDownAZ,
  ArrowUp01,
  ArrowUpAZ,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ServerOff,
  Settings2,
} from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

export class ColumnsBuilder<
  TData extends Tanstack.RowData,
  TSkeletonData extends Tanstack.RowData,
> {
  private columns: Tanstack.ColumnDef<TData>[] = [];
  private skeletons: Tanstack.ColumnDef<TSkeletonData>[] = [];

  addColumn(
    column: Tanstack.ColumnDef<TData>,
    skeleton: Tanstack.ColumnDef<TSkeletonData>
  ): this {
    this.columns.push(column);
    this.skeletons.push(skeleton);
    return this;
  }

  build(): [
    columns: Tanstack.ColumnDef<TData>[],
    skeletons: Tanstack.ColumnDef<TSkeletonData>[],
  ] {
    return [this.columns, this.skeletons];
  }
}

export function DataTableSkeleton<TData, TValue>({
  label,
  data,
  columns,
}: {
  label: string;
  data: TData[];
  columns: Tanstack.ColumnDef<TData, TValue>[];
}) {
  const table = Tanstack.useReactTable({
    data,
    columns,
    getCoreRowModel: Tanstack.getCoreRowModel(),
  });

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={header.id === 'actions' ? 'w-8' : ''}
                    >
                      {header.isPlaceholder
                        ? null
                        : Tanstack.flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {Tanstack.flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No {label} yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTableFooterSkeleton />
    </>
  );
}

export function DataTable<TData, TValue>({
  label,
  columns,
  data,
  search,
  currentPage,
  totalPages,
  order,
  sort,
  isError,
}: {
  label: string;
  columns: Tanstack.ColumnDef<TData, TValue>[];
  data: TData[];
  isError?: boolean;
  // WARNING: Data filtering, sorting, and processing must be done by the backend.
  // For now, this will be handled in the client with the following
  // helper props:
  search?: string;
  currentPage?: number;
  totalPages?: number;
  order?: 'asc' | 'desc';
  sort?: string;
}) {
  const table = Tanstack.useReactTable({
    data,
    columns,
    getCoreRowModel: Tanstack.getCoreRowModel(),
    // WARNING: This is paginating in the client, use backend pagination in the future.
    getPaginationRowModel: Tanstack.getPaginationRowModel(),
    // WARNING: This is sorting in the client, use backend sorting in the future.
    getSortedRowModel: Tanstack.getSortedRowModel(),
    getFilteredRowModel: Tanstack.getFilteredRowModel(),
    initialState: {
      pagination: { pageIndex: (Number(currentPage) || 1) - 1, pageSize: 20 },
    },
  });

  useEffect(() => {
    if (!currentPage) return;
    table.setPagination({ pageIndex: currentPage - 1, pageSize: 20 });
  }, [table, currentPage]);

  useEffect(() => {
    if (!search) return;
    table.getColumn('name')?.setFilterValue(search);
  }, [table, search]);

  useEffect(() => {
    if (!sort || !order) return;
    table.getColumn(sort)?.toggleSorting(order === 'desc');
  }, [table, order, sort]);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={header.id === 'actions' ? 'w-8' : ''}
                    >
                      {header.isPlaceholder
                        ? null
                        : Tanstack.flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <TableBodyContent label={label} table={table} isError={isError} />
          </TableBody>
        </Table>
      </div>

      <DataTableFooter
        currentPage={currentPage ?? 1}
        totalPages={totalPages ?? 1}
      />
    </>
  );
}

function TableBodyContent<TData extends Tanstack.RowData>({
  label,
  table,
  isError,
}: {
  label: string;
  table: Tanstack.Table<TData>;
  isError?: boolean;
}) {
  if (isError) {
    return (
      <TableRow>
        <TableCell colSpan={table._getColumnDefs().length} className="h-72">
          <span className="flex justify-center gap-2.5">
            <ServerOff />
            Could not fetch {label}.
          </span>
        </TableCell>
      </TableRow>
    );
  }

  if (table.getRowModel().rows?.length === 0) {
    return (
      <TableRow>
        <TableCell
          colSpan={table._getColumnDefs().length}
          className="h-72 text-center"
        >
          No {label} yet.
        </TableCell>
      </TableRow>
    );
  }

  return table.getRowModel().rows.map((row) => (
    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {Tanstack.flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  ));
}

export function SearchInput(props: React.ComponentProps<'input'>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    params.set('page', '1');

    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Input
      {...props}
      onChange={(e) => handleSearch(e.target.value)}
      defaultValue={searchParams.get('search')?.toString()}
    />
  );
}

/**
 * @deprecated In favor of SearchInput, this component is marked to be removed
 *             once the new table logic with query parameters is implemented.
 */
export function InputFilter<TData extends Tanstack.RowData>({
  table,
  className,
  ...props
}: React.ComponentProps<'input'> & {
  table: Tanstack.Table<TData>;
}) {
  return (
    <Input
      value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
      onChange={(event) =>
        table.getColumn('name')?.setFilterValue(event.target.value)
      }
      className={className}
      {...props}
    />
  );
}

export function ViewColumnsFilterDropdown<TData extends Tanstack.RowData>({
  table,
  className,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  } & {
    table: Tanstack.Table<TData>;
  }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn('cursor-pointer', className)}
          {...props}
        >
          <Settings2 />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DataTableFooterSkeleton() {
  return (
    <div className="space-x-2 py-4">
      <PaginationSkeleton />
    </div>
  );
}

export function DataTableFooter({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  return (
    <div className="space-x-2 py-4">
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}

export function PaginationSkeleton() {
  return (
    <div className="flex flex-1 justify-between gap-2.5">
      <div className="space-x-2">
        <Button
          variant="outline"
          className="h-8 w-8 cursor-pointer p-0"
          disabled
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 cursor-pointer p-0"
          disabled
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft />
        </Button>
      </div>

      <div className="flex items-center text-sm font-medium">Page 1 of 1</div>

      <div className="space-x-2">
        <Button
          variant="outline"
          className="h-8 w-8 cursor-pointer p-0"
          disabled
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 cursor-pointer p-0"
          disabled
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
}

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const nextPage = () => {
    const params = new URLSearchParams(searchParams);

    const next = (Number(params.get('page')) || 1) + 1;

    if (next <= totalPages) {
      params.set('page', next.toString());
      replace(`${pathname}?${params.toString()}`);
    }
  };

  const prevPage = () => {
    const params = new URLSearchParams(searchParams);

    const prev = (Number(params.get('page')) || 1) - 1;

    if (prev >= 1) {
      params.set('page', prev.toString());
      replace(`${pathname}?${params.toString()}`);
    }
  };

  const firstPage = () => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
  };

  const lastPage = () => {
    const params = new URLSearchParams(searchParams);
    params.set('page', totalPages.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-1 justify-between gap-2.5">
      <div className="space-x-2">
        <Button
          variant="outline"
          className="h-8 w-8 cursor-pointer p-0"
          onClick={firstPage}
          disabled={currentPage <= 1}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 cursor-pointer p-0"
          onClick={prevPage}
          disabled={currentPage <= 1}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft />
        </Button>
      </div>

      <div className="flex items-center text-sm font-medium">
        Page {currentPage} of {totalPages}
      </div>

      <div className="space-x-2">
        <Button
          variant="outline"
          className="h-8 w-8 cursor-pointer p-0"
          onClick={nextPage}
          disabled={currentPage >= totalPages}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 cursor-pointer p-0"
          onClick={lastPage}
          disabled={currentPage >= totalPages}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
}

export function SelectAllCheckbox<TData extends Tanstack.RowData>({
  table,
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  table: Tanstack.Table<TData>;
}) {
  return (
    <Checkbox
      className={cn('cursor-pointer', className)}
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && 'indeterminate')
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
      {...props}
    />
  );
}

export function SelectCheckbox<TData extends Tanstack.RowData>({
  row,
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  row: Tanstack.Row<TData>;
}) {
  return (
    <Checkbox
      className={cn('cursor-pointer', className)}
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
      {...props}
    />
  );
}

export function SortTableHeadSkeleton({
  title,
  className,
  number,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  } & {
    title: ReactNode;
    number?: boolean;
  }) {
  return (
    <Button
      type="button"
      className={cn('cursor-pointer', className)}
      variant="ghost"
      {...props}
    >
      {title}
      {number ? <ArrowDown01 /> : <ArrowDownAZ />}
    </Button>
  );
}

export function SortTableHead({
  title,
  value,
  className,
  desc,
  number,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  } & {
    title: ReactNode;
    value: string;
    desc?: boolean;
    number?: boolean;
  }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const sort = () => {
    const params = new URLSearchParams(searchParams);
    const order = params.get('order') || 'asc';

    params.set('page', '1');
    params.set('order', order === 'asc' ? 'desc' : 'asc');
    params.set('sort', value);

    replace(`${pathname}?${params.toString()}`);
  };

  const alphaArrows = desc ? <ArrowUpAZ /> : <ArrowDownAZ />;
  const numberArrows = desc ? <ArrowUp01 /> : <ArrowDown01 />;
  const arrows = number ? numberArrows : alphaArrows;

  return (
    <Button
      type="button"
      className={cn('cursor-pointer', className)}
      variant="ghost"
      onClick={sort}
      {...props}
    >
      {title}
      {arrows}
    </Button>
  );
}

export function getHeadSortState<TData extends Tanstack.RowData>(
  context: Tanstack.HeaderContext<TData, unknown>
) {
  const { table, header } = context;
  return table.getState().sorting.find((sort) => sort.id === header.id)?.desc;
}
