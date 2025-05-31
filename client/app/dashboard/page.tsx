// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Package,
  FileText,
  Truck,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
} from "lucide-react";

interface DashboardStats {
  activeBids: number;
  totalDeals: number;
  activeTransporters: number;
  monthlyRevenue: number;
  recentActivity: {
    type: "bid" | "deal" | "transporter";
    message: string;
    time: string;
    status?: string;
  }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    activeBids: 0,
    totalDeals: 0,
    activeTransporters: 0,
    monthlyRevenue: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, you'd have a dedicated dashboard API endpoint
        // For now, we'll simulate with mock data
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

        setStats({
          activeBids: 12,
          totalDeals: 156,
          activeTransporters: 23,
          monthlyRevenue: 450000,
          recentActivity: [
            {
              type: "bid",
              message: "New bid created for Steel Transport",
              time: "2 hours ago",
              status: "active",
            },
            {
              type: "deal",
              message: "Deal completed with ABC Logistics - ₹25,000",
              time: "4 hours ago",
              status: "completed",
            },
            {
              type: "transporter",
              message: "New transporter registered: XYZ Transport",
              time: "6 hours ago",
              status: "active",
            },
            {
              type: "bid",
              message: "Bid accepted for Construction Materials",
              time: "1 day ago",
              status: "accepted",
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Active Bids",
      value: stats.activeBids,
      icon: <Package className="h-6 w-6 text-blue-600" />,
      href: "/dashboard/bids/active",
      color: "text-blue-600",
    },
    {
      title: "Total Deals",
      value: stats.totalDeals,
      icon: <FileText className="h-6 w-6 text-green-600" />,
      href: "/dashboard/deals/all-deals",
      color: "text-green-600",
    },
    {
      title: "Active Transporters",
      value: stats.activeTransporters,
      icon: <Truck className="h-6 w-6 text-purple-600" />,
      href: "/dashboard/transporters",
      color: "text-purple-600",
    },
    {
      title: "Monthly Revenue",
      value: `₹${(stats.monthlyRevenue / 1000).toFixed(0)}K`,
      icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
      href: "/dashboard/analytics",
      color: "text-orange-600",
    },
  ];

  const getActivityIcon = (type: string, status?: string) => {
    switch (type) {
      case "bid":
        return status === "accepted" ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <Package className="h-4 w-4 text-blue-500" />
        );
      case "deal":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "transporter":
        return <Truck className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your transport
            operations.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/bids/create">
            <Button>Create New Bid</Button>
          </Link>
          <Link href="/dashboard/deals/manual">
            <Button variant="outline">Log Deal</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {card.title}
                    </p>
                    <p className={`text-3xl font-bold mt-2 ${card.color}`}>
                      {card.value}
                    </p>
                  </div>
                  {card.icon}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                >
                  {getActivityIcon(activity.type, activity.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{activity.time}</p>
                      {activity.status && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/dashboard/bids/create" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Create New Bid
                </Button>
              </Link>
              <Link href="/dashboard/deals/manual" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Log Manual Deal
                </Button>
              </Link>
              <Link href="/dashboard/transporters/create" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Truck className="h-4 w-4 mr-2" />
                  Add Transporter
                </Button>
              </Link>
              <Link href="/dashboard/deals/upload" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Upload CSV Data
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
