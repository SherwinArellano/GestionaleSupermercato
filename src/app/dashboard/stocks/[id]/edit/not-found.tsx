import { Breadcrumb } from '@/components/ui/breadcrumbs';
import { DashboardHeader } from '@/components/ui/dashboard/header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404',
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: 'Stocks',
    href: '/dashboard/stocks',
  },
  {
    label: 'Stock Not Found',
  },
];

export default function NotFound() {
  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <main className="flex flex-1 items-center px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="w-full space-y-6 text-center">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold sm:text-5xl">404 Not Found</h1>
            <p className="text-gray-500">
              The stock you&apos;re trying to edit does not exist!
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
