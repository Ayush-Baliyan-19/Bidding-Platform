// app/dashboard/bids/active/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/utils";
import { Bid } from "@/types/bid";
import BidsTable from "./components/BidsTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

async function getBids(token: string): Promise<Bid[]> {
  try {
    const res = await api.get<Bid[]>("/bids", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res?.data || [];
  } catch (error) {
    console.error("Failed to fetch bids:", error);
    throw error;
  }
}

export default function ActiveBidsPage() {
  const { authUser } = useAuth();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBids = async () => {
    if (!authUser?.token) return;

    setLoading(true);
    setError(null);

    try {
      const bidsResult = await getBids(authUser.token);
      setBids(bidsResult);
    } catch (error) {
      console.error("Failed to fetch bids:", error);
      setError("Failed to load bids. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [authUser?.token]);

  const handleBidUpdate = () => {
    fetchBids();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading bids...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Active Bids</h1>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Active Bids</h1>
        <div className="text-sm text-muted-foreground">
          {bids.length} {bids.length === 1 ? "bid" : "bids"} found
        </div>
      </div>

      {bids.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No active bids
          </h3>
          <p className="text-gray-500 mb-4">
            Get started by creating your first bid.
          </p>
        </div>
      ) : (
        <BidsTable bids={bids} onBidUpdate={handleBidUpdate} />
      )}
    </div>
  );
}
