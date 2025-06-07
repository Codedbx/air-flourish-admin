"use client";

import React, { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  DollarSign,
  Package as PackageIcon,
  ChevronDown,
  Download,
  RefreshCw,
  Users,
  Star,
  Menu,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/alert-dialog";

type Activity = {
  id: number;
  title: string;
  location: string;
  price: string;
  // ...any other fields you might need
};

type PackageMedia = {
  id: number;
  name: string;
  original_url: string;
};

type Package = {
  id: number;
  title: string;
  description: string;
  base_price: string;
  booking_start_date: string; // e.g. "2025-06-04T00:00:00.000000Z"
  booking_end_date: string;   // e.g. "2025-06-12T00:00:00.000000Z"
  activities: Activity[];
  is_active: boolean;
  is_featured: boolean;
  is_refundable: boolean;
  location: string;
  visibility: string;

  // Flight fields:
  flight_from: string | null;
  flight_to: string | null;
  airline_name: string | null;
  booking_class: string | null;

  // Hotel fields:
  hotel_name: string | null;
  hotel_star_rating: number | null;
  hotel_checkin: string | null; // e.g. "2025-06-05T00:00:00.000000Z"
  hotel_checkout: string | null; // e.g. "2025-06-13T00:00:00.000000Z"

  media: PackageMedia[];
};

interface PackagesPayload {
  packages: {
    data: Package[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
      label: string;
      url: string | null;
      active: boolean;
    }[];
  };
  filters: Record<string, string> | string[];
}

const PackagesTable = () => {
  const { packages, filters } = usePage().props as unknown as PackagesPayload;

  // Coerce filters to an object if it arrived as an array
  const filtersObj = Array.isArray(filters) ? {} : filters || {};

  const [packageData, setPackageData] = useState<Package[]>(packages.data || []);
  const [meta, setMeta] = useState({
    current_page: packages.current_page || 1,
    last_page: packages.last_page || 1,
    per_page: packages.per_page || 5,
    total: packages.total || 0,
    links: packages.links || [],
  });

  // Filter inputs
  const [search, setSearch] = useState(filtersObj.search || "");
  const [destination, setDestination] = useState(filtersObj.destination || "");
  const [priceMin, setPriceMin] = useState(filtersObj.price_min || "");
  const [priceMax, setPriceMax] = useState(filtersObj.price_max || "");
  const [dateStart, setDateStart] = useState(filtersObj.date_start || "");
  const [dateEnd, setDateEnd] = useState(filtersObj.date_end || "");
  const [activities, setActivities] = useState(filtersObj.activities || "");
  const [sort, setSort] = useState(filtersObj.sort || "id");
  const [direction, setDirection] = useState(filtersObj.direction || "desc");

  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  // Re-sync when Inertia props change
  useEffect(() => {
    setPackageData(packages.data || []);
    setMeta({
      current_page: packages.current_page || 1,
      last_page: packages.last_page || 1,
      per_page: packages.per_page || 5,
      total: packages.total || 0,
      links: packages.links || [],
    });

    setSearch(filtersObj.search || "");
    setDestination(filtersObj.destination || "");
    setPriceMin(filtersObj.price_min || "");
    setPriceMax(filtersObj.price_max || "");
    setDateStart(filtersObj.date_start || "");
    setDateEnd(filtersObj.date_end || "");
    setActivities(filtersObj.activities || "");
    setSort(filtersObj.sort || "id");
    setDirection(filtersObj.direction || "desc");
  }, [packages, filtersObj]);

  // Format ISO date → "Jun 4, 2025"
  const formatDate = (iso: string | null) => {
    if (!iso) return "";
    const datePart = iso.split("T")[0]; // "2025-06-04"
    return new Date(datePart).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format price string → "$300.00"
  const formatPrice = (price: string) =>
    `$${Number.parseFloat(price).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const openDeleteDialog = (pkg: Package) => {
    setSelectedPackage(pkg);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedPackage) return;
    router.delete(route("packages.destroy", selectedPackage.id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setPackageData((prev) => prev.filter((p) => p.id !== selectedPackage.id));
        setDeleteDialogOpen(false);
        setSelectedPackage(null);
      },
    });
  };

  // Build query object for filters/sort
  const buildQuery = (overrides: Record<string, string | number> = {}) => {
    const query: Record<string, string | number> = { sort, direction, ...overrides };
    if (search) query.search = search;
    if (destination) query.destination = destination;
    if (priceMin) query.price_min = priceMin;
    if (priceMax) query.price_max = priceMax;
    if (dateStart) query.date_start = dateStart;
    if (dateEnd) query.date_end = dateEnd;
    if (activities) query.activities = activities;
    return query;
  };

  // Handle search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isAllBlank =
      !search && !destination && !priceMin && !priceMax && !dateStart && !dateEnd && !activities;
    if (isAllBlank) {
      router.get(route("packages.index"), {}, { preserveState: true, preserveScroll: true });
      return;
    }
    router.get(route("packages.index"), buildQuery(), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Handle sort dropdown change
  const handleSortChange = (val: string) => {
    const [newSort, newDirection] = val.split("|");
    setSort(newSort);
    setDirection(newDirection);
    router.get(
      route("packages.index"),
      buildQuery({ sort: newSort, direction: newDirection }),
      { preserveState: true, preserveScroll: true }
    );
  };

  // Apply all filters
  const applyFilters = () => {
    handleSearchSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  // Clear all filters and reload
  const clearFilters = () => {
    setSearch("");
    setDestination("");
    setPriceMin("");
    setPriceMax("");
    setDateStart("");
    setDateEnd("");
    setActivities("");
    setSort("id");
    setDirection("desc");

    router.get(route("packages.index"), {}, { preserveState: true, preserveScroll: true });
  };

  // Convenience for refresh button
  const refreshAll = () => {
    clearFilters();
  };

  // Pagination navigation
  const goToPage = (url: string | null) => {
    if (!url) return;
    router.visit(url, { preserveState: true, preserveScroll: true });
  };

  // Returns a badge for status/featured
  const getStatusBadge = (pkg: Package) => {
    if (pkg.is_featured) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
          <Star className="w-3 h-3 mr-1" />
          Featured
        </Badge>
      );
    }
    if (pkg.is_active) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
          Active
        </Badge>
      );
    }
    return <Badge variant="secondary" className="text-xs">Inactive</Badge>;
  };

  // Renders up to 2 images, with a +N indicator if more exist
  const renderImagesColumn = (media: PackageMedia[]) => {
    if (!media || media.length === 0) {
      return (
        <div className="flex items-center justify-center w-16 h-12 bg-gray-100 rounded border-2 border-dashed border-gray-300">
          <span className="text-xs text-gray-400">No images</span>
        </div>
      );
    }
    const displayImages = media.slice(0, 2);
    const remainingCount = media.length - displayImages.length;

    return (
      <div className="flex items-center space-x-1">
        {displayImages.map((image) => (
          <div key={image.id} className="relative">
            <img
              src={image.original_url}
              alt={image.name}
              className="w-10 h-10 object-cover rounded border border-gray-200"
            />
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded border border-gray-200">
            <span className="text-xs font-medium text-gray-600">+{remainingCount}</span>
          </div>
        )}
      </div>
    );
  };

  // Determine if any filter is active (to show the "Clear Filters" button)
  const anyFilterActive =
    !!search ||
    !!destination ||
    !!priceMin ||
    !!priceMax ||
    !!dateStart ||
    !!dateEnd ||
    !!activities;

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Travel Packages</h1>
          <p className="text-sm text-gray-600 mt-1">Manage packages ({meta.total} total)</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Mobile “Options” toggle */}
          <Button
            variant="outline"
            size="sm"
            className="sm:hidden"
            onClick={() => setShowFilters((p) => !p)}
          >
            <Menu className="h-4 w-4 mr-2" />
            Options
          </Button>

          {/* Desktop buttons / Mobile dropdown */}
          <div
            className={`${
              showFilters ? "flex" : "hidden"
            } flex-col w-full space-y-2 sm:flex sm:flex-row sm:w-auto sm:space-y-0 sm:space-x-3`}
          >
            <Button variant="outline" onClick={refreshAll} className="w-full sm:w-auto">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => router.visit(route("packages.create"))} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create Package
            </Button>
          </div>
        </div>
      </div>

      {/* Search + Sort + Clear Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 w-full lg:w-2/3"
          >
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full"
              />
              {search && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearch("")}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button type="submit" variant="default" className="w-full sm:w-auto">
              Search
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Show Advanced Filters</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowFilters((p) => !p)}>
                  {showFilters ? "Hide" : "Show"} Advanced Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </form>

          {/* Sort Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 w-full lg:w-1/3">
            <Select
              value={`${sort}|${direction}`}
              onValueChange={handleSortChange}
              className="w-full sm:w-48"
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title|asc">Title (A → Z)</SelectItem>
                <SelectItem value="title|desc">Title (Z → A)</SelectItem>
                <SelectItem value="base_price|asc">Price (Low → High)</SelectItem>
                <SelectItem value="base_price|desc">Price (High → Low)</SelectItem>
                <SelectItem value="booking_start_date|asc">
                  Booking Start (Earliest → Latest)
                </SelectItem>
                <SelectItem value="booking_start_date|desc">
                  Booking Start (Latest → Earliest)
                </SelectItem>
              </SelectContent>
            </Select>

            {anyFilterActive && (
              <Button variant="outline" className="sm:ml-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Destination */}
              <div className="relative">
                <Label htmlFor="destination-filter" className="text-sm font-medium">
                  Destination
                </Label>
                <Input
                  id="destination-filter"
                  placeholder="e.g. Paris"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="mt-2 w-full"
                />
                {destination && (
                  <button
                    type="button"
                    className="absolute right-3 top-[2.5rem] text-gray-400 hover:text-gray-600"
                    onClick={() => setDestination("")}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Price Range</Label>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      className="w-full"
                    />
                    {priceMin && (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setPriceMin("")}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      className="w-full"
                    />
                    {priceMax && (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setPriceMax("")}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking Date Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Booking Date Range</Label>
                <div className="flex flex-col space-y-2">
                  <div className="relative">
                    <Input
                      type="date"
                      value={dateStart}
                      onChange={(e) => setDateStart(e.target.value)}
                      className="w-full"
                    />
                    {dateStart && (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setDateStart("")}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      type="date"
                      value={dateEnd}
                      onChange={(e) => setDateEnd(e.target.value)}
                      className="w-full"
                    />
                    {dateEnd && (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setDateEnd("")}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Activities IDs */}
              <div className="relative">
                <Label htmlFor="activities-filter" className="text-sm font-medium">
                  Activities (IDs)
                </Label>
                <Input
                  id="activities-filter"
                  placeholder="e.g. 1,2,5"
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                  className="mt-2 w-full"
                />
                {activities && (
                  <button
                    type="button"
                    className="absolute right-3 top-[2.5rem] text-gray-400 hover:text-gray-600"
                    onClick={() => setActivities("")}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <p className="text-xs text-gray-500 mt-1">Enter comma-separated activity IDs</p>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <Button variant="default" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="table-auto min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Images
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activities
                </th>
                <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visibility
                </th>
                <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Refundable
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Start
                </th>
                <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking End
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flight
                </th>
                <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotel
                </th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packageData.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                  {/* Images */}
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {renderImagesColumn(pkg.media)}
                  </td>

                  {/* Package title/description */}
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{pkg.title}</div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[100px] sm:max-w-xs">
                        {pkg.description}
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-red-500 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm text-gray-900">{pkg.location}</span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-green-500 mr-0 sm:mr-1" />
                      <span className="text-xs sm:text-sm font-medium text-gray-900">
                        {formatPrice(pkg.base_price)}
                      </span>
                    </div>
                  </td>

                  {/* Activities */}
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div title={pkg.activities.map((a) => a.title).join(", ")}>
                      <Badge
                        variant={pkg.activities.length > 0 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        <Users className="w-3 h-3 mr-1" />
                        {pkg.activities.length}
                      </Badge>
                    </div>
                  </td>

                  {/* Visibility */}
                  <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                    <Badge variant="outline" className="capitalize text-xs">
                      {pkg.visibility}
                    </Badge>
                  </td>

                  {/* Refundable */}
                  <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={pkg.is_refundable ? "default" : "secondary"}
                      className={`text-xs ${pkg.is_refundable ? "bg-green-100 text-green-800" : ""}`}
                    >
                      {pkg.is_refundable ? "Yes" : "No"}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{getStatusBadge(pkg)}</td>

                  {/* Booking Start */}
                  <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-xs sm:text-sm text-gray-900">
                        {formatDate(pkg.booking_start_date)}
                      </span>
                    </div>
                  </td>

                  {/* Booking End */}
                  <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-xs sm:text-sm text-gray-900">
                        {formatDate(pkg.booking_end_date)}
                      </span>
                    </div>
                  </td>

                  {/* Flight */}
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {pkg.flight_from && pkg.flight_to ? (
                      <div className="text-xs sm:text-sm text-gray-900">
                        {pkg.flight_from.toUpperCase()} → {pkg.flight_to.toUpperCase()}
                        {pkg.booking_class && pkg.airline_name && (
                          <span className="block text-gray-500 text-[10px] sm:text-xs">
                            (class: {pkg.booking_class}, airline: {pkg.airline_name})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">—</span>
                    )}
                  </td>

                  {/* Hotel */}
                  <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                    {pkg.hotel_name ? (
                      <div className="text-xs sm:text-sm text-gray-900">
                        {pkg.hotel_name}{" "}
                        {pkg.hotel_star_rating !== null && (
                          <span className="ml-1 text-yellow-600 text-[10px] sm:text-xs">
                            ★{pkg.hotel_star_rating}
                          </span>
                        )}
                        {pkg.hotel_checkin && pkg.hotel_checkout && (
                          <span className="block text-gray-500 text-[10px] sm:text-xs">
                            check-in: {formatDate(pkg.hotel_checkin)} → check-out:{" "}
                            {formatDate(pkg.hotel_checkout)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2 sm:px-4">
                          <span className="hidden sm:inline">Actions</span>
                          <ChevronDown className="w-4 h-4 sm:ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.visit(route("packages.show", pkg.id))}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.visit(route("packages.edit", pkg.id))}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Package
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(pkg)}
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

        {packageData.length === 0 && (
          <div className="text-center py-12">
            <PackageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No packages found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search.</p>
          </div>
        )}

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 sm:px-6">
            {/* Mobile: Previous / Next */}
            <div className="flex flex-1 justify-between w-full sm:hidden">
              <Button
                variant="outline"
                onClick={() => goToPage(meta.links[0]?.url || null)}
                disabled={!meta.links[0]?.url}
                className="w-24"
              >
                Previous
              </Button>
              <div className="flex items-center justify-center px-4">
                <span className="text-sm text-gray-700">
                  Page {meta.current_page} of {meta.last_page}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() => goToPage(meta.links[meta.links.length - 1]?.url || null)}
                disabled={!meta.links[meta.links.length - 1]?.url}
                className="w-24"
              >
                Next
              </Button>
            </div>

            {/* Desktop: numbered links */}
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(meta.current_page - 1) * meta.per_page + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(meta.current_page * meta.per_page, meta.total)}
                  </span>{" "}
                  of <span className="font-medium">{meta.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {meta.links.map((link, idx) => {
                    const labelText = link.label.replace(/&laquo;|&raquo;/g, (m) =>
                      m === "&laquo;" ? "«" : "»"
                    );
                    if (!link.url) {
                      return (
                        <Button key={idx} variant="outline" size="sm" disabled>
                          {labelText}
                        </Button>
                      );
                    }
                    return (
                      <Button
                        key={idx}
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(link.url)}
                      >
                        {labelText}
                      </Button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setTimeout(() => {
              setDeleteDialogOpen(false);
              setSelectedPackage(null);
            }, 100);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Package</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this package? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PackagesTable;
