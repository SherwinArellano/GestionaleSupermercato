import { CreateStockDTO, GetAll, Stock, UpdateStockDTO } from '@/types/db';
import { AxiosError } from 'axios';

// For now I'm hardcoding stocks since backend doesn't currently support them.
// This trick persists data in memory storage when going through different imports
declare global {
  // eslint-disable-next-line no-var
  var stocksDb: { data: Stock[]; autoId: number };
}

globalThis.stocksDb = globalThis.stocksDb ?? {
  autoId: 1,
  data: [],
};

export const get = async (): Promise<GetAll<Stock>> => {
  const stocks = stocksDb.data;
  return {
    data: stocks,
    // For now, I'm returning everything since the client occupies of
    // pagination, sorting, and filtering.
    pageSize: stocks.length,
    elementsSize: stocks.length,
    currentPage: 1,
    totalPages: 1,
    totalElements: stocks.length,
  };
};

export const getById = async (id: number): Promise<Stock> => {
  const stocks = stocksDb.data;
  const stock = stocks.find((stock) => stock.id === id);
  if (!stock) throw new AxiosError('Stock not found.');
  return stock;
};

export const create = async (data: CreateStockDTO): Promise<string> => {
  const { data: stocks, autoId } = stocksDb;
  stocks.push({
    id: autoId,
    ...data,
  });
  stocksDb.autoId++;
  return 'New stock has been added.';
};

export const updateById = async (
  id: number,
  data: UpdateStockDTO
): Promise<string> => {
  const stocks = stocksDb.data;
  const stock = stocks.find((stock) => stock.id === id);
  if (!stock) throw new AxiosError('Stock not found.');
  Object.assign(stock, data);
  return `Stock with id ${id} has been updated.`;
};

export const deleteById = async (id: number): Promise<string> => {
  const stocks = stocksDb.data;
  const index = stocks.findIndex((stock) => stock.id === id);
  if (index < 0) throw new AxiosError('Stock not found.');
  stocks.splice(index, 1);
  return `Stock with id ${id} has been deleted.`;
};
