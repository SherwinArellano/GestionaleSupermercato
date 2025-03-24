import { auth } from '@/auth';
import { AppSidebar } from '@/components/ui/dashboard/app-sidebar';
import { SidebarUser } from '@/components/ui/dashboard/sidebar-user';
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Sidebar } from 'lucide-react';
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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>SupermarketOS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu></SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser
          user={{
            avatar: '/',
            avatarFallback: 'LO',
            email: 'Loading...',
            name: 'Loading...',
          }}
        />
      </SidebarFooter>
    </Sidebar>
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
        role: user.role,
      }}
    />
  );
}
