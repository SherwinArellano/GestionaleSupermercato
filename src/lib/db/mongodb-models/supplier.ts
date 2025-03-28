import { Supplier } from '@/types/db';
import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema<Supplier>({
  id: {
    type: Number,
    unique: true,
  },
  address: String,
  email: String,
  name: String,
  phoneNumber: String,
});

export const SupplierModel: mongoose.Model<Supplier> =
  mongoose.models.Supplier ||
  mongoose.model<Supplier>('Supplier', supplierSchema);
