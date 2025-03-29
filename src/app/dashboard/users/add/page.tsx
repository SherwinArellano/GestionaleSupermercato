import { Breadcrumb } from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/ui/dashboard/header';
import { AddUserForm } from '@/components/ui/dashboard/users/add-form';

const breadcrumbs: Breadcrumb[] = [
  {
    label: 'Users',
    href: '/dashboard/users',
  },
  {
    label: 'Add User',
  },
];

export default function CreateUserPage() {
  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <main className="grid gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Add a new user</CardTitle>
          </CardHeader>
          <CardContent>
            <AddUserForm />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
