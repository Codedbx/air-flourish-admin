import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton
} from '@/components/ui/sidebar';

import { type NavItemWithSub } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ChevronRight, type LucideIcon } from 'lucide-react';

// SidebarIcon utility component for consistent styling
const SidebarIcon = ({ icon: Icon }: { icon: LucideIcon }) => (
    <Icon className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
);

export function NavMain({ items = [] }: { items: NavItemWithSub[] }) {
    const page = usePage();
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    // Check if item or any of its children is active
    const isActive = (item: NavItemWithSub) => {
        if (item.href && page.url === item.href) return true;
        if (item.items) {
            return item.items.some(child => page.url === child.href);
        }
        return false;
    };

    // Check if child item is active
    const isChildActive = (href: string | undefined) => {
        return href === page.url;
    };

    // Initialize open state based on active items
    useEffect(() => {
        const initialState: Record<string, boolean> = {};
        items.forEach(item => {
            if (item.items && item.items.length > 0) {
                initialState[item.title] = isActive(item);
            }
        });
        setOpenItems(initialState);
    }, [items, page.url]);

    const toggle = (key: string) => {
        setOpenItems(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="dark:text-neutral-400">
                Platform
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const hasChildren = Array.isArray(item.items) && item.items.length > 0;
                    const isItemActive = isActive(item);
                    const isOpen = openItems[item.title] || isItemActive;

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isItemActive}
                                tooltip={{ children: item.title }}
                                onClick={() => {
                                    if (hasChildren) toggle(item.title);
                                }}
                                className="dark:hover:bg-gray-700 dark:data-[active=true]:bg-gray-700"
                            >
                                <div className="flex items-center justify-between w-full">
                                    {hasChildren ? (
                                        <div className="flex items-center space-x-2 cursor-pointer">
                                            {item.icon && <SidebarIcon icon={item.icon} />}
                                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                                {item.title}
                                            </span>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href || '#'}
                                            prefetch
                                            className="flex items-center space-x-2 w-full"
                                        >
                                            {item.icon && <SidebarIcon icon={item.icon} />}
                                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                                {item.title}
                                            </span>
                                        </Link>
                                    )}
                                    {hasChildren && (
                                        <ChevronRight
                                            className={`text-sm text-neutral-700 dark:text-neutral-300 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                                        />
                                    )}
                                </div>
                            </SidebarMenuButton>

                            {hasChildren && isOpen && (
                                <SidebarMenuSub>
                                    {item.items!.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.title}>
                                            <SidebarMenuSubButton
                                                asChild
                                                isActive={isChildActive(subItem.href)}
                                                className="dark:hover:bg-gray-700 dark:data-[active=true]:bg-gray-700"
                                            >
                                                <Link href={subItem.href || '#'} prefetch>
                                                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                                        {subItem.title}
                                                    </span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}



// import {
//     SidebarGroup,
//     SidebarGroupLabel,
//     SidebarMenu,
//     SidebarMenuButton,
//     SidebarMenuItem,
//     SidebarMenuSub,
//     SidebarMenuSubItem,
//     SidebarMenuSubButton
// } from '@/components/ui/sidebar';

// import { type NavItemWithSub } from '@/types';
// import { Link, usePage } from '@inertiajs/react';
// import { useState } from 'react';
// import { ChevronRight, type LucideIcon } from 'lucide-react';

// // SidebarIcon utility component for consistent styling
// const SidebarIcon = ({ icon: Icon }: { icon: LucideIcon }) => (
//     <Icon className="w-4 h-4 text-neutral-700" />
// );

// export function NavMain({ items = [] }: { items: NavItemWithSub[] }) {
//     const page = usePage();
//     const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

//     const isActive = (href: string | undefined) => href === page.url;

//     const toggle = (key: string) => {
//         setOpenItems((prev) => ({
//             ...prev,
//             [key]: !prev[key],
//         }));
//     };

//     return (
//         <SidebarGroup className="px-2 py-0">
//             <SidebarGroupLabel>Platform</SidebarGroupLabel>
//             <SidebarMenu>
//                 {items.map((item) => {
//                     const hasChildren = Array.isArray(item.items) && item.items.length > 0;
//                     const isOpen = openItems[item.title];

//                     return (
//                         <SidebarMenuItem key={item.title}>
//                             <SidebarMenuButton
//                                 asChild
//                                 isActive={isActive(item.href)}
//                                 tooltip={{ children: item.title }}
//                                 onClick={() => {
//                                     if (hasChildren) toggle(item.title);
//                                 }}
//                             >
//                                 <div className="flex items-center justify-between w-full">
//                                     {hasChildren ? (
//                                         <div className="flex items-center space-x-2 cursor-pointer">
//                                             {item.icon && <SidebarIcon icon={item.icon} />}
//                                             <span className="text-sm text-neutral-700">{item.title}</span>
//                                         </div>
//                                     ) : (
//                                         <Link
//                                             href={item.href || '#'}
//                                             prefetch
//                                             className="flex items-center space-x-2 w-full"
//                                         >
//                                             {item.icon && <SidebarIcon icon={item.icon} />}
//                                             <span className="text-sm text-neutral-700">{item.title}</span>
//                                         </Link>
//                                     )}
//                                     {hasChildren && (
//                                         <ChevronRight
//                                             className={`text-sm text-neutral-700 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
//                                         />
//                                     )}
//                                 </div>
//                             </SidebarMenuButton>

//                             {hasChildren && isOpen && (
//                             <SidebarMenuSub>
//                                 {item.items!.map((subItem) => (
//                                 <SidebarMenuSubItem key={subItem.title}>
//                                     <SidebarMenuSubButton
//                                     asChild
//                                     isActive={isActive(subItem.href)}
//                                     >
//                                     <Link href={subItem.href || '#'} prefetch>
//                                         <span className="text-sm text-neutral-700">{subItem.title}</span>
//                                     </Link>
//                                     </SidebarMenuSubButton>
//                                 </SidebarMenuSubItem>
//                                 ))}
//                             </SidebarMenuSub>
//                             )}
//                         </SidebarMenuItem>
//                     );
//                 })}
//             </SidebarMenu>
//         </SidebarGroup>
//     );
// }



// import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
// import { type NavItem } from '@/types';
// import { Link, usePage } from '@inertiajs/react';

// export function NavMain({ items = [] }: { items: NavItem[] }) {
//     const page = usePage();
//     return (
//         <SidebarGroup className="px-2 py-0">
//             <SidebarGroupLabel>Platform</SidebarGroupLabel>
//             <SidebarMenu>
//                 {items.map((item) => (
//                     <SidebarMenuItem key={item.title}>
//                         <SidebarMenuButton  
//                             asChild isActive={item.href === page.url}
//                             tooltip={{ children: item.title }}
//                         >
//                             <Link href={item.href} prefetch>
//                                 {item.icon && <item.icon />}
//                                 <span>{item.title}</span>
//                             </Link>
//                         </SidebarMenuButton>
//                     </SidebarMenuItem>
//                 ))}
//             </SidebarMenu>
//         </SidebarGroup>
//     );
// }
