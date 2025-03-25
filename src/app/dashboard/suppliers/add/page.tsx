import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Breadcrumb } from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/ui/dashboard/header';
import { AddSupplierForm } from '@/components/ui/dashboard/suppliers/add-form';
import { CircleAlert } from 'lucide-react';

const breadcrumbs: Breadcrumb[] = [
  {
    label: 'Suppliers',
    href: '/dashboard/suppliers',
  },
  {
    label: 'Add Supplier',
  },
];

export default function CreateSupplierPage() {
  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <main className="grid gap-6 p-6">
        {/* IN-MEMORY STORAGE ALERT */}
        <Alert className="bg-accent text-accent-foreground">
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Suppliers data are saved using in memory storage. Any additions
            and/or modifications will be gone if the website redeploys.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Add a new supplier</CardTitle>
          </CardHeader>
          <CardContent>
            <AddSupplierForm />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
