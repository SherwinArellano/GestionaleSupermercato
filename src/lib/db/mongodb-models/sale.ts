import { Sale, SaleProduct } from '@/types/db';
import mongoose from 'mongoose';

const saleProductSchema = new mongoose.Schema<SaleProduct>(
  {
    id: Number,
    quantity: Number,
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema<Sale>({
  id: {
    type: Number,
    unique: true,
  },
  receiptCode: String,
  totalPrice: Number,
  saleDate: Date,
  products: [saleProductSchema],
});

export const SaleModel: mongoose.Model<Sale> =
  mongoose.models.Sale || mongoose.model<Sale>('Sale', saleSchema);
