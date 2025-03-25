# Entity Workflow (March 25, 2025)

The current workflow of introducing new entities as of this date.

## Workflow Example

This example uses the `Supplier` entity.

1. Create entity types

```ts
// src/types/entities/supplier.ts

export interface Supplier {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
}

export type CreateSupplierDTO = Omit<Supplier, 'id'>;

export type UpdateSupplierDTO = CreateSupplierDTO;
```

The reason why `UpdateSupplierDTO = CreateSupplierDTO` to be consistent with the `Product`'s entity types and because the backend requires it. However, currently the `Supplier` controller does not exist yet.

2. Export entity type

```ts
// src/types/db.ts

export * from './entities/supplier';
// other exports...
```

3. Create zod entity

Zod is a library used for data validation.

```ts
// src/lib/entities/supplier.ts

import { CreateSupplierDTO } from '@/types/db';
import { z } from 'zod';

export const SupplierSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  address: z.string().min(1, { message: 'Address is required.' }),
  email: z.string().min(1, { message: 'Address is required.' }),
  phoneNumber: z.string().min(1, { message: 'Address is required.' }),
} satisfies Record<keyof CreateSupplierDTO, any>);

export type SupplierValues = z.infer<typeof SupplierSchema>;
```

We use `satisfies` so we get autocompletion on which properties to validate and also to throw eslint errors if the supplier's create DTO changes.

4. Create db functions

```ts
// src/lib/db/suppliers.ts

import { CreateSupplierDTO, Supplier, UpdateSupplierDTO } from '@/types/db';

type GetAll<Entity> = {
  data: Entity[];
  pageSize: number; // how many elements per page
  elementsSize: number; // how many elements returned
  currentPage: number;
  totalPages: number;
  totalElements: number;
};

export const get = async (): Promise<GetAll<Supplier>> => {
  return {
    data: [],
    pageSize: 20,
    elementsSize: 0,
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
  };
};

export const getById = async (id: number): Promise<Supplier> => {
  return null;
};

export const create = async (data: CreateSupplierDTO): Promise<string> => {
  return 'New supplier has been added.';
};

export const updateById = async (
  id: number,
  data: UpdateSupplierDTO
): Promise<string> => {
  return `Supplier with id ${id} has been updated.`;
};

export const deleteById = async (id: number): Promise<string> => {
  return `Supplier with id ${id} has been deleted.`;
};
```

For now the return types are as you see.

Inside each function has an API call to database. For simplicity, those aren't added in the code block above.

`GetAll<Entity>` is a db type utility and is place outside of `Supplier` but for illustrative purposes, it's there.

5. Export db functions

```ts
// src/lib/db/index.ts

import * as suppliers from './suppliers';

const db = {
  suppliers,
  // other exports...
};

export default db;
```

We're exporting the functions in an index file to make db interactions import and interaction seamless. Inspired by how Mongoose communicates with the database. For example, creating a new supplier becomes `db.suppliers.create(...)`.
