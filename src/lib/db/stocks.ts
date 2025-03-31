import {
  CreateStockDTO,
  GetAll,
  Stock,
  Supplier,
  UpdateStockDTO,
} from '@/types/db';
import { AxiosError } from 'axios';
import { dbConnect } from '../mongodbConnect';
import { StockModel } from './mongodb-models/stock';

export type MongoStock = Stock & { supplier: Supplier };

export const get = async (): Promise<GetAll<MongoStock>> => {
  await dbConnect();

  const stocks = (await StockModel.find({}, { _id: 0 })
    .populate('supplier', { _id: 0 })
    .lean()) as unknown as MongoStock[];

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

export const getById = async (id: number): Promise<MongoStock> => {
  await dbConnect();

  const stock = (await StockModel.findOne({ id }, { _id: 0 })
    .populate('supplier', { _id: 0 })
    .lean()) as unknown as MongoStock;

  // The reason why I'm throwing is because I'm simulating the
  // real backend's response.
  if (!stock) throw new AxiosError('Stock not found.');
  return stock;
};

export type LatestStockInfo = {
  id: number;
  totalQuantity: number;
  latestArrivalDate: Date;
  latestExpiryDate: Date;
};

export const groupByLatestInfo = async (): Promise<
  Map<number, LatestStockInfo>
> => {
  await dbConnect();

  const elements = await StockModel.aggregate<
    Omit<LatestStockInfo, 'id'> & { _id: number }
  >().group({
    _id: '$productId',
    totalQuantity: { $sum: '$quantity' },
    latestArrivalDate: { $max: '$arrivalDate' },
    latestExpiryDate: { $min: '$expiryDate' },
  });

  const map = new Map<number, LatestStockInfo>();
  elements.forEach(({ _id, ...data }) => map.set(_id, { id: _id, ...data }));

  return map;
};

export const create = async (data: CreateStockDTO): Promise<string> => {
  await dbConnect();

  const highestId =
    (await StockModel.findOne().sort({ id: -1 }).limit(1))?.id ?? 1;
  await StockModel.create({
    id: highestId + 1,
    ...data,
  } satisfies Stock);
  return 'New stock has been added.';
};

export const updateById = async (
  id: number,
  data: UpdateStockDTO
): Promise<string> => {
  await dbConnect();

  const response = await StockModel.updateOne({ id }, {
    id,
    ...data,
  } satisfies Stock);

  if (response.modifiedCount === 0) {
    return `Stock with ${id} could not be updated! It may not exists.`;
  }

  return `Stock with id ${id} has been updated.`;
};

export const deleteById = async (id: number): Promise<string> => {
  await dbConnect();

  const response = await StockModel.deleteOne({ id });

  if (response.deletedCount === 0) {
    return `Stock with ${id} could not be deleted! It may not exists.`;
  }

  return `Stock with id ${id} has been deleted.`;
};
