// app/dashboard/bids/create/components/BidForm.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { api } from "@/lib/utils";
import { BidFormFields } from "@/types/bid";
import {
  Package,
  MapPin,
  Calendar,
  FileText,
  IndianRupee,
  Loader2,
  Truck,
  Plus,
} from "lucide-react";

interface BidFormProps {
  onSubmitted: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export default function BidForm({
  onSubmitted,
  isSubmitting,
  setIsSubmitting,
}: BidFormProps) {
  const [form, setForm] = useState<BidFormFields>({
    material_type: "",
    quantity: 0,
    pickup_location: "",
    delivery_location: "",
    deadline: "",
    transporter_requirements: "",
  });

  const [basePrice, setBasePrice] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<keyof BidFormFields, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BidFormFields, string>> = {};

    if (!form.material_type.trim()) {
      newErrors.material_type = "Material type is required";
    }

    if (!form.quantity || form.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }

    if (!form.pickup_location.trim()) {
      newErrors.pickup_location = "Pickup location is required";
    }

    if (!form.delivery_location.trim()) {
      newErrors.delivery_location = "Delivery location is required";
    }

    if (!form.deadline) {
      newErrors.deadline = "Deadline is required";
    } else {
      const selectedDate = new Date(form.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.deadline = "Deadline cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateBasePrice = (
    quantity: number,
    pickup: string,
    delivery: string
  ) => {
    if (!quantity || !pickup.trim() || !delivery.trim()) {
      return 0;
    }

    // Simple calculation: ₹200 per km per ton
    // In real app, you'd calculate actual distance
    const estimatedDistance = 100; // Default estimated distance in km
    const pricePerKmPerTon = 200;

    return Math.round(quantity * estimatedDistance * pricePerKmPerTon);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    // Clear error for this field
    if (errors[name as keyof BidFormFields]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Recalculate base price for relevant fields
    if (["quantity", "pickup_location", "delivery_location"].includes(name)) {
      const quantity =
        name === "quantity" ? Number(value) : Number(updatedForm.quantity);
      const pickup =
        name === "pickup_location" ? value : updatedForm.pickup_location;
      const delivery =
        name === "delivery_location" ? value : updatedForm.delivery_location;

      const newPrice = calculateBasePrice(quantity, pickup, delivery);
      setBasePrice(newPrice);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const payload = {
        ...form,
        quantity: Number(form.quantity),
        basePrice,
      };

      const res = await api.post("/bids", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201) {
        toast.success("Bid created successfully!");
        onSubmitted();
      } else {
        throw new Error("Failed to create bid");
      }
    } catch (error) {
      console.error("Error creating bid:", error);
      toast.error("Failed to create bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Truck className="h-5 w-5" />
          <span>Bid Details</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Material Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Package className="h-4 w-4" />
            <span>Material Information</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="material_type">Material Type *</Label>
              <Input
                id="material_type"
                name="material_type"
                value={form.material_type}
                onChange={handleChange}
                placeholder="e.g., Steel, Cement, Coal"
                className={errors.material_type ? "border-red-500" : ""}
              />
              {errors.material_type && (
                <p className="text-sm text-red-500">{errors.material_type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (Tons) *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="0.1"
                value={form.quantity || ""}
                onChange={handleChange}
                placeholder="Enter quantity"
                className={errors.quantity ? "border-red-500" : ""}
              />
              {errors.quantity && (
                <p className="text-sm text-red-500">{errors.quantity}</p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Location Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <MapPin className="h-4 w-4" />
            <span>Location Information</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickup_location">Pickup Location *</Label>
              <Input
                id="pickup_location"
                name="pickup_location"
                value={form.pickup_location}
                onChange={handleChange}
                placeholder="Enter pickup address"
                className={errors.pickup_location ? "border-red-500" : ""}
              />
              {errors.pickup_location && (
                <p className="text-sm text-red-500">{errors.pickup_location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_location">Delivery Location *</Label>
              <Input
                id="delivery_location"
                name="delivery_location"
                value={form.delivery_location}
                onChange={handleChange}
                placeholder="Enter delivery address"
                className={errors.delivery_location ? "border-red-500" : ""}
              />
              {errors.delivery_location && (
                <p className="text-sm text-red-500">
                  {errors.delivery_location}
                </p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Timeline & Requirements */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Calendar className="h-4 w-4" />
            <span>Timeline & Requirements</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline *</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={errors.deadline ? "border-red-500" : ""}
              />
              {errors.deadline && (
                <p className="text-sm text-red-500">{errors.deadline}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="transporter_requirements">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Transporter Requirements (Optional)</span>
                </div>
              </Label>
              <Textarea
                id="transporter_requirements"
                name="transporter_requirements"
                value={form.transporter_requirements}
                onChange={handleChange}
                placeholder="Any specific requirements for transporters (vehicle type, certifications, etc.)"
                rows={3}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Pricing */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <IndianRupee className="h-4 w-4" />
            <span>Pricing</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <Label className="text-sm font-medium text-gray-700">
              Estimated Base Price (Auto-calculated)
            </Label>
            <div className="mt-2">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(basePrice)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Based on ₹200/km/ton calculation
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center space-x-2"
          size="lg"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
          <span>{isSubmitting ? "Creating Bid..." : "Create Bid"}</span>
        </Button>
      </CardContent>
    </Card>
  );
}
