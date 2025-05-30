"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/utils";

export default function ManualDealEntry() {
  const [form, setForm] = useState({
    transporter_name: "",
    material: "",
    amount: "",
    distance_km: "",
    date: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post(
        "/deals",
        form,
      );
      if (res?.status !==201 ) throw new Error("Error submitting deal");
      toast.success("Deal logged successfully");
      setForm({ transporter_name: "", material: "", amount: "", distance_km:"", date: "" });
    } catch  {
      toast.error("Failed to log deal");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold">Manual Deal Entry</h2>

      <div className="space-y-2">
        <Label>Transporter</Label>
        <Input
          name="transporter_name"
          value={form.transporter_name}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label>Material</Label>
        <Input name="material" value={form.material} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label>Amount (₹)</Label>
        <Input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
        />
      </div>

    <div className="space-y-2">
        <Label>Disatnce (km)</Label>
        <Input
          name="distance_km"
          type="text"
          value={form.distance_km}
          onChange={handleChange}
        />

    </div>
      <div className="space-y-2">
        <Label>Date</Label>
        <Input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />
      </div>

      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
