import { Bid } from "@/types/bid";
import BidForm from "./components/BidForm";
import BidTable from "./components/BidTable";

async function getBids(): Promise<Bid[]> {
  const res = await fetch("http://localhost:5000/api/bids", {
    cache: "no-store",
  });
  return res.json();
}

export default async function BidsPage() {
  const bids = await getBids();

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Create New Bid</h1>
      <BidForm />
      <div>
        <h2 className="text-2xl font-semibold mb-4">Active Bids</h2>
        <BidTable bids={bids} />
      </div>
    </div>
  );
}
