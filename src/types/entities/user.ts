import { Role } from '@/types/roles';

export interface User {
  operatorCode: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: Role;
}
