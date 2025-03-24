import { auth } from '@/auth';
import { AppSidebar } from '@/components/ui/dashboard/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ReactNode, Suspense } from 'react';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <Suspense fallback={<AppSidebarSkeleton />}>
        <UserAppSidebar />
      </Suspense>

      <div className="flex flex-1 flex-col">{children}</div>
    </SidebarProvider>
  );
}

function AppSidebarSkeleton() {
  return (
    <AppSidebar
      user={{
        name: `Loading...`,
        avatar: '/',
        avatarFallback: 'LO',
        email: `loading@email`,
      }}
    />
  );
}

async function UserAppSidebar() {
  const user = (await auth())!.user;
  const initials =
    user.name.slice(0, 1).toUpperCase() +
    user.surname.slice(0, 1).toUpperCase();

  return (
    <AppSidebar
      user={{
        name: `${user.name} ${user.surname}`,
        avatar: '/',
        avatarFallback: initials,
        email: user.email,
      }}
    />
  );
}
