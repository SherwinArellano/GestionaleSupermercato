import { DashboardHeader } from '@/components/ui/dashboard/header';

export default function UserPage() {
  return (
    <>
      <DashboardHeader breadcrumbs={[{ label: 'Users' }]} />

      <main className="grid gap-6 p-6"></main>
    </>
  );
}
