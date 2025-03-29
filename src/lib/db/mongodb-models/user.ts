import { User } from '@/types/db';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema<User>({
  operatorCode: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  name: String,
  surname: String,
  password: String,
  role: String,
});

export const UserModel: mongoose.Model<User> =
  mongoose.models.User || mongoose.model<User>('User', userSchema);
