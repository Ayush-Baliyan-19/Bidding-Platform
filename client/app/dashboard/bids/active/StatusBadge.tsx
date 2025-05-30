// bids/active/components/StatusBadge.tsx
import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
    }
  > = {
    active: { label: "Active", variant: "default" },
    accepted: { label: "Accepted", variant: "secondary" },
    closed: { label: "Closed", variant: "destructive" },
  };

  const { label } = statusMap[status] || {
    label: status,
    variant: "outline",
  };

  return (
    <Badge
      className={
        status === "accepted"
          ? "bg-green-100 text-green-700"
          : status === "closed"
          ? "bg-red-100 text-red-700"
          : "bg-blue-100 text-blue-700"
      }
    >
      {label}
    </Badge>
  );
}
