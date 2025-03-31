import { PageNotFound } from '@/components/ui/dashboard/page-not-found';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404',
};

export default function NotFound() {
  return <PageNotFound />;
}
