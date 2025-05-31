"use client";

import { useEffect, useState } from "react";
import { TransporterTable } from "./components/TransporterTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { api } from "@/lib/utils";

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

export default function TransporterListPage() {
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransporters = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await api.get("/transporters", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransporters(res.data || []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to fetch transporters:", err);
      setError(err.response?.data?.message || "Failed to load transporters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransporters();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchTransporters();
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transporters</h1>
          <p className="text-muted-foreground">
            Manage your transporter network
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            Refresh
          </Button>
          <Link href="/dashboard/transporters/create">
            <Button>Add Transporter</Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Transporters ({transporters.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {transporters.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No transporters found
              </p>
              <Link href="/dashboard/transporters/create">
                <Button>Add Your First Transporter</Button>
              </Link>
            </div>
          ) : (
            <TransporterTable
              data={transporters}
              onDataChange={handleRefresh}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
