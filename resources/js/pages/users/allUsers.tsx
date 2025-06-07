import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
  Mail,
  ChevronDown,
  Download,
  RefreshCw,
  UserCheck,
  UserX,
  Crown,
  Shield,
  UserPlus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import type { BreadcrumbItem } from '@/types';

type RoleName = string;

type UserRecord = {
  id: number;
  name: string;
  email: string;
  business_name: string | null;
  // We expect `roles` to be an array of objects like {id: number, name: string}
  roles?: { id: number; name: string }[];
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  phone: string | null;
};

type PageProps = {
  users: {
    data: UserRecord[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
  };
  roles: RoleName[];
  // filters may be an empty array or an object with keys—treat it as any
  filters: any;
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'All Users',
    href: route('users.index'),
  },
];

export default function AllUsers() {
  const { users, roles, filters } = usePage<PageProps>().props;

  // 1) Initialize filter‐related local state from filters.*
  //    If filters.search is undefined, default to '' (meaning “no filter”).
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [filterRole, setFilterRole] = useState(filters.role || '');
  const [filterStatus, setFilterStatus] = useState(filters.status || '');
  const [sortBy, setSortBy] = useState(filters.sort_by || '');
  const [sortDir, setSortDir] = useState(filters.sort_dir || '');
  const [perPage, setPerPage] = useState(filters.per_page ? String(filters.per_page) : '');

  const [showFilters, setShowFilters] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // Prevent the initial mount from immediately triggering a router.get
  const isFirstLoad = useRef(true);

  // 2) Only re-fetch when the user actually changes something
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    const params: Record<string, any> = {};

    if (searchTerm.trim() !== '') {
      params.search = searchTerm.trim();
    }
    if (filterRole !== '') {
      params.role = filterRole;
    }
    if (filterStatus !== '') {
      params.status = filterStatus;
    }
    if (sortBy !== '') {
      params.sort_by = sortBy;
    }
    if (sortDir !== '') {
      params.sort_dir = sortDir;
    }
    if (perPage !== '') {
      params.per_page = Number(perPage);
    }

    // Always include current_page so pagination works properly
    params.page = users.current_page;

    // Only call router.get if at least one filter is non-empty
    const hasAnyFilter =
      searchTerm.trim() !== '' ||
      filterRole !== '' ||
      filterStatus !== '' ||
      sortBy !== '' ||
      sortDir !== '' ||
      perPage !== '';

    if (hasAnyFilter) {
      router.get(route('users.index'), params, {
        replace: true,
        preserveState: true,
      });
    }
  }, [searchTerm, filterRole, filterStatus, sortBy, sortDir, perPage]);

  // 3) Safely format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 4) Role badge renderer: take `roles: {id,name}[]` (which might be undefined or empty)
  const getRoleBadge = (rolesArr?: { id: number; name: string }[]) => {
    const primaryName = Array.isArray(rolesArr) && rolesArr.length
      ? rolesArr[0].name
      : 'user';
    const config: Record<string, { color: string; icon: typeof Users }> = {
      administrator: { color: 'bg-red-100 text-red-800',    icon: Crown  },
      'agent Role':  { color: 'bg-blue-100 text-blue-800',  icon: Shield },
      user:          { color: 'bg-green-100 text-green-800',icon: Users  },
      viewer:        { color: 'bg-gray-100 text-gray-800',  icon: Users  },
    };
    const { color, icon: Icon } = config[primaryName] || config.user;
    return (
      <Badge variant="secondary" className={color}>
        <Icon className="w-3 h-3 mr-1" />
        {primaryName.charAt(0).toUpperCase() + primaryName.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        <UserCheck className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">
        <UserX className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const handleView = (id: number) => {
    router.get(route('users.show', id));
  };
  const handleEdit = (id: number) => {
    router.get(route('users.edit', id));
  };

  const handleDelete = (id: number) => {
    setDeleteUserId(id);
  };
  const confirmDelete = () => {
    if (deleteUserId) {
      router.delete(route('users.destroy', deleteUserId), {
        preserveState: true,
        onSuccess: () => {
          setDeleteUserId(null);
          setSelectedRows((prev) => {
            const copy = new Set(prev);
            copy.delete(deleteUserId);
            return copy;
          });
        },
      });
    }
  };

  const handleSelectRow = (id: number) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };
  const handleSelectAll = () => {
    const currentUserIds = users.data.map((u) => u.id);
    if (currentUserIds.every((id) => selectedRows.has(id))) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(currentUserIds));
    }
  };

  const {
    data: displayedUsers,
    current_page,
    last_page,
    from,
    to,
    total,
    links,
  } = users;

  const totalUsers = total || 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User Access Management" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                User Access Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage user accounts and roles ({totalUsers} total users)
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <Button
                variant="outline"
                onClick={() =>
                  router.get(route('users.index'), {}, { preserveState: true })
                }
                className="w-full sm:w-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={() => router.get(route('users.create'))}
                className="w-full sm:w-auto"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create New User
              </Button>
            </div>
          </div>

          {/* Search & Sort Bar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              {/* Search + Filter toggle */}
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search users, emails, businesses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Show/Hide Filters</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      {showFilters ? 'Hide' : 'Show'} Advanced Filters
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Sort dropdown & Order toggle */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Select
                  value={sortBy}
                  onValueChange={(val: string) => setSortBy(val as any)}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="business_name">Business</SelectItem>
                    <SelectItem value="last_login">Last Login</SelectItem>
                    <SelectItem value="created_at">Created Date</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSortDir((d: string) => (d === 'asc' ? 'desc' : 'asc'))
                  }
                >
                  {sortDir === 'asc' ? '↑' : '↓'}
                </Button>
                <Select
                  value={perPage}
                  onValueChange={(val: string) => setPerPage(val)}
                >
                  <SelectTrigger className="w-full sm:w-24">
                    <SelectValue placeholder="Per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Role Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="role-filter">Role</Label>
                    <Select
                      value={filterRole}
                      onValueChange={(val: string) => setFilterRole(val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Any Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any Role</SelectItem>
                        {roles.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="status-filter">Status</Label>
                    <Select
                      value={filterStatus}
                      onValueChange={(val: string) =>
                        setFilterStatus(val)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Any Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any Status</SelectItem>
                        <SelectItem value="active">Active Only</SelectItem>
                        <SelectItem value="inactive">Inactive Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bulk Actions (unchanged) */}
          {selectedRows.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedRows.size} user
                  {selectedRows.size > 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      selectedRows.forEach((id) => {
                        router.delete(route('users.destroy', id), {
                          preserveState: true,
                        });
                      });
                      setSelectedRows(new Set());
                    }}
                  >
                    Delete Selected
                  </Button>
                  <Button variant="outline" size="sm">
                    Deactivate Selected
                  </Button>
                  <Button variant="outline" size="sm">
                    Export Selected
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {displayedUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-12 px-3 sm:px-6 py-3 text-left">
                        <Checkbox
                          checked={
                            displayedUsers.every((u) =>
                              selectedRows.has(u.id)
                            ) && displayedUsers.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                        User
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                        Role
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        Business
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                        Status
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                        Last Login
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {displayedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className={`${
                          selectedRows.has(user.id) ? 'bg-blue-50' : ''
                        } hover:bg-gray-50 transition-colors`}
                      >
                        <td className="px-3 sm:px-6 py-4">
                          <Checkbox
                            checked={selectedRows.has(user.id)}
                            onCheckedChange={() =>
                              handleSelectRow(user.id)
                            }
                          />
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-3 sm:ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                <span className="truncate max-w-[150px] sm:max-w-none">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        {/* Here we pass user.roles (which may be undefined) */}
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(user.roles)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 truncate max-w-[100px] block">
                            {user.business_name || 'N/A'}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.is_active)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {formatDate(user.last_login)}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <span className="hidden sm:inline">Actions</span>
                                <ChevronDown className="w-4 h-4 sm:ml-1" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleView(user.id)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEdit(user.id)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(user.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No users found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}

            {/* Pagination Controls (unchanged) */}
            {last_page > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.get(
                        route('users.index'),
                        { ...filters, page: Math.max(1, current_page - 1) },
                        { preserveState: true }
                      )
                    }
                    disabled={current_page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.get(
                        route('users.index'),
                        {
                          ...filters,
                          page: Math.min(last_page, current_page + 1),
                        },
                        { preserveState: true }
                      )
                    }
                    disabled={current_page === last_page}
                  >
                    Next
                  </Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">{from || 0}</span> to{' '}
                      <span className="font-medium">{to || 0}</span> of{' '}
                      <span className="font-medium">{total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      {links.map((link, idx) => (
                        <Button
                          key={idx}
                          variant={link.active ? 'default' : 'outline'}
                          size="sm"
                          disabled={!link.url}
                          onClick={() => {
                            if (link.url) {
                              router.get(link.url, {}, { preserveState: true });
                            }
                          }}
                        >
                          <span
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        </Button>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delete Confirmation Dialog (unchanged) */}
          <AlertDialog
            open={!!deleteUserId}
            onOpenChange={(open) => {
              if (!open) {
                setTimeout(() => setDeleteUserId(null), 100);
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this user? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={confirmDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </AppLayout>
  );
}
