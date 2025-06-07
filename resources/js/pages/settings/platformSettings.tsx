import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  DollarSign,
  Percent,
  Save,
  RefreshCw,
  Edit3,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface PlatformSetting {
  id?: number;
  admin_addon_type: 'percentage' | 'fixed';
  admin_addon_amount: string;
  espees_rate: string;
  naira_rate: string;
  exists?: boolean;
}

type PageProps = {
  settings: PlatformSetting;
  hasExistingSettings: boolean;
  errors: Record<string, string>;
  flash?: { success?: string; error?: string };
};

export default function PlatformSettings() {
  const { settings, hasExistingSettings, errors, flash } = usePage<PageProps>().props;
  const [isEditing, setIsEditing] = useState(!hasExistingSettings);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Settings", href: "/settings" },
    { title: "Platform Settings", href: "/settings/platform" },
  ];

  const { data, setData, put, processing, reset, isDirty, setDefaults } = useForm({
    admin_addon_type: settings?.admin_addon_type || 'fixed',
    admin_addon_amount: settings?.admin_addon_amount || '',
    espees_rate: settings?.espees_rate || '',
    naira_rate: settings?.naira_rate || '',
  });

  // Set form defaults when component mounts
  useEffect(() => {
    setDefaults({
      admin_addon_type: settings?.admin_addon_type || 'fixed',
      admin_addon_amount: settings?.admin_addon_amount || '',
      espees_rate: settings?.espees_rate || '',
      naira_rate: settings?.naira_rate || '',
    });
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("settings.platform.update"), {
      preserveScroll: true,
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const handleReset = () => {
    reset();
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Platform Settings" />

      <div className="max-w-5xl sm:w-full mx-auto p-6 space-y-6">
        {/* Flash Messages */}
        {flash?.success && (
          <div className="rounded-md bg-green-100 p-3 text-green-700 border border-green-200">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-600 rounded-full"></div>
              {flash.success}
            </div>
          </div>
        )}

        {flash?.error && (
          <div className="rounded-md bg-red-100 p-3 text-red-700 border border-red-200">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-red-600 rounded-full"></div>
              {flash.error}
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Platform Settings
              </h1>
              <p className="text-muted-foreground">
                Configure platform rates and admin fees
              </p>
            </div>
          </div>
          
          {/* Edit Toggle */}
          <div className="flex items-center gap-2">
            {isEditing && isDirty && (
              <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
                Unsaved changes
              </div>
            )}
            
            {!isEditing && hasExistingSettings && (
              <Button
                onClick={handleEdit}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit Settings
              </Button>
            )}
            
            {isEditing && hasExistingSettings && (
              <Button
                onClick={handleCancel}
                variant="ghost"
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Admin Addon Settings */}
          <Card className={cn(!isEditing && "bg-muted/30")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Admin Addon Configuration
              </CardTitle>
              <CardDescription>
                Configure how admin fees are calculated and applied to transactions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Admin Addon Type */}
                <div className="space-y-2">
                  <Label htmlFor="admin_addon_type">
                    Admin Addon Type
                  </Label>
                  {isEditing ? (
                    <Select
                      value={data.admin_addon_type}
                      onValueChange={(value) => 
                        setData("admin_addon_type", value as 'percentage' | 'fixed')
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          errors.admin_addon_type && 
                          "border-destructive focus:ring-destructive"
                        )}
                      >
                        <SelectValue placeholder="Select addon type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">
                          <div className="flex items-center gap-2">
                            <Percent className="h-4 w-4" />
                            Percentage
                          </div>
                        </SelectItem>
                        <SelectItem value="fixed">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Fixed Amount
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2 h-10 w-full rounded-md border bg-muted px-3 py-2 text-sm">
                      {data.admin_addon_type === 'percentage' ? (
                        <>
                          <Percent className="h-4 w-4" />
                          Percentage
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-4 w-4" />
                          Fixed Amount
                        </>
                      )}
                    </div>
                  )}
                  {errors.admin_addon_type && (
                    <p className="text-sm text-destructive">
                      {errors.admin_addon_type}
                    </p>
                  )}
                </div>

                {/* Admin Addon Amount */}
                <div className="space-y-2">
                  <Label htmlFor="admin_addon_amount">
                    Admin Addon Amount
                    <span className="text-xs text-muted-foreground ml-1">
                      ({data.admin_addon_type === 'percentage' ? '%' : '₦'})
                    </span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="admin_addon_amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder={data.admin_addon_type === 'percentage' ? "Enter percentage" : "Enter amount"}
                      value={data.admin_addon_amount}
                      onChange={(e) => setData("admin_addon_amount", e.target.value)}
                      disabled={!isEditing}
                      className={cn(
                        "pl-8",
                        !isEditing && "bg-muted cursor-not-allowed",
                        errors.admin_addon_amount && 
                        "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {data.admin_addon_type === 'percentage' ? '%' : '₦'}
                    </div>
                  </div>
                  {errors.admin_addon_amount && (
                    <p className="text-sm text-destructive">
                      {errors.admin_addon_amount}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchange Rates */}
          <Card className={cn(!isEditing && "bg-muted/30")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                USD Exchange Rates
              </CardTitle>
              <CardDescription>
                Set how many units of each currency equal 1 USD for conversions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Espees Rate */}
                <div className="space-y-2">
                  <Label htmlFor="espees_rate">
                    Espees to USD Rate
                    <span className="text-xs text-muted-foreground ml-1">
                      (Espees per 1 USD)
                    </span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="espees_rate"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter rate"
                      value={data.espees_rate}
                      onChange={(e) => setData("espees_rate", e.target.value)}
                      disabled={!isEditing}
                      className={cn(
                        "pl-12",
                        !isEditing && "bg-muted cursor-not-allowed",
                        errors.espees_rate && 
                        "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      ESP
                    </div>
                  </div>
                  {errors.espees_rate && (
                    <p className="text-sm text-destructive">
                      {errors.espees_rate}
                    </p>
                  )}
                </div>

                {/* Naira Rate */}
                <div className="space-y-2">
                  <Label htmlFor="naira_rate">
                    Naira to USD Rate
                    <span className="text-xs text-muted-foreground ml-1">
                      (Naira per 1 USD)
                    </span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="naira_rate"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter rate"
                      value={data.naira_rate}
                      onChange={(e) => setData("naira_rate", e.target.value)}
                      disabled={!isEditing}
                      className={cn(
                        "pl-8",
                        !isEditing && "bg-muted cursor-not-allowed",
                        errors.naira_rate && 
                        "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      ₦
                    </div>
                  </div>
                  {errors.naira_rate && (
                    <p className="text-sm text-destructive">
                      {errors.naira_rate}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions - Only show when editing */}
          {isEditing && (
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={processing || !isDirty}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Changes
              </Button>
              
              <Button
                type="submit"
                disabled={processing}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {processing ? "Saving..." : hasExistingSettings ? "Update Settings" : "Create Settings"}
              </Button>
            </div>
          )}
        </form>

        {/* Settings Preview - Always visible */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Current Settings Preview</CardTitle>
            <CardDescription>
              Preview how your current settings affect transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Admin Fee Structure:</p>
                <p className="text-muted-foreground">
                  {data.admin_addon_amount 
                    ? (data.admin_addon_type === 'percentage' 
                        ? `${data.admin_addon_amount}% of transaction amount`
                        : `₦${data.admin_addon_amount} fixed fee per transaction`)
                    : 'Enter addon amount'
                  }
                </p>
              </div>
              <div>
                <p className="font-medium">Current Rates:</p>
                <p className="text-muted-foreground">
                  {data.espees_rate ? `${data.espees_rate} Espees` : 'Enter espees rate'} = $1 USD | 
                  {data.naira_rate ? ` ₦${data.naira_rate}` : ' Enter naira rate'} = $1 USD
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}