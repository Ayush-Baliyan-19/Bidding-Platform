"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import BidOffersDialog from "./components/BidOffersDialog";
import { Bid } from "@/types/bid";
import StatusBadge from "./components/StatusBadge";
import { toast } from "sonner";
import { api } from "@/lib/utils";
import CloseConfirmedButton from "./components/CloseConfirmedButton";

const closeBid = async (bidId: string | number) => {
  try {
    const res = await api.post(
      `/bids/${bidId}/close`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (res.status === 200) {
      toast.success("Bid closed successfully");
      window.location.reload();
      return true;
    } else {
      throw new Error("Failed to close bid");
    }
  } catch (error) {
    console.error("Error closing bid:", error);
    throw new Error("Failed to close bid");
  }
};

export default function BidsTable({ bids }: { bids: Bid[] }) {
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);

  return (
    <div>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Material</th>
            <th>Quantity (Tons)</th>
            <th>Pickup</th>
            <th>Delivery</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bids.map((bid) => (
            <tr key={bid.id} className="border-t min-h-10 w-full min-w-full">
              <td className="p-2">{bid.material_type}</td>
              <td>{bid.quantity}</td>
              <td>{bid.pickup_location}</td>
              <td>{bid.delivery_location}</td>
              <td>
                <StatusBadge status={bid.status} />
              </td>
              <td>
                {bid.status === "open" ? (
                  <>
                    <Button
                      onClick={() => setSelectedBid(bid)}
                      className="bg-blue-500 text-white"
                      variant={"outline"}
                      size={"sm"}
                    >
                      View Offers
                    </Button>
                    <CloseConfirmedButton onClose={() => closeBid(bid.id)} />
                  </>
                ) : bid.status === "closed" ? (
                  <div className="flex items-center">
                    <hr className="h-0.5 w-14 bg-black flex justify-center" />
                    <p className="w-max mx-5">N/A</p>
                    <hr className="h-0.5 w-14 bg-black flex justify-center" />
                  </div>
                ) : (
                  <Button onClick={() => setSelectedBid(bid)}>
                    Mark as Deal
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedBid && (
        <BidOffersDialog
          bid={selectedBid}
          onClose={() => setSelectedBid(null)}
        />
      )}
    </div>
  );
}
