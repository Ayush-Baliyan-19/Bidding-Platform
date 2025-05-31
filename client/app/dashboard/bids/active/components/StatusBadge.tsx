// app/dashboard/bids/active/components/StatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  showIcon?: boolean;
}

export default function StatusBadge({
  status,
  showIcon = true,
}: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase();

    switch (normalizedStatus) {
      case "open":
      case "active":
        return {
          label: "Open",
          className: "bg-blue-100 text-blue-800 border-blue-200",
          icon: Clock,
        };
      case "accepted":
        return {
          label: "Accepted",
          className: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircle,
        };
      case "closed":
        return {
          label: "Closed",
          className: "bg-red-100 text-red-800 border-red-200",
          icon: XCircle,
        };
      case "pending":
        return {
          label: "Pending",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: AlertCircle,
        };
      default:
        return {
          label: status.charAt(0).toUpperCase() + status.slice(1),
          className: "bg-gray-100 text-gray-800 border-gray-200",
          icon: AlertCircle,
        };
    }
  };

  const { label, className, icon: Icon } = getStatusConfig(status);

  return (
    <Badge className={`${className} flex items-center space-x-1 font-medium`}>
      {showIcon && <Icon className="h-3 w-3" />}
      <span>{label}</span>
    </Badge>
  );
}

