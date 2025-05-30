// bids/active/components/BidOffersDialog.tsx
"use client";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Bid, BidOffer } from "@/types/bid";
import { api } from "@/lib/utils";

export default function BidOffersDialog({
  bid,
  onClose,
}: {
  bid: Bid;
  onClose: () => void;
}) {
  const [offers, setOffers] = useState<BidOffer[]>([]);

  useEffect(() => {
    const fetchOffers = async () => {
      const { data } = await api.get<BidOffer[]>(`/bids/${bid.id}/offers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOffers(data);
    };
    fetchOffers();
  }, [bid]);

  const acceptBid = async (offer: BidOffer) => {
    const res = await api.post(
      `/bids/${bid.id}/accept`,
      {
        offerId: offer.id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (res?.status === 200) {
      toast.success(`Accepted offer from ${offer.transporter}`);
      onClose();
    } else {
      toast.error("Failed to accept bid");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>Offers for {bid.material_type}</DialogHeader>
        {offers.length === 0 ? (
          <p>No offers available</p>
        ) : (
          <div className="space-y-3">
            {offers.map((offer, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{offer.transporter}</p>
                  <p className="text-sm">₹{offer.amount}</p>
                  <p className="text-xs text-muted-foreground">{offer.note}</p>
                </div>
                <Button onClick={() => acceptBid(offer)}>Accept</Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
