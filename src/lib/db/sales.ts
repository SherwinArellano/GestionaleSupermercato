import { CreateSaleDTO, Sale, UpdateSaleDTO } from '@/types/db';
import { dbConnect } from '../mongodbConnect';
import { SaleModel } from './mongodb-models/sale';
import { generateCode } from '../utils';
import { AxiosError } from 'axios';

export const get = async (): Promise<Sale[]> => {
  await dbConnect();

  const sales = await SaleModel.find({}, { _id: 0 }).lean();

  return sales;
};

export const getSortedByDate = async (): Promise<Sale[]> => {
  await dbConnect();

  const sales = await SaleModel.find({}, { _id: 0 })
    .sort({ saleDate: -1 })
    .lean();

  return sales;
};

export const getOverallPrice = async (): Promise<number> => {
  await dbConnect();

  const response = await SaleModel.aggregate<{ overallPrice: number }>().group({
    _id: null,
    overallPrice: { $sum: '$totalPrice' },
  });

  return response[0].overallPrice;
};

export const groupBySaleProducts = async (): Promise<Map<number, number>> => {
  await dbConnect();

  const elements = await SaleModel.aggregate<{
    productId: number;
    totalSales: number;
  }>()
    .unwind('products')
    .group({
      _id: '$products.id',
      totalSales: { $sum: '$products.quantity' },
    })
    .project({
      _id: 0,
      productId: '$_id',
      totalSales: 1,
    });

  const map = new Map<number, number>();
  elements.forEach(({ productId, totalSales }) =>
    map.set(productId, totalSales)
  );

  return map;
};

export const create = async (data: CreateSaleDTO): Promise<string> => {
  await dbConnect();

  const highestId =
    (await SaleModel.findOne().sort({ id: -1 }).limit(1))?.id ?? 1;

  await SaleModel.create({
    id: highestId + 1,
    receiptCode: generateCode(),
    ...data,
  } satisfies Sale);

  return 'New sale has been added.';
};

export const getById = async (id: number): Promise<Sale> => {
  await dbConnect();

  const sale = await SaleModel.findOne({ id }, { _id: 0 }).lean();

  if (!sale) throw new AxiosError('Sale not found.');
  return sale;
};

export const updateById = async (
  id: number,
  data: UpdateSaleDTO
): Promise<string> => {
  await dbConnect();

  const response = await SaleModel.updateOne({ id }, {
    id,
    ...data,
  } satisfies Sale);

  if (response.modifiedCount === 0) {
    return `Sale with id ${id} could not be updated! It may not exists.`;
  }

  return `Sale with id ${id} has been updated.`;
};

export const deleteById = async (id: number): Promise<string> => {
  await dbConnect();

  const response = await SaleModel.deleteOne({ id });

  if (response.deletedCount === 0) {
    return `Sale with id ${id} could not be deleted! It may not exists.`;
  }

  return `Sale with id ${id} has been deleted.`;
};
