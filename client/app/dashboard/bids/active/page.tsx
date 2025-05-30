"use client";
import { api } from "@/lib/utils";
import BidTable from "./BidTable";
import { Bid } from "@/types/bid";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

async function getBids(token: string): Promise<Bid[]> {
  const res = await api.get<Bid[]>("/bids", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res?.data;
}

export default function ActiveBidsPage() {
    const { authUser } = useAuth();
    const [bids, setBids] = useState<Bid[]>([]);
    useEffect(() => {
      if (!authUser?.token) return;
      async function fetchBids() {
        try {
          const bidsResult = await getBids(
            authUser?.token || localStorage.getItem("token") || ""
          );
          setBids(bidsResult);
        } catch (error) {
          console.error("Failed to fetch bids:", error);
        }
      }
      fetchBids();
    }, [authUser?.token]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Active Bids</h1>
      <BidTable bids={bids} />
    </div>
  );
}
