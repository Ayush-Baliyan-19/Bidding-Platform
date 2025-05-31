"use client";

import { useEffect, useState, use } from "react";
import { TransporterForm } from "../../components/TransporterForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { api } from "@/lib/utils";

interface Transporter {
  id: string;
  name: string;
  contact: string;
  vehicle_type: string;
  capacity: number;
  status: "active" | "inactive";
}

export default function EditTransporterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<Transporter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransporter = async () => {
      try {
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const res = await api.get(`/transporters/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.data) {
          throw new Error("Transporter not found");
        }

        setData(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Failed to fetch transporter:", err);
        setError(err.response?.data?.message || "Failed to load transporter");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTransporter();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-20" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/transporters">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Transporter</h1>
        </div>

        <Alert variant="destructive">
          <AlertDescription>
            {error || "Transporter not found"}
          </AlertDescription>
        </Alert>

        <div className="text-center">
          <Link href="/dashboard/transporters">
            <Button>Return to Transporters</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/transporters">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Transporter</h1>
          <p className="text-muted-foreground">Editing: {data.name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transporter Information</CardTitle>
        </CardHeader>
        <CardContent>
          <TransporterForm defaultValues={data} />
        </CardContent>
      </Card>
    </div>
  );
}
