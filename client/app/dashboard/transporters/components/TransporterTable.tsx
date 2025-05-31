import { Badge } from "@/components/ui/badge";
import TransporterActions from "./TranporterActions";

interface Transporter {
  id: string;
  name: string;
  contact: string;
  vehicle_type: string;
  capacity: number;
  status: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
}

interface TransporterTableProps {
  data: Transporter[];
  onDataChange?: () => void;
}

export function TransporterTable({
  data,
  onDataChange,
}: TransporterTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No transporters found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="border-b">
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="px-4 py-3 text-left font-medium">Contact</th>
            <th className="px-4 py-3 text-left font-medium">Vehicle Type</th>
            <th className="px-4 py-3 text-left font-medium">Capacity</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((transporter) => (
            <tr key={transporter.id} className="border-b hover:bg-muted/25">
              <td className="px-4 py-3 font-medium">{transporter.name}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {transporter.contact}
              </td>
              <td className="px-4 py-3">{transporter.vehicle_type}</td>
              <td className="px-4 py-3">{transporter.capacity} tons</td>
              <td className="px-4 py-3">
                <Badge
                  variant={
                    transporter.status === "active" ? "default" : "secondary"
                  }
                  className={
                    transporter.status === "active"
                      ? "bg-green-500 hover:bg-green-600"
                      : ""
                  }
                >
                  {transporter.status}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <TransporterActions
                  transporter={transporter}
                  onDataChange={onDataChange}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
