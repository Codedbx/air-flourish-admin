import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar } from "lucide-react";
import { PackageFormData } from "@/types";

interface BasicInformationStepProps {
  data: PackageFormData;
  setData: (key: keyof PackageFormData, value: any) => void;
  errors: Record<string, string>;
}

export default function BasicInformationStep({ data, setData, errors }: BasicInformationStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Package Information</h3>
      
      {/* Package Title and Description */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            Package Title *
          </Label>
          <Input
            id="title"
            placeholder="e.g., Luxury Paris Getaway"
            value={data.title}
            onChange={(e) => setData('title', e.target.value)}
            className="w-full"
            required
          />
          {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">
            Description *
          </Label>
          <Textarea
            id="description"
            placeholder="e.g., 5-day luxury package with Eiffel Tower access and river cruise"
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            className="w-full min-h-[80px] resize-none"
            required
          />
          {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
        </div>
      </div>

      {/* Base Price and Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="base_price" className="text-sm font-medium text-gray-700">
            Base Price ($) *
          </Label>
          <Input
            id="base_price"
            placeholder="e.g., 2999.99"
            type="number"
            step="0.01"
            min="0"
            value={data.base_price}
            onChange={(e) => setData('base_price', e.target.value)}
            className="w-full"
            required
          />
          {errors.base_price && <p className="text-sm text-red-600">{errors.base_price}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium text-gray-700">
            Location *
          </Label>
          <div className="relative">
            <Input
              id="location"
              placeholder="e.g., Paris, France"
              value={data.location}
              onChange={(e) => setData('location', e.target.value)}
              className="w-full pr-10"
              required
            />
            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
        </div>
      </div>

      {/* Agent Pricing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="agent_addon_price" className="text-sm font-medium text-gray-700">
            Agent Addon Price *
          </Label>
          <Input
            id="agent_addon_price"
            placeholder="e.g., 299.99 or 15 (for percentage)"
            type="number"
            step="0.01"
            min="0"
            value={data.agent_addon_price}
            onChange={(e) => setData('agent_addon_price', e.target.value)}
            className="w-full"
            required
          />
          {errors.agent_addon_price && <p className="text-sm text-red-600">{errors.agent_addon_price}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Agent Price Type *</Label>
          <Select value={data.agent_price_type} onValueChange={(value) => setData('agent_price_type', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
            </SelectContent>
          </Select>
          {errors.agent_price_type && <p className="text-sm text-red-600">{errors.agent_price_type}</p>}
        </div>
      </div>

      {/* Check-in/out Times */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="check_in_time" className="text-sm font-medium text-gray-700">
            Check-in Time *
          </Label>
          <Input
            id="check_in_time"
            type="time"
            value={data.check_in_time}
            onChange={(e) => setData('check_in_time', e.target.value)}
            className="w-full"
            required
          />
          {errors.check_in_time && <p className="text-sm text-red-600">{errors.check_in_time}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="check_out_time" className="text-sm font-medium text-gray-700">
            Check-out Time *
          </Label>
          <Input
            id="check_out_time"
            type="time"
            value={data.check_out_time}
            onChange={(e) => setData('check_out_time', e.target.value)}
            className="w-full"
            required
          />
          {errors.check_out_time && <p className="text-sm text-red-600">{errors.check_out_time}</p>}
        </div>
      </div>

      {/* Booking Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="booking_start_date" className="text-sm font-medium text-gray-700">
            Booking Start Date
          </Label>
          <div className="relative">
            <Input
              id="booking_start_date"
              type="date"
              value={data.booking_start_date}
              onChange={(e) => setData('booking_start_date', e.target.value)}
              className="w-full pr-10"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          {errors.booking_start_date && <p className="text-sm text-red-600">{errors.booking_start_date}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="booking_end_date" className="text-sm font-medium text-gray-700">
            Booking End Date
          </Label>
          <div className="relative">
            <Input
              id="booking_end_date"
              type="date"
              value={data.booking_end_date}
              onChange={(e) => setData('booking_end_date', e.target.value)}
              className="w-full pr-10"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          {errors.booking_end_date && <p className="text-sm text-red-600">{errors.booking_end_date}</p>}
        </div>
      </div>
    </div>
  );
}