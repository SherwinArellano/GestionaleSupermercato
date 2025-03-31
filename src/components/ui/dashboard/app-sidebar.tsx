import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Boxes, Factory, Home, Package, Receipt, Users } from 'lucide-react';
import { SidebarUser, SidebarUserProps } from './sidebar-user';
import Link from 'next/link';
import { checkUrlPermission } from '@/authorization';
import { Role } from '@/types/roles';

export const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Products',
    url: '/products',
    icon: Package,
  },
  {
    title: 'Stocks',
    url: '/stocks',
    icon: Boxes,
  },
  {
    title: 'Suppliers',
    url: '/suppliers',
    icon: Factory,
  },
  {
    title: 'Sales',
    url: '/sales',
    icon: Receipt,
  },
  // For now hide Discounts and Promotions
  // {
  //   title: 'Discounts',
  //   url: '/discounts',
  //   icon: Percent,
  // },
  // {
  //   title: 'Promotions',
  //   url: '/promotions',
  //   icon: Megaphone,
  // },
  {
    title: 'Users',
    url: '/users',
    icon: Users,
  },
  // For now hide analytics page
  // {
  //   title: 'Analytics',
  //   url: '/analytics',
  //   icon: BarChart3,
  // },
];

export async function AppSidebar({
  user,
  ...props
}: React.ComponentProps<'div'> & SidebarUserProps & { user: { role: Role } }) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>SupermarketOS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter(({ url }) => checkUrlPermission(user.role, url))
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={`/dashboard${item.url}`}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
