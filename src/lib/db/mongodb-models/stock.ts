import { Stock } from '@/types/db';
import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema<Stock>({
  id: {
    type: Number,
    unique: true,
  },
  arrivalDate: Date,
  expiryDate: Date,
  productId: Number,
  supplierId: Number,
  quantity: Number,
});

stockSchema.virtual('supplier', {
  ref: 'Supplier',
  localField: 'supplierId',
  foreignField: 'id',
  justOne: true,
});

export const StockModel: mongoose.Model<Stock> =
  mongoose.models.Stock || mongoose.model<Stock>('Stock', stockSchema);
