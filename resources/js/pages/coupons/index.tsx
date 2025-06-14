import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Trash2, Plus, Calendar, Hash, XCircle, CheckCircle } from 'lucide-react';

export default function CouponsIndex({ filters, coupons, canViewAll  }) {
  const { data, setData, reset } = useForm({
    search: filters.search || '',
  });

    const { auth } = usePage().props;
  const currentUserName = auth.user.name;

  const [selected, setSelected] = useState(new Set());

  const fetchData = () => {
    router.get(route('coupons.index'), { search: data.search }, { preserveState: true });
  };

  const clearFilters = () => {
    reset('search');
    router.get(route('coupons.index'));
  };

  function formatDateYMD(isoDateString) {
  if (!isoDateString) return '—';
  // Grab YYYY-MM-DD
  const [datePart] = isoDateString.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  // Construct as local-date
  const dt = new Date(year, month - 1, day);
  return dt.toLocaleDateString(undefined, {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  });
}

  return (
    <AppLayout>
      <Head title="Coupons" />

      <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Your Coupons</h1>
          <Link href={route('coupons.create')}>
            <Button>
              <Plus className="w-4 h-4 mr-1" /> New Coupon
            </Button>
          </Link>
        </header>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search code..."
            value={data.search}
            onChange={e => setData('search', e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" onClick={fetchData}>Search</Button>
          <Button variant="outline" onClick={clearFilters}>Clear</Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead><Hash /></TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Global?</TableHead>
                {canViewAll && <TableHead>Agent</TableHead>}
                <TableHead>Packages</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Active?</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    No coupons found.
                  </TableCell>
                </TableRow>
              )}
              {coupons.data.map(c => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.code}</TableCell>
                  <TableCell className="capitalize">{c.discount_type}</TableCell>
                  <TableCell>
                    {c.discount_type === 'fixed'
                      ? `$ ${c.discount_value}`
                      : `${c.discount_value}%`}
                  </TableCell>
                  <TableCell>{formatDateYMD(c.expires_at)}</TableCell>
                  <TableCell>
                    <Badge variant={c.is_global ? 'success' : 'outline'}>
                      {c.is_global ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  {canViewAll && <TableCell>
                      {c.owner_name === currentUserName ? 'Me' : c.owner_name}
                    </TableCell>}
                  <TableCell>{c.package_count}</TableCell>
                  <TableCell>{c.uses_count}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(c.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.is_active ? 'success' : 'outline'}>
                        {c.is_active ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    {c.is_active ? (
                    <Button
                        size="sm"
                        variant="default"
                        title='Deactivate the Coupon'
                        onClick={() =>
                        router.patch(route('coupons.toggleActive', c.id), {}, {
                            preserveState: true,
                            preserveScroll: true,
                        })
                        }
                    >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                    </Button>
                    ) : (
                    <Button
                        size="sm"
                        variant="outline"
                        title='Activate the Coupon'
                        onClick={() =>
                        router.patch(route('coupons.toggleActive', c.id), {}, {
                            preserveState: true,
                            preserveScroll: true,
                        })
                        }
                    >
                        <XCircle className="w-4 h-4 text-red-600" />
                    </Button>
                    )}
                    {/* <Link href={route('coupons.edit', c.id)}>
                      <Button size="sm" variant="outline">Edit</Button>
                    </Link> */}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm('Delete this coupon?')) {
                          router.delete(route('coupons.destroy', c.id), {
                            onSuccess: () => fetchData(),
                          });
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center">
          {coupons.links.map((link, idx) => (
            <Link
              key={idx}
              href={link.url || '#'}
              className={`px-3 py-1 mx-1 rounded ${
                link.active ? 'bg-primary text-white' : 'bg-gray-100'
              }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
