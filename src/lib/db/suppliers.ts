import {
  CreateSupplierDTO,
  GetAll,
  Supplier,
  UpdateSupplierDTO,
} from '@/types/db';
import { AxiosError } from 'axios';

// For now I'm hardcoding suppliers since backend doesn't currently support them.
// This trick persists data in memory storage when going through different imports
declare global {
  // eslint-disable-next-line no-var
  var suppliersDb: { data: Supplier[]; autoId: number };
}

globalThis.suppliersDb = globalThis.suppliersDb ?? {
  autoId: 31,
  data: [
    {
      id: 1,
      name: 'Global Electronics Inc.',
      address: '123 Tech Street, Silicon Valley, CA 94025',
      phoneNumber: '+1 (650) 555-0101',
      email: 'contact@globalelectronics.com',
    },
    {
      id: 2,
      name: 'Premium Parts Co.',
      address: '456 Industrial Way, Chicago, IL 60601',
      phoneNumber: '+1 (312) 555-0202',
      email: 'sales@premiumparts.com',
    },
    {
      id: 3,
      name: 'Oceanic Foods Ltd.',
      address: '789 Harbor Drive, Seattle, WA 98101',
      phoneNumber: '+1 (206) 555-0303',
      email: 'info@oceanicfoods.com',
    },
    {
      id: 4,
      name: 'Textile World',
      address: '321 Fabric Avenue, New York, NY 10001',
      phoneNumber: '+1 (212) 555-0404',
      email: 'orders@textileworld.com',
    },
    {
      id: 5,
      name: 'Green Energy Solutions',
      address: '654 Renewable Lane, Denver, CO 80202',
      phoneNumber: '+1 (303) 555-0505',
      email: 'support@greenenergy.com',
    },
    {
      id: 6,
      name: 'Automotive Parts Plus',
      address: '987 Gear Road, Detroit, MI 48201',
      phoneNumber: '+1 (313) 555-0606',
      email: 'parts@autopartsplus.com',
    },
    {
      id: 7,
      name: 'Office Essentials',
      address: '159 Supply Street, Boston, MA 02108',
      phoneNumber: '+1 (617) 555-0707',
      email: 'service@officeessentials.com',
    },
    {
      id: 8,
      name: 'Fresh Farms Produce',
      address: '753 Orchard Lane, Fresno, CA 93701',
      phoneNumber: '+1 (559) 555-0808',
      email: 'harvest@freshfarms.com',
    },
    {
      id: 9,
      name: 'BuildRight Materials',
      address: '852 Construction Blvd, Dallas, TX 75201',
      phoneNumber: '+1 (214) 555-0909',
      email: 'materials@buildright.com',
    },
    {
      id: 10,
      name: 'PharmaCare Distributors',
      address: '369 Health Circle, Philadelphia, PA 19102',
      phoneNumber: '+1 (215) 555-1010',
      email: 'orders@pharmacare.com',
    },
    {
      id: 11,
      name: 'Tech Components Ltd.',
      address: '147 Circuit Road, Austin, TX 78701',
      phoneNumber: '+1 (512) 555-1111',
      email: 'components@techltd.com',
    },
    {
      id: 12,
      name: 'Fashion Forward Textiles',
      address: '258 Design Avenue, Los Angeles, CA 90015',
      phoneNumber: '+1 (213) 555-1212',
      email: 'design@fashionforward.com',
    },
    {
      id: 13,
      name: 'Pet Supplies Unlimited',
      address: '963 Animal Way, Phoenix, AZ 85001',
      phoneNumber: '+1 (602) 555-1313',
      email: 'pets@supplyunlimited.com',
    },
    {
      id: 14,
      name: 'Industrial Tools Co.',
      address: '741 Workshop Street, Houston, TX 77001',
      phoneNumber: '+1 (713) 555-1414',
      email: 'tools@industrialco.com',
    },
    {
      id: 15,
      name: 'Beverage Distributors Inc.',
      address: '852 Drink Boulevard, Atlanta, GA 30301',
      phoneNumber: '+1 (404) 555-1515',
      email: 'orders@beveragedist.com',
    },
    {
      id: 16,
      name: 'Safety First Equipment',
      address: '369 Protection Lane, Miami, FL 33101',
      phoneNumber: '+1 (305) 555-1616',
      email: 'safety@firstequip.com',
    },
    {
      id: 17,
      name: 'Paper Products Co.',
      address: '147 Print Street, Minneapolis, MN 55401',
      phoneNumber: '+1 (612) 555-1717',
      email: 'paper@productsco.com',
    },
    {
      id: 18,
      name: 'Global Chemicals',
      address: '258 Lab Road, Newark, NJ 07101',
      phoneNumber: '+1 (973) 555-1818',
      email: 'chemicals@globalchem.com',
    },
    {
      id: 19,
      name: 'Furniture World',
      address: '753 Comfort Avenue, Charlotte, NC 28201',
      phoneNumber: '+1 (704) 555-1919',
      email: 'furnish@furnitureworld.com',
    },
    {
      id: 20,
      name: 'Precision Instruments',
      address: '852 Measurement Way, San Diego, CA 92101',
      phoneNumber: '+1 (619) 555-2020',
      email: 'precision@instruments.com',
    },
    {
      id: 21,
      name: 'Outdoor Gear Suppliers',
      address: '963 Adventure Trail, Portland, OR 97201',
      phoneNumber: '+1 (503) 555-2121',
      email: 'gear@outdoorsupply.com',
    },
    {
      id: 22,
      name: 'Cosmetic Creations',
      address: '147 Beauty Boulevard, Las Vegas, NV 89101',
      phoneNumber: '+1 (702) 555-2222',
      email: 'cosmetics@creations.com',
    },
    {
      id: 23,
      name: 'Home Appliance Center',
      address: '258 Household Lane, Orlando, FL 32801',
      phoneNumber: '+1 (407) 555-2323',
      email: 'appliances@homecenter.com',
    },
    {
      id: 24,
      name: 'Sports Equipment Ltd.',
      address: '369 Athletic Way, Salt Lake City, UT 84101',
      phoneNumber: '+1 (801) 555-2424',
      email: 'sports@equipmentltd.com',
    },
    {
      id: 25,
      name: 'Book Distributors Inc.',
      address: '741 Library Street, Nashville, TN 37201',
      phoneNumber: '+1 (615) 555-2525',
      email: 'books@distributors.com',
    },
    {
      id: 26,
      name: 'Toy Manufacturers Co.',
      address: '852 Play Road, San Antonio, TX 78201',
      phoneNumber: '+1 (210) 555-2626',
      email: 'toys@manufacturers.com',
    },
    {
      id: 27,
      name: 'Jewelry Suppliers',
      address: '963 Gemstone Avenue, New Orleans, LA 70112',
      phoneNumber: '+1 (504) 555-2727',
      email: 'jewelry@suppliers.com',
    },
    {
      id: 28,
      name: 'Medical Supplies Plus',
      address: '147 Hospital Drive, Cleveland, OH 44101',
      phoneNumber: '+1 (216) 555-2828',
      email: 'medical@suppliesplus.com',
    },
    {
      id: 29,
      name: 'Art Materials Warehouse',
      address: '258 Creative Lane, Kansas City, MO 64101',
      phoneNumber: '+1 (816) 555-2929',
      email: 'art@materials.com',
    },
    {
      id: 30,
      name: 'Garden Supplies Co.',
      address: '369 Green Thumb Way, Raleigh, NC 27601',
      phoneNumber: '+1 (919) 555-3030',
      email: 'garden@suppliesco.com',
    },
  ],
};

