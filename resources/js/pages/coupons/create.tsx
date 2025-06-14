import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Gift, Calendar, Hash, Percent, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MultiSelect } from '@/components/multi-select';

export default function CreateCoupon({ packages }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    code: '',
    discount_type: 'fixed',
    discount_value: '',
    expires_at: '',
    max_uses: '',
    is_global: false,
    is_active: false,
    package_ids: [] as string[],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('coupons.store'), {
      onSuccess: () => reset(),
    });
  };

  return (
    <AppLayout>
      <Head title="Create Coupon" />

      <div className="flex flex-col gap-6 p-6  rounded-xl shadow-sm">
        <header className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
              className="flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <h1 className="text-2xl font-semibold">Create New Coupon</h1>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="w-5 h-5" />
                <span>Coupon Details</span>
              </CardTitle>
              <CardDescription>
                Define your coupon code and discount
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Code */}
              <div className="space-y-2">
                <Label htmlFor="code">Code <span className="text-red-500">*</span></Label>
                <Input
                  id="code"
                  value={data.code}
                  onChange={e => setData('code', e.target.value)}
                  placeholder="e.g. SPRING50"
                  className={errors.code ? 'border-red-500' : ''}
                />
                {errors.code && <p className="text-sm text-red-600">{errors.code}</p>}
              </div>

              {/* Discount Type */}
              <div className="space-y-2">
                <Label>Type <span className="text-red-500">*</span></Label>
                <div className="flex space-x-2">
                  <Button
                    variant={data.discount_type === 'fixed' ? 'default' : 'outline'}
                    onClick={() => setData('discount_type', 'fixed')}
                    className="flex-1"
                  >
                    <Hash className="w-4 h-4 mr-1" /> Fixed
                  </Button>
                  <Button
                    variant={data.discount_type === 'percentage' ? 'default' : 'outline'}
                    onClick={() => setData('discount_type', 'percentage')}
                    className="flex-1"
                  >
                    <Percent className="w-4 h-4 mr-1" /> %
                  </Button>
                </div>
                {errors.discount_type && <p className="text-sm text-red-600">{errors.discount_type}</p>}
              </div>

              {/* Discount Value */}
              <div className="space-y-2">
                <Label htmlFor="discount_value">Value <span className="text-red-500">*</span></Label>
                <Input
                  id="discount_value"
                  type="number"
                  value={data.discount_value}
                  onChange={e => setData('discount_value', e.target.value)}
                  placeholder="Amount or %"
                  className={errors.discount_value ? 'border-red-500' : ''}
                />
                {errors.discount_value && <p className="text-sm text-red-600">{errors.discount_value}</p>}
              </div>

              {/* Expires At */}
              <div className="space-y-2">
                <Label htmlFor="expires_at">Expires At</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="expires_at"
                    type="date"
                    value={data.expires_at}
                    onChange={e => setData('expires_at', e.target.value)}
                    className={`pl-10 ${errors.expires_at ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.expires_at && <p className="text-sm text-red-600">{errors.expires_at}</p>}
              </div>

              {/* Max Uses */}
              <div className="space-y-2">
                <Label htmlFor="max_uses">Max Uses</Label>
                <Input
                  id="max_uses"
                  type="number"
                  value={data.max_uses}
                  onChange={e => setData('max_uses', e.target.value)}
                  placeholder="Unlimited if blank"
                  className={errors.max_uses ? 'border-red-500' : 'dark:bg-gray-700 dark:text-gray-300'}
                />
                {errors.max_uses && <p className="text-sm text-red-600">{errors.max_uses}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Scope & Attachments</span>
              </CardTitle>
              <CardDescription>
                Who this coupon applies to
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Global Switch */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Global</Label>
                  <p className="text-sm text-gray-500">
                    Applies to all your packages
                  </p>
                </div>
                <Switch
                  checked={data.is_global}
                  onCheckedChange={checked => setData('is_global', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                    <Label>Active</Label>
                    <p className="text-sm text-gray-500">Only active coupons can be used</p>
                </div>
                <Switch
                    checked={data.is_active}
                    onCheckedChange={checked => setData('is_active', checked)}
                />
                </div>

              {/* Package multi-select (only if not global) */}
              {!data.is_global && (
                <div className="space-y-2">
                  <Label>Attach to Packages</Label>
                  <MultiSelect
                    options={packages.map(p => ({ value: String(p.id), label: p.title }))}
                    value={data.package_ids}
                    onValueChange={ids => setData('package_ids', ids)}
                    placeholder="Select one or more packages"
                    />
                  {errors.package_ids && <p className="text-sm text-red-600">{errors.package_ids}</p>}
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => window.history.back()} disabled={processing}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Saving…' : 'Save Coupon'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
