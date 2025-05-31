"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/lib/utils";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteButtonProps {
  id: string;
  name?: string;
  onSuccess?: () => void;
  variant?: "button" | "dropdown";
}

export default function DeleteButtonWithConfirmation({
  id,
  name,
  onSuccess,
  variant = "button",
}: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await api.delete(`/transporters/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(
        `Transporter ${name ? `"${name}"` : ""} deleted successfully`
      );

      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error deleting transporter:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to delete transporter";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (variant === "dropdown") {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-muted rounded-sm text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transporter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              {name ? `"${name}"` : "this transporter"}? This action cannot be
              undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={loading}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Transporter</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            {name ? `"${name}"` : "this transporter"}? This action cannot be
            undone and will remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
