// app/dashboard/bids/active/components/BidOffersDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Bid, BidOffer } from "@/types/bid";
import { api } from "@/lib/utils";
import {
  Loader2,
  User,
  IndianRupee,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BidOffersDialogProps {
  bid: Bid;
  onClose: () => void;
}

export default function BidOffersDialog({
  bid,
  onClose,
}: BidOffersDialogProps) {
  const [offers, setOffers] = useState<BidOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingOfferId, setAcceptingOfferId] = useState<
    string | number | null
  >(null);

  useEffect(() => {
    fetchOffers();
  }, [bid]);

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const { data } = await api.get<BidOffer[]>(`/bids/${bid.id}/offers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setOffers(data || []);
    } catch (error) {
      console.error("Failed to fetch offers:", error);
      setError("Failed to load offers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const acceptOffer = async (offer: BidOffer) => {
    setAcceptingOfferId(offer.id);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await api.post(
        `/bids/${bid.id}/accept`,
        {
          offerId: offer.id,
          transporter_id: offer.transporter_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res?.status === 200) {
        toast.success(`Offer from ${offer.transporter} accepted successfully!`);
        onClose();
      } else {
        throw new Error("Failed to accept offer");
      }
    } catch (error) {
      console.error("Error accepting offer:", error);
      toast.error("Failed to accept offer. Please try again.");
    } finally {
      setAcceptingOfferId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Offers for {bid.material_type}</span>
            <Badge variant="outline">{offers.length} offers</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bid Summary */}
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Quantity:</span> {bid.quantity}{" "}
                  tons
                </div>
                <div>
                  <span className="font-medium">Pickup:</span>{" "}
                  {bid.pickup_location}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Delivery:</span>{" "}
                  {bid.delivery_location}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading offers...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Empty State */}
          {!loading && !error && offers.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <FileText className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No offers yet
              </h3>
              <p className="text-gray-500">
                Transporters haven&apos;t submitted any offers for this bid.
              </p>
            </div>
          )}

          {/* Offers List */}
          {!loading && !error && offers.length > 0 && (
            <div className="space-y-3">
              {offers.map((offer, index) => (
                <Card
                  key={offer.id || index}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-900">
                            {offer.transporter}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 mb-2">
                          <IndianRupee className="h-4 w-4 text-green-600" />
                          <span className="text-lg font-semibold text-green-600">
                            {formatCurrency(offer.amount)}
                          </span>
                        </div>

                        {offer.note && (
                          <div className="flex items-start space-x-2">
                            <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-600">
                              {offer.note}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="ml-4">
                        <Button
                          onClick={() => acceptOffer(offer)}
                          disabled={acceptingOfferId !== null}
                          className="flex items-center space-x-2"
                        >
                          {acceptingOfferId === offer.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          <span>
                            {acceptingOfferId === offer.id
                              ? "Accepting..."
                              : "Accept"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
