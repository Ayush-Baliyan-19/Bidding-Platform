"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Edit, History, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteButtonWithConfirmation from "./DeleteButtonWithConfirmation";

interface Transporter {
  id: string;
  name: string;
  contact: string;
  vehicle_type: string;
  capacity: number;
  status: "active" | "inactive";
}

interface TransporterActionsProps {
  transporter: Transporter;
  onDataChange?: () => void;
}

export default function TransporterActions({
  transporter,
  onDataChange,
}: TransporterActionsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      {/* Desktop Actions */}
      <div className="hidden md:flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            router.push(`/dashboard/transporters/${transporter.id}/edit`)
          }
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            router.push(`/dashboard/transporters/${transporter.id}/history`)
          }
        >
          <History className="h-4 w-4 mr-1" />
          History
        </Button>
        <DeleteButtonWithConfirmation
          id={transporter.id}
          name={transporter.name}
          onSuccess={onDataChange}
        />
      </div>

      {/* Mobile Actions (Dropdown) */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                router.push(`/dashboard/transporters/${transporter.id}/edit`)
              }
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(`/dashboard/transporters/${transporter.id}/history`)
              }
            >
              <History className="h-4 w-4 mr-2" />
              History
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DeleteButtonWithConfirmation
                id={transporter.id}
                name={transporter.name}
                onSuccess={onDataChange}
                variant="dropdown"
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