export const get = async (): Promise<GetAll<Supplier>> => {
  const suppliers = suppliersDb.data;
  return {
    data: suppliers,
    // For now, I'm returning everything since the client occupies of
    // pagination, sorting, and filtering.
    pageSize: suppliers.length,
    elementsSize: suppliers.length,
    currentPage: 1,
    totalPages: 1,
    totalElements: suppliers.length,
  };
};

export const getById = async (id: number): Promise<Supplier> => {
  const suppliers = suppliersDb.data;
  const supplier = suppliers.find((supplier) => supplier.id === id);
  if (!supplier) throw new AxiosError('Supplier not found.');
  return supplier;
};

export const getManyByName = async (
  name: string,
  options?: { limit?: number }
): Promise<Supplier[]> => {
  const suppliers = suppliersDb.data;
  const sorted = suppliers.slice().sort((a, b) => a.name.localeCompare(b.name));
  const filtered = sorted.filter((supplier) =>
    supplier.name.toLowerCase().includes(name.toLowerCase())
  );

  if (options?.limit) {
    const limit =
      options.limit > suppliers.length ? suppliers.length : options.limit;
    filtered.splice(limit);
  }

  return filtered;
};

export const create = async (data: CreateSupplierDTO): Promise<string> => {
  const { data: suppliers, autoId } = suppliersDb;
  suppliers.push({
    id: autoId,
    ...data,
  });
  suppliersDb.autoId++;
  return 'New supplier has been added.';
};

export const updateById = async (
  id: number,
  data: UpdateSupplierDTO
): Promise<string> => {
  const suppliers = suppliersDb.data;
  const supplier = suppliers.find((supplier) => supplier.id === id);
  if (!supplier) throw new AxiosError('Supplier not found.');
  Object.assign(supplier, data);
  return `Supplier with id ${id} has been updated.`;
};

export const deleteById = async (id: number): Promise<string> => {
  const suppliers = suppliersDb.data;
  const index = suppliers.findIndex((supplier) => supplier.id === id);
  if (index < 0) throw new AxiosError('Supplier not found.');
  suppliers.splice(index, 1);
  return `Supplier with id ${id} has been deleted.`;
};
