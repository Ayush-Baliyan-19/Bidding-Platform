"use client";

import { useEffect, useState, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Calendar, Package, Route, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { api } from "@/lib/utils";

type BidHistory = {
  type: "bid";
  material: string;
  quantity: number;
  from: string;
  to: string;
  status: string;
  date: string;
  price_offered: number;
};

type DealHistory = {
  type: "deal";
  material: string;
  quantity: number;
  from: string;
  to: string;
  amount: number;
  date: string;
};

type TransporterHistory = {
  transporter_id: string;
  name: string;
  history: (BidHistory | DealHistory)[];
};

export default function TransporterHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<TransporterHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setError(null);
        const token = localStorage.getItem("token");

        const res = await api.get(`/transporters/${id}/history`, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });

        setData(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Failed to fetch transporter history:", err);
        setError(err.response?.data?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHistory();
    }
  }, [id]);

  // Calculate statistics
  const stats = data?.history
    ? {
        totalBids: data.history.filter((item) => item.type === "bid").length,
        totalDeals: data.history.filter((item) => item.type === "deal").length,
        totalRevenue: data.history
          .filter((item) => item.type === "deal")
          .reduce((sum, item) => sum + (item as DealHistory).amount, 0),
        successRate:
          data.history.filter((item) => item.type === "bid").length > 0
            ? Math.round(
                (data.history.filter((item) => item.type === "deal").length /
                  data.history.filter((item) => item.type === "bid").length) *
                  100
              )
            : 0,
      }
    : null;

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-8 w-64" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/transporters">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Transporter History</h1>
        </div>

        <Alert variant="destructive">
          <AlertDescription>
            {error || "Failed to load transporter history"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/transporters">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">History: {data.name}</h1>
          <p className="text-muted-foreground">
            Complete transaction history and performance metrics
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Bids
                  </p>
                  <p className="text-2xl font-bold">{stats.totalBids}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Completed Deals
                  </p>
                  <p className="text-2xl font-bold">{stats.totalDeals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Route className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Success Rate
                  </p>
                  <p className="text-2xl font-bold">{stats.successRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold">
                    ₹{stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* History Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {data.history.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No transaction history found
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.history
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((item, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {new Date(item.date).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <Badge
                            variant={
                              item.type === "deal" ? "default" : "secondary"
                            }
                            className={
                              item.type === "deal" ? "bg-green-500" : ""
                            }
                          >
                            {item.type.toUpperCase()}
                          </Badge>
                          {item.type === "bid" && (
                            <Badge variant="outline">
                              {(item as BidHistory).status.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-muted-foreground">
                            Material & Quantity
                          </p>
                          <p className="font-semibold">{item.material}</p>
                          <p>{item.quantity} tons</p>
                        </div>

                        <div>
                          <p className="font-medium text-muted-foreground">
                            Route
                          </p>
                          <p className="font-semibold">{item.from}</p>
                          <p className="text-muted-foreground">↓</p>
                          <p className="font-semibold">{item.to}</p>
                        </div>

                        <div>
                          <p className="font-medium text-muted-foreground">
                            {item.type === "bid"
                              ? "Price Offered"
                              : "Amount Earned"}
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            ₹
                            {item.type === "bid"
                              ? (
                                  item as BidHistory
                                ).price_offered.toLocaleString()
                              : (item as DealHistory).amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
