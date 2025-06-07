import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { QuickActions } from '@/components/quick-action';
import { Sidebar, SidebarContent,SidebarGroup, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { type NavItemWithSub } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Plus, UserPlus,LayoutDashboard,Calendar,FileText,Package, Clock, Shield, Users} from 'lucide-react';
import AppLogo from './app-logo';


const quickActions: NavItem[] = [
    {
      title: "New Booking",
      href: "booking/create",
      icon: Plus,
    },
    {
      title: "Create Package",
      href: "/package/create",
      icon: Plus,
    },
    {
      title: "Create User",
      href: "/user/create",
      icon: UserPlus,
    },
]

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Booking',
        href: '/booking',
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

 const dashboardMainNav: NavItemWithSub[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Bookings",
        icon: Calendar,
        key: "bookings",
        items: [
        { title: "All Bookings", href: "/bookings/all" },
        ],
    },
    {
        title: "Invoices",
        icon: FileText,
        key: "invoices",
        items: [
        { title: "All Invoices", href: "/invoice/all" },
        { title: "Paid", href: "/invoice?status=paid" },
        ],
    },
    {
      title: "Travel Package",
      icon: Package,
      key: "packages",
      items: [
        { title: "All Packages", href: "/packages/all" },
        { title: "Create Packages", href: "/packages/create" },
      ],
    },
    { 
      title: "Activities",
      icon: Clock,
      key: "activities",
      items: [
        { title: "All Activities", href: "/activities/all" },
        { title: "Create Activities", href: "/activities/create" },
      ],
    },
    {
      title: "User Management",
      icon: Users,
      key: "user-management",
      items: [
        { title: "All Users", href: "/users/all" },
        { title: "Create User", href: "/users/create" },
        { title: "Admins", href: "/users?role=admin" },
        { title: "Agents", href: "/users?role=agent" },
      ],
    },
    {
      title: "Role Management",
      icon: Shield,
      key: "role-management",
      items: [
        { title: "All Roles", href: "/roles/all" },
        { title: "Create Role", href: "/roles/create" },
      ],
    },

    {
      title: "Platform Adon/Rates",
      icon: LayoutGrid,
      href:"/settings/platform"
    },
   
  ]


export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* <SidebarGroup>
            </SidebarGroup> */}

            <SidebarContent className="flex-1 min-h-0"> 
                <SidebarGroup>
                <QuickActions items={quickActions} />
                <NavMain items={dashboardMainNav} />
                </SidebarGroup>

                <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
            </SidebarContent>

            
        </Sidebar>
    );
}
