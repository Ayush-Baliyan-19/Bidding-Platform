// app/bids/types.ts

export type Bid = {
  id: number;
  material_type: string;
  quantity: number;
  pickup_location: string;
  delivery_location: string;
  deadline: string;
  basePrice: number;
  status: string;
  transporter_requirements?: string;
};

export type BidOffer = {
  id: number;
  bidId: number;
  transporter: string;
  amount: number;
  note: string;
  status: string; // e.g., "pending", "accepted", "rejected"
  createdAt: string; // ISO date string
};

export type BidFormFields = {
  material_type: string;
  quantity: number;
  pickup_location: string;
  delivery_location: string;
  deadline: string;
  transporter_requirements?: string;
};