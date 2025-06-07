import AppLayout from "@/layouts/app-layout"
import { Head, Link, router, usePage } from "@inertiajs/react"
import { useState } from "react"
import {
  ArrowLeft,
  Building,
  Users,
  Shield,
  Crown,
  Phone,
  MapPin,
  Globe,
  Home,
  Mail,
  CreditCard,
  Pencil,
  Power,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "@/components/ui/alert-dialog"

import type { BreadcrumbItem } from "@/types"

type Role = {
  id: number
  name: string
  guard_name: string
}

type User = {
  id: number
  name: string
  business_name: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  zip_code: string | null
  email: string
  cac_reg_no: string | null
  active: boolean
  email_verified_at: string | null
  created_at: string
  updated_at: string
  roles: Role[]
  media?: {
    id: number
    file_name: string
    mime_type: string
    original_url: string
    collection_name: string
  }[]
}

type PageProps = {
  user: User
  [key: string]: unknown
}

export default function ShowUser() {
  const { user } = usePage<PageProps>().props
  const [isToggling, setIsToggling] = useState(false)

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Users",
      href: route("users.index"),
    },
    {
      title: user.name,
      href: route("users.show", user.id),
    },
  ]

  const toggleUserActive = () => {
    setIsToggling(true)
    router.visit(route("users.toggleActive", user.id), {
      method: "get",
      preserveScroll: true,
      onFinish: () => setIsToggling(false),
    })
  }

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case "admin":
        return Crown
      case "manager":
        return Shield
      case "user":
        return Users
      default:
        return Users
    }
  }

  const getProfileImage = () => {
    if (user.media && user.media.length > 0) {
      const profileImage = user.media.find((m) => m.collection_name === "profile_image")
      return profileImage?.original_url || null
    }
    return null
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`User: ${user.name}`} />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="p-4 sm:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Users</span>
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">User Details</h1>
                <p className="text-sm text-gray-600 mt-1">View information for {user.name}</p>
              </div>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Link href={route("users.edit", user.id)}>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Pencil className="w-4 h-4" />
                  <span>Edit User</span>
                </Button>
              </Link>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant={user.active ? "destructive" : "default"}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Power className="w-4 h-4" />
                    <span>{user.active ? "Deactivate" : "Activate"}</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{user.active ? "Deactivate User" : "Activate User"}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {user.active
                        ? `Are you sure you want to deactivate ${user.name}? They will no longer be able to log in.`
                        : `Are you sure you want to activate ${user.name}? They will be able to log in again.`}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={toggleUserActive}
                      disabled={isToggling}
                      className={user.active ? "bg-destructive hover:bg-destructive/90" : ""}
                    >
                      {isToggling ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          {user.active ? "Deactivating..." : "Activating..."}
                        </>
                      ) : (
                        <>{user.active ? "Deactivate" : "Activate"}</>
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* User Profile Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>User Profile</span>
              </CardTitle>
              <CardDescription>Overview of user information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="w-24 h-24 border">
                    <AvatarImage src={getProfileImage() || ""} alt={user.name} />
                    <AvatarFallback className="text-2xl">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role) => {
                      const Icon = getRoleIcon(role.name)
                      return (
                        <Badge key={role.name} className="capitalize">
                          <div className="flex items-center gap-1.5">
                            <Icon className="w-3 h-3" />
                            <span>{role.name}</span>
                          </div>
                        </Badge>
                      )
                    })}

                    <Badge variant={user.active ? "default" : "destructive"}>
                      {user.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Member since:</span>{" "}
                      {formatDate(user.created_at)}
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Email verified:</span>{" "}
                      {user.email_verified_at ? formatDate(user.email_verified_at) : "Not verified"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business & Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Business & Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Business Name</p>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <p>{user.business_name || "N/A"}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <p>{user.phone || "N/A"}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">CAC Reg. No</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <p>{user.cac_reg_no || "N/A"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Address Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p>{user.address || "N/A"}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">City</p>
                    <p>{user.city || "N/A"}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">State</p>
                    <p>{user.state || "N/A"}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Country</p>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <p>{user.country || "N/A"}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Zip Code</p>
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-muted-foreground" />
                      <p>{user.zip_code || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents & Media */}
          {user.media && user.media.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Documents & Media</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.media.map((media) => (
                    <div key={media.id} className="border rounded-md p-3 space-y-2">
                      <p className="font-medium capitalize">{media.collection_name.replace("_", " ")}</p>
                      <div className="aspect-video bg-muted rounded-md overflow-hidden">
                        {media.mime_type.startsWith("image/") ? (
                          <img
                            src={media.original_url || "/placeholder.svg"}
                            alt={media.file_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">{media.file_name}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <a
                          href={media.original_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related Data */}
          <Card>
            <CardHeader>
              <CardTitle>Related Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Packages</h3>
                  <Link
                    href={route("packages.index", { owner_id: user.id })}
                    className="text-primary hover:underline text-sm"
                  >
                    View User Packages
                  </Link>
                </div>

                {/* <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Activities</h3>
                  <Link
                    href={route("activities.index", { agent_id: user.id })}
                    className="text-primary hover:underline text-sm"
                  >
                    View User Activities
                  </Link>
                </div> */}

                {/* <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Bookings</h3>
                  <Link
                    href={route("bookings.index", { user_id: user.id })}
                    className="text-primary hover:underline text-sm"
                  >
                    View User Bookings
                  </Link>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
