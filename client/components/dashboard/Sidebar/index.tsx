"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Sidebar() {
  const [openBids, setOpenBids] = useState(false);
  const [openDeals, setOpenDeals] = useState(false);

  return (
    <aside className="w-64 p-4 bg-white border-r">
      <h2 className="text-lg font-semibold mb-4">Dashboard</h2>

      <div>
        <div
          className="flex items-center justify-between cursor-pointer mb-2"
          onClick={() => setOpenBids((prev) => !prev)}
        >
          <span className="font-medium">Bids</span>
          {openBids ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        {openBids && (
          <ul className="pl-4 space-y-2">
            <li>
              <Link
                href="/dashboard/bids/create"
                className="text-sm text-muted-foreground hover:underline"
              >
                Create Bid
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/bids/active"
                className="text-sm text-muted-foreground hover:underline"
              >
                Active Bids
              </Link>
            </li>
          </ul>
        )}
        <div
          className="flex items-center justify-between cursor-pointer mb-2"
          onClick={() => setOpenDeals((prev) => !prev)}
        >
          <span className="font-medium">Deals</span>
          {openDeals ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        {openDeals && (
          <ul className="pl-4 space-y-2">
            <li>
              <Link
                href="/dashboard/deals/manual"
                className="text-sm text-muted-foreground hover:underline"
              >
                Manual
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/deals/upload"
                className="text-sm text-muted-foreground hover:underline"
              >
                Upload
              </Link>
            </li>
          </ul>
        )}
      </div>
    </aside>
  );
}
