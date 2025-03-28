/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from '@/data/env/server';
import mongoose from 'mongoose';

let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = (global as any).mongoose || { conn: null, promise: null };

if (!cached) {
  cached = { conn: null, promise: null };
  (global as any).mongoose = cached;
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGODB_URL, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
