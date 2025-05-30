"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/lib/utils";
import { BidFormFields } from "@/types/bid";

export default function BidForm() {
  const [form, setForm] = useState<BidFormFields>({
    material_type: "",
    quantity: 0,
    pickup_location: "",
    delivery_location: "",
    deadline: "",
    transporter_requirements: "",
  });

  const [basePrice, setBasePrice] = useState("₹0");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (["quantity", "pickup", "delivery", ""].includes(name)) {
      const quantity =
        name === "quantity" ? Number(value) : Number(form.quantity);
      if (form.pickup_location && form.delivery_location && quantity) {
        const price = 200 * 5 * quantity;
        setBasePrice(`₹${price}`);
      }
    }
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      quantity: Number(form.quantity),
      basePrice: Number(basePrice.replace("₹", "")),
    };

    const res = await api.post("/bids", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.status === 201) {
      toast.success("Bid created successfully!");
      window.location.reload();
    } else {
      toast.error("Failed to create bid");
    }
  };

  return (
    <Card className="max-w-xl">
      <CardContent className="space-y-4 pt-6">
        {(
          [
            "material_type",
            "quantity",
            "pickup_location",
            "delivery_location",
            "deadline",
          ] as (keyof BidFormFields)[]
        ).map((field) => (
          <div key={field} className="space-y-2">
            <Label>{field[0].toUpperCase() + field.slice(1)}</Label>
            <Input
              name={field}
              type={
                field === "quantity"
                  ? "number"
                  : field === "deadline"
                  ? "date"
                  : "text"
              }
              value={form[field]}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="space-y-2">
          <Label>Transporter Requirements</Label>
          <Textarea
            name="transporter_requirements"
            value={form.transporter_requirements}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Base Price (Auto-Predicted)</Label>
          <Input disabled value={basePrice} />
        </div>

        <Button onClick={handleSubmit}>Submit Bid</Button>
      </CardContent>
    </Card>
  );
}
