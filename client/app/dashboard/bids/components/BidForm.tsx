"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function BidForm() {
  const [form, setForm] = useState({
    material: "",
    quantity: "",
    pickup: "",
    delivery: "",
    deadline: "",
    requirements: "",
  });

  const [basePrice, setBasePrice] = useState("₹0");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (["quantity", "pickup", "delivery"].includes(name)) {
      const quantity =
        name === "quantity" ? Number(value) : Number(form.quantity);
      if (form.pickup && form.delivery && quantity) {
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

    const res = await fetch("http://localhost:5000/api/bids", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      toast.success("Bid created successfully!");
      window.location.reload();
    } else {
      toast.error("Failed to create bid");
    }
  };

  return (
    <Card className="max-w-xl">
      <CardContent className="space-y-4 pt-6">
        {["material", "quantity", "pickup", "delivery", "deadline"].map(
          (field) => (
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
                value={(form as any)[field]}
                onChange={handleChange}
              />
            </div>
          )
        )}

        <div className="space-y-2">
          <Label>Transporter Requirements</Label>
          <Textarea
            name="requirements"
            value={form.requirements}
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
