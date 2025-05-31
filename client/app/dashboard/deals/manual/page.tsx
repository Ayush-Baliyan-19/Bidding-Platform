"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/utils";

interface DealFormData {
  transporter_name: string;
  material: string;
  amount: string;
  distance_km: string;
  date: string;
}

const initialFormState: DealFormData = {
  transporter_name: "",
  material: "",
  amount: "",
  distance_km: "",
  date: "",
};

export default function ManualDealEntry() {
  const [form, setForm] = useState<DealFormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof DealFormData)[] = [
      "transporter_name",
      "material",
      "amount",
      "distance_km",
      "date",
    ];

    for (const field of requiredFields) {
      if (!form[field].trim()) {
        toast.error(
          `${field
            .replace("_", " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())} is required`
        );
        return false;
      }
    }

    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Amount must be a valid positive number");
      return false;
    }

    const distance = parseFloat(form.distance_km);
    if (isNaN(distance) || distance <= 0) {
      toast.error("Distance must be a valid positive number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const dealData = {
        ...form,
        amount: parseFloat(form.amount),
        distance_km: parseFloat(form.distance_km),
      };

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const res = await api.post("/deals", dealData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res?.status === 201) {
        toast.success("Deal logged successfully");
        setForm(initialFormState);
      } else {
        throw new Error("Unexpected response status");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error submitting deal:", error);

      if (error?.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error?.response?.status === 400) {
        toast.error("Invalid deal data. Please check your inputs.");
      } else {
        toast.error("Failed to log deal. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Manual Deal Entry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transporter_name">
                  Transporter Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="transporter_name"
                  name="transporter_name"
                  value={form.transporter_name}
                  onChange={handleChange}
                  placeholder="Enter transporter name"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="material">
                  Material <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="material"
                  name="material"
                  value={form.material}
                  onChange={handleChange}
                  placeholder="Enter material type"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">
                  Amount (₹) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="distance_km">
                  Distance (km) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="distance_km"
                  name="distance_km"
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.distance_km}
                  onChange={handleChange}
                  placeholder="0.0"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                disabled={isSubmitting}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Deal"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
