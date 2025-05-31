// app/dashboard/bids/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BidForm from "./components/BidForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Info } from "lucide-react";

export default function CreateBidPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBidCreated = () => {
    router.push("/dashboard/bids/active");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Plus className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Bid</h1>
          <p className="text-gray-600">
            Post a new freight bid for transporters
          </p>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Fill out the form below to create a new bid. The base price will be
          automatically calculated based on distance and quantity.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BidForm
            onSubmitted={handleBidCreated}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pricing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium text-gray-900">
                  Base Price Calculation
                </h4>
                <p className="text-gray-600">₹200 per km per ton (estimated)</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  Distance Estimation
                </h4>
                <p className="text-gray-600">
                  Calculated automatically based on pickup and delivery
                  locations
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips for Better Bids</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>• Provide clear pickup and delivery locations</p>
              <p>• Set realistic deadlines</p>
              <p>• Include specific transporter requirements</p>
              <p>• Review the auto-calculated base price</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
