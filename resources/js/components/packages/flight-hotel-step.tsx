import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PackageFormData } from "@/types";

interface FlightHotelStepProps {
  data: PackageFormData;
  setData: (key: keyof PackageFormData, value: any) => void;
  errors: Record<string, string>;
}

export default function FlightHotelStep({ data, setData, errors }: FlightHotelStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Flight & Hotel Information</h3>

      {/* Flight Information */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-700">Flight Details (Optional)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="flight_from" className="text-sm font-medium text-gray-700">
              Flight From
            </Label>
            <Input
              id="flight_from"
              placeholder="e.g., New York (JFK)"
              value={data.flight_from}
              onChange={(e) => setData('flight_from', e.target.value)}
              className="w-full"
            />
            {errors.flight_from && <p className="text-sm text-red-600">{errors.flight_from}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="flight_to" className="text-sm font-medium text-gray-700">
              Flight To
            </Label>
            <Input
              id="flight_to"
              placeholder="e.g., Paris (CDG)"
              value={data.flight_to}
              onChange={(e) => setData('flight_to', e.target.value)}
              className="w-full"
            />
            {errors.flight_to && <p className="text-sm text-red-600">{errors.flight_to}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="airline_name" className="text-sm font-medium text-gray-700">
              Airline Name
            </Label>
            <Input
              id="airline_name"
              placeholder="e.g., Air France"
              value={data.airline_name}
              onChange={(e) => setData('airline_name', e.target.value)}
              className="w-full"
            />
            {errors.airline_name && <p className="text-sm text-red-600">{errors.airline_name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking_class" className="text-sm font-medium text-gray-700">
              Booking Class
            </Label>
            <Select value={data.booking_class} onValueChange={(value) => setData('booking_class', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="premium_economy">Premium Economy</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="first">First Class</SelectItem>
              </SelectContent>
            </Select>
            {errors.booking_class && <p className="text-sm text-red-600">{errors.booking_class}</p>}
          </div>
        </div>
      </div>

      <Separator />

      {/* Hotel Information */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-700">Hotel Details (Optional)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hotel_name" className="text-sm font-medium text-gray-700">
              Hotel Name
            </Label>
            <Input
              id="hotel_name"
              placeholder="e.g., Le Meurice"
              value={data.hotel_name}
              onChange={(e) => setData('hotel_name', e.target.value)}
              className="w-full"
            />
            {errors.hotel_name && <p className="text-sm text-red-600">{errors.hotel_name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="hotel_star_rating" className="text-sm font-medium text-gray-700">
              Star Rating
            </Label>
            <Select value={data.hotel_star_rating} onValueChange={(value) => setData('hotel_star_rating', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Star</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hotel_checkin" className="text-sm font-medium text-gray-700">
              Hotel Check-in Date
            </Label>
            <Input
              id="hotel_checkin"
              type="date"
              value={data.hotel_checkin}
              onChange={(e) => setData('hotel_checkin', e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hotel_checkout" className="text-sm font-medium text-gray-700">
              Hotel Check-out Date
            </Label>
            <Input
              id="hotel_checkout"
              type="date"
              value={data.hotel_checkout}
              onChange={(e) => setData('hotel_checkout', e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}