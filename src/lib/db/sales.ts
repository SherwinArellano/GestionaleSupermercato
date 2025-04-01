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
