import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield } from "lucide-react";
import { PackageFormData } from "@/types";

interface PoliciesStepProps {
  data: PackageFormData;
  setData: (key: keyof PackageFormData, value: any) => void;
  errors: Record<string, string>;
}

export default function PoliciesStep({ data, setData, errors }: PoliciesStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Settings & Policies</h3>

      {/* Package Settings */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-700">Package Settings</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Visibility Setting */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Visibility</Label>
            <Select value={data.visibility} onValueChange={(value) => setData('visibility', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Visible to everyone</SelectItem>
                <SelectItem value="private">Private - Only visible to you</SelectItem>
                <SelectItem value="agents_only">Agents Only - Visible to agents</SelectItem>
              </SelectContent>
            </Select>
            {errors.visibility && <p className="text-sm text-red-600">{errors.visibility}</p>}
          </div>

          {/* Package Toggles */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={data.is_active}
                onCheckedChange={(checked) => setData('is_active', !!checked)}
              />
              <Label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active Package
              </Label>
            </div>
            <p className="text-xs text-gray-500 ml-6">Package is available for booking</p>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={data.is_featured}
                onCheckedChange={(checked) => setData('is_featured', !!checked)}
              />
              <Label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                Featured Package
              </Label>
            </div>
            <p className="text-xs text-gray-500 ml-6">Display in featured packages section</p>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_refundable"
                checked={data.is_refundable}
                onCheckedChange={(checked) => setData('is_refundable', !!checked)}
              />
              <Label htmlFor="is_refundable" className="text-sm font-medium text-gray-700">
                Refundable
              </Label>
            </div>
            <p className="text-xs text-gray-500 ml-6">Allow refunds for this package</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Terms and Conditions */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-700">Terms & Conditions</h4>
        
        <div className="space-y-2">
          <Label htmlFor="terms_and_conditions" className="text-sm font-medium text-gray-700">
            Terms and Conditions
          </Label>
          <Textarea
            id="terms_and_conditions"
            placeholder="Enter terms and conditions for this package..."
            value={data.terms_and_conditions}
            onChange={(e) => setData('terms_and_conditions', e.target.value)}
            className="w-full min-h-[120px] resize-y"
          />
          <p className="text-xs text-gray-500">
            Include important terms, conditions, and requirements for this package
          </p>
          {errors.terms_and_conditions && (
            <p className="text-sm text-red-600">{errors.terms_and_conditions}</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Cancellation Policy */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-700">Cancellation Policy</h4>
        
        <div className="space-y-2">
          <Label htmlFor="cancellation_policy" className="text-sm font-medium text-gray-700">
            Cancellation Policy
          </Label>
          <Textarea
            id="cancellation_policy"
            placeholder="Enter cancellation policy for this package..."
            value={data.cancellation_policy}
            onChange={(e) => setData('cancellation_policy', e.target.value)}
            className="w-full min-h-[120px] resize-y"
          />
          <p className="text-xs text-gray-500">
            Define cancellation terms, deadlines, and refund policies
          </p>
          {errors.cancellation_policy && (
            <p className="text-sm text-red-600">{errors.cancellation_policy}</p>
          )}
        </div>
      </div>

      {/* Policy Templates */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h5 className="text-sm font-medium text-blue-900 mb-1">Policy Guidelines</h5>
            <p className="text-sm text-blue-700">
              Ensure your terms and cancellation policies are clear and comply with local regulations. 
              Include details about booking changes, refund timelines, and any non-refundable fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}