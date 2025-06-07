// import AppLayout from '@/layouts/app-layout';
// import { type BreadcrumbItem } from '@/types';
// import { Head, usePage, router, Link } from '@inertiajs/react';
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { Edit, Trash2, Search } from "lucide-react"
// import { useState } from 'react';

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'All Roles',
//         href: '/roles/all',
//     },
// ];



// export default function AllRoles() {
//   const { roles, filters } = usePage().props
//   const [search, setSearch] = useState( "")
//   const [sort, setSort] = useState("name")
//   const [direction, setDirection] = useState("asc")
//   const [deleteRoleId, setDeleteRoleId] = useState(null)

//   const handleSearch = (e) => {
//     e.preventDefault()
//     router.get(route("roles.index"), { search, sort, direction }, { preserveState: true })
//   }

//   const handleSortChange = (value) => {
//     const [newSort, newDirection] = value.split("|")
//     setSort(newSort)
//     setDirection(newDirection)
//     router.get(route("roles.index"), { search, sort: newSort, direction: newDirection }, { preserveState: true })
//   }

//   const handleDelete = (roleId) => {
//     router.delete(route("roles.destroy", roleId), {
//       onSuccess: () => setDeleteRoleId(null),
//     })
//   }
//   return (
//     <AppLayout breadcrumbs={breadcrumbs}>
//       <Head title="All Roles" />
//       <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
//          <div className="p-6 space-y-6">
//       <div>
//             <h1 className="text-2xl font-bold tracking-tight">Roles</h1>
//             <p className="text-muted-foreground">Manage user roles and permissions</p>
//           </div>

//           {/* Filter Section */}
//           <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
//             <form onSubmit={handleSearch} className="flex gap-2 flex-1">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                 <Input
//                   type="text"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search roles..."
//                   className="pl-10"
//                 />
//               </div>
//               <Button type="submit">Search</Button>
//             </form>

//             <Select value={`${sort}|${direction}`} onValueChange={handleSortChange}>
//               <SelectTrigger className="w-48">
//                 <SelectValue placeholder="Sort by..." />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="name|asc">Name ↑</SelectItem>
//                 <SelectItem value="name|desc">Name ↓</SelectItem>
//                 <SelectItem value="created_at|asc">Created ↑</SelectItem>
//                 <SelectItem value="created_at|desc">Created ↓</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Table */}
//           <div className="border rounded-lg">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Permissions</TableHead>
//                   <TableHead>Users</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {roles.data.map((role) => (
//                   <TableRow key={role.id}>
//                     <TableCell className="font-medium">{role.name}</TableCell>
//                     <TableCell>
//                       <Badge variant="secondary">{role.permissions_count}</Badge>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant="outline">{role.users_count}</Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end gap-2">
//                         <Button variant="ghost" size="sm" asChild>
//                           <Link href={route("roles.edit", role.id)}>
//                             <Edit className="h-4 w-4" />
//                           </Link>
//                         </Button>
//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>Delete Role</AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 Are you sure you want to delete this role? This action cannot be undone.
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel>Cancel</AlertDialogCancel>
//                               <AlertDialogAction
//                                 onClick={() => handleDelete(role.id)}
//                                 className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                               >
//                                 Delete
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>

//           {/* Pagination */}
//           <div className="flex justify-center gap-1">
//             {roles.links.map((link, i) =>
//               link.url ? (
//                 <Button key={i} variant={link.active ? "default" : "outline"} size="sm" asChild>
//                   <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
//                 </Button>
//               ) : (
//                 <Button key={i} variant="outline" size="sm" disabled dangerouslySetInnerHTML={{ __html: link.label }} />
//               ),
//             )}
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   );
// }



// resources/js/Pages/roles/AllRoles.tsx

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Search, Plus } from "lucide-react";
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'All Roles', href: '/roles' },
];

export default function AllRoles() {
  // Remove the type assertion and access roles directly
  const { roles } = usePage().props as any;

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [direction, setDirection] = useState("asc");
  const [deleteRoleId, setDeleteRoleId] = useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      route("roles.index"),
      { search, sort, direction },
      { preserveState: true }
    );
  };

  const handleSortChange = (value: string) => {
    const [newSort, newDirection] = value.split("|");
    setSort(newSort);
    setDirection(newDirection);
    router.get(
      route("roles.index"),
      { search, sort: newSort, direction: newDirection },
      { preserveState: true }
    );
  };

  const handleDelete = (roleId: number) => {
    router.delete(route("roles.destroy", roleId), {
      onSuccess: () => {
        // Reload the page so that the table data refreshes
        router.reload();
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="All Roles" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Roles</h1>
              <p className="text-muted-foreground">
                Manage user roles and permissions
              </p>
            </div>

            {/* "Create Role" button in top‐right */}
            <Link href={route("roles.create")} as="button">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Role
              </Button>
            </Link>
          </div>

          {/* Filter & Sort Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search roles..."
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>

            <Select value={`${sort}|${direction}`} onValueChange={handleSortChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name|asc">Name ↑</SelectItem>
                <SelectItem value="name|desc">Name ↓</SelectItem>
                <SelectItem value="created_at|asc">Created ↑</SelectItem>
                <SelectItem value="created_at|desc">Created ↓</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Roles Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.data.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{role.permissions_count}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{role.users_count}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Edit button */}
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={route("roles.edit", role.id)}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>

                        {/* Delete confirmation dialog */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Role</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the <strong>{role.name}</strong> role?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction asChild>
                                <Button
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleDelete(role.id)}
                                >
                                  Delete
                                </Button>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Links */}
          <div className="flex justify-center gap-1">
            {roles.links.map((link, i) =>
              link.url ? (
                <Button
                  key={i}
                  variant={link.active ? "default" : "outline"}
                  size="sm"
                  asChild
                >
                  <Link
                    href={link.url}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                </Button>
              ) : (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  disabled
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              )
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
