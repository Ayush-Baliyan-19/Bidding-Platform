// app/dashboard/bids/active/components/BidsTable.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import BidOffersDialog from "./BidOffersDialog";
// import { DealModal } from "./DealModal";
import { Bid } from "@/types/bid";
import CloseConfirmedButton from "./CloseConfirmedButton";
import { toast } from "sonner";
import { api } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, X } from "lucide-react";

interface BidsTableProps {
  bids: Bid[];
  onBidUpdate: () => void;
}

const closeBid = async (bidId: string | number): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await api.post(
      `/bids/${bidId}/close`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      toast.success("Bid closed successfully");
      return true;
    } else {
      throw new Error("Failed to close bid");
    }
  } catch (error) {
    console.error("Error closing bid:", error);
    toast.error("Failed to close bid. Please try again.");
    return false;
  }
};

export default function BidsTable({ bids, onBidUpdate }: BidsTableProps) {
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [closingBidId, setClosingBidId] = useState<string | number | null>(
    null
  );

  const handleCloseBid = async (bidId: string | number) => {
    setClosingBidId(bidId);
    try {
      const success = await closeBid(bidId);
      if (success) {
        onBidUpdate();
      }
    } finally {
      setClosingBidId(null);
    }
  };

  const handleViewOffers = (bid: Bid) => {
    setSelectedBid(bid);
  };

  const handleMarkAsDeal = (bid: Bid) => {
    if (window.confirm(`Are you sure you want to mark the bid for ${bid.material_type} as a deal?`)) {
    //   setDealModalBid(bid);
      // Logic to mark the bid as a deal can be added here
      toast.success(`Bid for ${bid.material_type} marked as deal!`);
      onBidUpdate();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderActions = (bid: Bid) => {
    if (bid.status === "open") {
      return (
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => handleViewOffers(bid)}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1"
          >
            <Eye className="h-4 w-4" />
            <span>View Offers</span>
          </Button>
          <CloseConfirmedButton
            onClose={() => handleCloseBid(bid.id)}
            isLoading={closingBidId === bid.id}
          />
        </div>
      );
    }

    if (bid.status === "closed") {
      return (
        <div className="flex items-center justify-center text-gray-400">
          <X className="h-4 w-4 mr-2" />
          <span className="text-sm">No actions available</span>
        </div>
      );
    }

    // For accepted bids
    return (
      <Button
        onClick={() => handleMarkAsDeal(bid)}
        variant="default"
        size="sm"
        className="flex items-center space-x-1"
      >
        <CheckCircle className="h-4 w-4" />
        <span>Mark as Deal</span>
      </Button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity (Tons)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pickup Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bids.map((bid, index) => (
                <tr
                  key={bid.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {bid.material_type}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{bid.quantity}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {bid.pickup_location}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {bid.delivery_location}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(bid.status)}>
                      {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {renderActions(bid)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selectedBid && (
        <BidOffersDialog
          bid={selectedBid}
          onClose={() => {
            setSelectedBid(null);
            onBidUpdate();
          }}
        />
      )}
    </div>
  );
}
