"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Filter, Download, Loader2, RefreshCw } from "lucide-react";
import { api } from "@/lib/utils";

interface Deal {
  id: number;
  material: string;
  amount: number;
  distance_km?: number;
  date: string;
  transporter_name: string;
  created_at?: string;
}

interface Filters {
  search: string;
  material: string;
  transporter: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

const initialFilters: Filters = {
  search: "",
  material: "",
  transporter: "",
  dateFrom: "",
  dateTo: "",
  sortBy: "date",
  sortOrder: "desc",
};

export default function AllDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [uniqueMaterials, setUniqueMaterials] = useState<string[]>([]);
  const [uniqueTransporters, setUniqueTransporters] = useState<string[]>([]);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const res = await api.get("/deals", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res?.data) {
        setDeals(res.data);

        // Extract unique values for filters
        const materials = [
          ...new Set(res.data.map((deal: Deal) => deal.material)),
        ].sort();
        const transporters = [
          ...new Set(res.data.map((deal: Deal) => deal.transporter_name)),
        ].sort();

        setUniqueMaterials(materials as string[]);
        setUniqueTransporters(transporters as string[]);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching deals:", error);

      if (error?.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Failed to load deals. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  // Apply filters whenever deals or filters change
  useEffect(() => {
    let filtered = [...deals];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (deal) =>
          deal.material.toLowerCase().includes(searchLower) ||
          deal.transporter_name.toLowerCase().includes(searchLower) ||
          deal.id.toString().includes(searchLower)
      );
    }

    // Material filter
    if (filters.material) {
      filtered = filtered.filter((deal) => deal.material === filters.material);
    }

    // Transporter filter
    if (filters.transporter) {
      filtered = filtered.filter(
        (deal) => deal.transporter_name === filters.transporter
      );
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(
        (deal) => new Date(deal.date) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(
        (deal) => new Date(deal.date) <= new Date(filters.dateTo)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let aValue: any, bValue: any;

      switch (filters.sortBy) {
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "material":
          aValue = a.material.toLowerCase();
          bValue = b.material.toLowerCase();
          break;
        case "transporter":
          aValue = a.transporter_name.toLowerCase();
          bValue = b.transporter_name.toLowerCase();
          break;
        case "date":
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
      }

      if (aValue < bValue) return filters.sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredDeals(filtered);
  }, [deals, filters]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const exportToCsv = () => {
    if (filteredDeals.length === 0) {
      toast.error("No deals to export");
      return;
    }

    const headers = [
      "Deal ID",
      "Material",
      "Amount (₹)",
      "Distance (km)",
      "Transporter",
      "Date",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredDeals.map((deal) =>
        [
          deal.id,
          `"${deal.material}"`,
          deal.amount,
          deal.distance_km || "",
          `"${deal.transporter_name}"`,
          new Date(deal.date).toLocaleDateString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deals_export_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Deals exported successfully");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalAmount = filteredDeals.reduce(
    (sum, deal) => Number(sum) + Number(deal.amount),
    0
  );

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">All Deals</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredDeals.length} of {deals.length} deals
              {filteredDeals.length > 0 && (
                <span className="ml-2">
                  • Total Value: <strong>{formatCurrency(totalAmount)}</strong>
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchDeals} disabled={loading}>
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              variant="outline"
              onClick={exportToCsv}
              disabled={filteredDeals.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="col-span-1 sm:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search deals, materials, transporters..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              value={filters.material}
              onValueChange={(value) => handleFilterChange("material", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Material" />
              </SelectTrigger>
              <SelectContent>
                {uniqueMaterials.map((material) => (
                  <SelectItem key={material} value={material}>
                    {material}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.transporter}
              onValueChange={(value) =>
                handleFilterChange("transporter", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Transporter" />
              </SelectTrigger>
              <SelectContent>
                {uniqueTransporters.map((transporter) => (
                  <SelectItem key={transporter} value={transporter}>
                    {transporter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="From Date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            />

            <Input
              type="date"
              placeholder="To Date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="material">Material</SelectItem>
                  <SelectItem value="transporter">Transporter</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.sortOrder}
                onValueChange={(value) =>
                  handleFilterChange("sortOrder", value as "asc" | "desc")
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={clearFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>

          {/* Deals Table */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading deals...</span>
            </div>
          ) : filteredDeals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {deals.length === 0
                ? "No deals found"
                : "No deals match your filters"}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deal ID</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Distance</TableHead>
                    <TableHead>Transporter</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeals.map((deal) => (
                    <TableRow key={deal.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <Badge variant="outline">#{deal.id}</Badge>
                      </TableCell>
                      <TableCell>{deal.material}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(deal.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {deal.distance_km ? `${deal.distance_km} km` : "-"}
                      </TableCell>
                      <TableCell>{deal.transporter_name}</TableCell>
                      <TableCell>
                        {new Date(deal.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
