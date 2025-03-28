'use server';

import { User } from '@/types/entities/user';
import { dbConnect } from '../mongodbConnect';
import { UserModel } from './mongodb-models/user';

// For now I'm hardcoding accounts since backend authentication is currently in development.
const sampleUsers: User[] = [
  {
    email: 's.arellano@esis-italia.com',
    name: 'Sherwin',
    surname: 'Arellano',
    operatorCode: '53d377d0b552b97f3bae71330874414d',
    password: '$2b$10$Z/NrIFiP2Nu0XKZiApO4yu1AUegMHqIWhfbtZjbiroEaBILfdZC5G',
    role: 'admin',
    image:
      'https://lh3.googleusercontent.com/ogw/AF2bZyhKxTjxBu6zYlgeK5tWjAz79wnYLo0FAcmS7u9n_AFSjY0',
  } as User,
  {
    email: 'm.mantovani@esis-italia.com',
    name: 'Michael',
    surname: 'Mantovani',
    operatorCode: '3c0ce28a61407f1d1457e193ee6f9250',
    password: '$2b$10$BwLBmYz8w0OfNqZCwYTvWuIM5fmNDcs0Ksi33z/XvoAQn1qcRfHRC',
    role: 'admin',
  },
  {
    email: 'm.ciaccio@esis-italia.com',
    name: 'Michela',
    surname: 'Ciaccio',
    operatorCode: 'd567df5b7e1b0d2c74393df8be3a60a5',
    password: '$2b$10$tfcqxGHCs51pROE9E9LJ1eyuhkckYfMqo/.IoduMxJKlpaedEGIfa',
    role: 'admin',
  },
  {
    email: 'manager@supermarketos-example.com',
    name: 'Manager',
    surname: 'Example',
    operatorCode: '5411b230f1bbed41a62b87bb58d27bdc',
    password: '$2b$10$M9V5DcTixHSWMiSPEkL/WuMEVEdIAwZIPlfuZI611H86TxVmuKyqu',
    role: 'manager',
  },
  {
    email: 'cashier@supermarketos-example.com',
    name: 'Cashier',
    surname: 'Example',
    operatorCode: 'b845e0e7402daf5dd5d5dae216fc8fc3',
    password: '$2b$10$SM6/I3MdliwzwGZ.BaUYzeegkU8lymS.Oj6EPqHmQ6P1QfklDnd.G',
    role: 'cashier',
  },
];

/**
 * Populate the mongodb database with sample users.
 */
export const register = async (): Promise<string> => {
  await dbConnect();

  try {
    await Promise.all(
      sampleUsers.map(async (user) => {
        await UserModel.create(user);
        console.log(`${user.name} has been inserted to db.`);
      })
    );
    return 'Successfully populated!';
  } catch (error) {
    console.error(error);
    return 'An error has occurred';
  }
};

export const get = async (): Promise<User[]> => {
  await dbConnect();

  const users = await UserModel.find();

  return users;
};

export const getByEmail = async (email: string): Promise<User | null> => {
  await dbConnect();

  const user = await UserModel.findOne().where('email', email).lean();

  return user ?? null;
};
