"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface TransporterFormData {
  name: string;
  contact: string;
  vehicle_type: string;
  capacity: string;
  status: "active" | "inactive";
}

interface TransporterFormProps {
  defaultValues?: {
    id?: string;
    name?: string;
    contact?: string;
    vehicle_type?: string;
    capacity?: number;
    status?: "active" | "inactive";
  };
}

export function TransporterForm({ defaultValues }: TransporterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<TransporterFormData>({
    name: defaultValues?.name || "",
    contact: defaultValues?.contact || "",
    vehicle_type: defaultValues?.vehicle_type || "",
    capacity: defaultValues?.capacity?.toString() || "",
    status: defaultValues?.status || "active",
  });

  const isEdit = !!defaultValues?.id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user starts typing
  };

  const handleSelectChange = (value: "active" | "inactive") => {
    setForm((prev) => ({ ...prev, status: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!form.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!form.contact.trim()) {
      setError("Contact is required");
      return false;
    }
    if (!form.vehicle_type.trim()) {
      setError("Vehicle type is required");
      return false;
    }
    if (
      !form.capacity.trim() ||
      isNaN(Number(form.capacity)) ||
      Number(form.capacity) <= 0
    ) {
      setError("Valid capacity is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const submitData = {
        ...form,
        capacity: Number(form.capacity),
      };

      if (isEdit && defaultValues?.id) {
        await api.put(`/transporters/${defaultValues.id}`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Transporter updated successfully");
      } else {
        await api.post("/transporters", submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Transporter created successfully");
      }

      router.push("/dashboard/transporters");
      router.refresh();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to save transporter:", err);
      const errorMessage =
        err.response?.data?.message ||
        `Failed to ${isEdit ? "update" : "create"} transporter`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter transporter name"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact">Contact *</Label>
          <Input
            id="contact"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Phone number or email"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicle_type">Vehicle Type *</Label>
          <Input
            id="vehicle_type"
            name="vehicle_type"
            value={form.vehicle_type}
            onChange={handleChange}
            placeholder="e.g., Truck, Mini Truck, Heavy Vehicle"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity (tons) *</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            step="0.1"
            min="0.1"
            value={form.capacity}
            onChange={handleChange}
            placeholder="e.g., 5.0"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={form.status}
          onValueChange={handleSelectChange}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update" : "Create"} Transporter
        </Button>
      </div>
    </form>
  );
}
