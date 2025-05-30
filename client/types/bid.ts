// app/bids/types.ts

export type Bid = {
  id: number;
  material: string;
  quantity: number;
  pickup: string;
  delivery: string;
  deadline: string;
  basePrice: number;
  status: string;
};
