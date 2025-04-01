import { CreateSaleDTO, Sale } from '@/types/db';
import { dbConnect } from '../mongodbConnect';
import { SaleModel } from './mongodb-models/sale';
import { generateCode } from '../utils';

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

export const deleteById = async (id: number): Promise<string> => {
  await dbConnect();

  const response = await SaleModel.deleteOne({ id });

  if (response.deletedCount === 0) {
    return `Sale with id ${id} could not be deleted! It may not exists.`;
  }

  return `Sale with id ${id} has been deleted.`;
};
