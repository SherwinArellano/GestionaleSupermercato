import { Breadcrumb } from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/ui/dashboard/header';
import { EditUserForm } from '@/components/ui/dashboard/users/edit-form';
import db from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit User',
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: 'Users',
    href: '/dashboard/users',
  },
  {
    label: 'Edit User',
  },
];

export default async function CreateUserPage(props: {
  params: Promise<{ opcode: string }>;
}) {
  const params = await props.params;
  const opcode = params.opcode;

  const user = await db.users.getByOperatorCode(opcode);
  if (!user) notFound();

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <main className="grid gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Editing {user.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <EditUserForm user={user} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
