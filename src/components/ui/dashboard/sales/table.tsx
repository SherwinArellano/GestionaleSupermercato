import db from '@/lib/db';
import { Product, PSale, PSaleProduct } from '@/types/db';
import { isAxiosError } from 'axios';
import { DataTable } from '../../data-table';
import { columns } from './columns';

type SalesTableProps = {
  search: string;
  currentPage: number;
  order: 'asc' | 'desc';
  sort: string;
};

export async function SalesTable({
  search,
  currentPage,
  order,
  sort,
}: SalesTableProps) {
  let sales: PSale[];
  let totalPages = 1;
  let isError = false;

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // For now, this is getting all sales.
    const response = await db.sales.get();

    // Populate sales
    const products = await db.products.getAll();
    const deletedProduct: Product = {
      id: -1,
      name: 'Deleted product',
      sellingPrice: 0,
      stocks: [],
      category: {
        id: -1,
        name: 'Unknown',
      },
    };

    sales = response.map(({ products: saleProducts, ...sale }) => ({
      products: saleProducts.map<PSaleProduct>(({ id, quantity }) => {
        const product = products.find((p) => p.id === id) ?? deletedProduct;
        return {
          quantity,
          ...product,
        };
      }),
      ...sale,
    }));

    totalPages = Math.ceil(sales.length / 20);
  } catch (e) {
    if (isAxiosError(e) && e.code === 'ECONNREFUSED') {
      isError = true;
    }

    sales = [];
  }

  return (
    <DataTable
      label="sales"
      currentPage={currentPage}
      totalPages={totalPages}
      search={search}
      searchName="receiptCode"
      order={order}
      sort={sort}
      columns={columns}
      data={sales}
      isError={isError}
    />
  );
}
