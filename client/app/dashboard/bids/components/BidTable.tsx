"use client";

import { Bid } from "@/types/bid";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";

export default function BidTable({ bids }: { bids: Bid[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Material</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Route</TableHead>
          <TableHead>Base Price</TableHead>
          <TableHead>Deadline</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bids.map((bid) => (
          <TableRow key={bid.id}>
            <TableCell>{bid.material}</TableCell>
            <TableCell>{bid.quantity} T</TableCell>
            <TableCell>
              {bid.pickup} → {bid.delivery}
            </TableCell>
            <TableCell>₹{bid.basePrice}</TableCell>
            <TableCell>{bid.deadline}</TableCell>
            <TableCell>
              <Badge variant={bid.status === "open" ? "default" : "secondary"}>
                {bid.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
