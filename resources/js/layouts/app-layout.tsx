// import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
// import { type BreadcrumbItem } from '@/types';
// import { type ReactNode } from 'react';
// import { Toaster } from 'sonner';

// interface AppLayoutProps {
//     children: ReactNode;
//     breadcrumbs?: BreadcrumbItem[];
// }

// export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
//     <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
//         {children}
//         <Toaster position="top-right" richColors />
//     </AppLayoutTemplate>
// );


// resources/js/layouts/AppLayout.tsx

import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useEffect } from 'react';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { Toaster, toast } from 'sonner';
import { usePage } from '@inertiajs/react';

interface PageProps {
  flash?: { success?: string; error?: string };
  errors?: Record<string, string[]>;
}

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
  // Grab the entire props bag from Inertia
  const page = usePage();
  // Provide empty defaults in case they're missing
  const flash = page.props.flash ?? {};
  const errors = page.props.errors ?? {};

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success);
    }
    if (flash.error) {
      toast.error(flash.error);
    }

    // Turn field validation errors into toasts, if you like
    Object.values(errors).flat().forEach(msg => {
      toast.error(msg);
    });
  }, [flash, errors]);

  return (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
      {children}
      <Toaster position="top-right" richColors />
    </AppLayoutTemplate>
  );
}
