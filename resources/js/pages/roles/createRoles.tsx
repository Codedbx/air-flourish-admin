// resources/js/Pages/roles/Create.jsx

import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
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
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  Users,
  Shield,
  Save,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Permission {
  id: number;
  name: string;
  description: string | null;
}

type PageProps = {
  permissions: Permission[];           // flat array
  errors: Record<string, string>;      // validation errors
  flash?: { success?: string };        // optional flash message
};

export default function CreateRole() {
  const { permissions, errors, flash } = usePage<PageProps>().props;

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Roles", href: "/roles" },
    { title: "Create Role", href: "/roles/create" },
  ];

  const { data, setData, post, processing, reset } = useForm({
    name: "",
    guard_name: "web" as "web" | "api",
    permissions: [] as string[],
  });

  // Toggle a permission by its name
  const togglePermission = (permName: string) => {
    if (data.permissions.includes(permName)) {
      setData(
        "permissions",
        data.permissions.filter((p) => p !== permName)
      );
    } else {
      setData("permissions", [...data.permissions, permName]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("roles.store"), {
      preserveScroll: true,
      onSuccess: () => reset(),
    });
  };

  const selectedCount = data.permissions.length;
  const totalCount    = permissions.length;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Role" />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Flash “success” banner */}
        {flash?.success && (
          <div className="rounded-md bg-green-100 p-3 text-green-700">
            {flash.success}
          </div>
        )}

        {/* Page header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Role
            </h1>
            <p className="text-muted-foreground">
              Define a role and assign permissions
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Role Information
              </CardTitle>
              <CardDescription>
                Basic details about this role.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Role Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. administrator"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className={cn(
                      errors.name && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Guard */}
                <div className="space-y-2">
                  <Label htmlFor="guard_name">Guard</Label>
                  <select
                    id="guard_name"
                    value={data.guard_name}
                    onChange={(e) =>
                      setData("guard_name", e.target.value as "web" | "api")
                    }
                    className={cn(
                      "block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
                      errors.guard_name &&
                        "border-destructive focus:ring-destructive"
                    )}
                  >
                    <option value="web">Web</option>
                    <option value="api">API</option>
                  </select>
                  {errors.guard_name && (
                    <p className="text-sm text-destructive">
                      {errors.guard_name}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions Card (flat list) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permissions
              </CardTitle>
              <CardDescription>
                Click on each badge to toggle a permission.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {permissions.map((perm) => {
                  const isSelected = data.permissions.includes(perm.name);
                  return (
                    <Badge
                      key={perm.id}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:scale-105",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "hover:bg-muted border-2 border-dashed"
                      )}
                      onClick={() => togglePermission(perm.name)}
                    >
                      <span className="flex items-center gap-1.5">
                        {isSelected ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Circle className="h-3 w-3" />
                        )}
                        {perm.description || perm.name}
                      </span>
                    </Badge>
                  );
                })}
              </div>

              {/* “X of Y selected” summary */}
              <div className="mt-2 text-sm text-muted-foreground">
                {selectedCount} of {totalCount} permission
                {totalCount !== 1 ? "s" : ""} selected
              </div>

              {errors.permissions && (
                <p className="text-sm text-destructive">
                  {errors.permissions}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Link
              href={route("roles.index")}
              className="text-gray-600 hover:underline"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={processing}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {processing ? "Creating..." : "Create Role"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
