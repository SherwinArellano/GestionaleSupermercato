import { Sale } from '@/types/db';
import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema<Sale>({
  id: {
    type: Number,
    unique: true,
  },
  receiptCode: String,
  totalPrice: Number,
  saleDate: Date,
  products: [Number],
});

export const SaleModel: mongoose.Model<Sale> =
  mongoose.models.Sale || mongoose.model<Sale>('Sale', saleSchema);
