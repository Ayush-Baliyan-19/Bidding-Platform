"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TruckIcon,
  ClipboardListIcon,
  HandshakeIcon,
  TrendingUpIcon,
  PlusIcon,
  EyeIcon,
  FileTextIcon,
  UsersIcon,
} from "lucide-react";

// Mock data - replace with actual API calls
const mockStats = {
  activeBids: 24,
  totalTransporters: 156,
  dealsThisMonth: 89,
  revenue: 2850000,
};

const mockRecentBids = [
  { id: 1, material: "Steel Rods", quantity: 15, status: "open", offers: 3 },
  { id: 2, material: "Cement", quantity: 25, status: "accepted", offers: 7 },
  { id: 3, material: "Sand", quantity: 40, status: "open", offers: 2 },
];

const mockRecentDeals = [
  {
    id: 1,
    material: "Bricks",
    amount: 45000,
    transporter: "Mumbai Logistics",
    date: "2025-05-30",
  },
  {
    id: 2,
    material: "Gravel",
    amount: 32000,
    transporter: "Express Freight",
    date: "2025-05-29",
  },
  {
    id: 3,
    material: "Concrete",
    amount: 78000,
    transporter: "Swift Transport",
    date: "2025-05-28",
  },
];

export default function DashboardHome() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {getGreeting()}! 👋
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              Welcome to your Freight Management Hub
            </p>
            <p className="text-sm text-gray-500">
              {currentTime.toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              • {currentTime.toLocaleTimeString("en-IN")}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
              <TruckIcon className="w-16 h-16 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Bids</p>
                <p className="text-3xl font-bold">{mockStats.activeBids}</p>
                <p className="text-blue-100 text-xs mt-1">+3 from yesterday</p>
              </div>
              <ClipboardListIcon className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  Transporters
                </p>
                <p className="text-3xl font-bold">
                  {mockStats.totalTransporters}
                </p>
                <p className="text-green-100 text-xs mt-1">142 active</p>
              </div>
              <TruckIcon className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">
                  Deals This Month
                </p>
                <p className="text-3xl font-bold">{mockStats.dealsThisMonth}</p>
                <p className="text-purple-100 text-xs mt-1">
                  +12% from last month
                </p>
              </div>
              <HandshakeIcon className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Revenue</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(mockStats.revenue)}
                </p>
                <p className="text-orange-100 text-xs mt-1">This month</p>
              </div>
              <TrendingUpIcon className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8 shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
              <PlusIcon className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">Create Bid</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
              <EyeIcon className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">View Offers</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
              <FileTextIcon className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">Log Deal</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
              <UsersIcon className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">Manage Transporters</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bids */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center">
              <ClipboardListIcon className="w-5 h-5 mr-2" />
              Recent Bids
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {mockRecentBids.map((bid) => (
                <div
                  key={bid.id}
                  className="p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      {bid.material}
                    </h4>
                    <Badge
                      variant={
                        bid.status === "accepted" ? "default" : "secondary"
                      }
                      className={
                        bid.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : ""
                      }
                    >
                      {bid.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{bid.quantity} tons</span>
                    <span>{bid.offers} offers</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 rounded-b-lg">
              <Button variant="outline" className="w-full">
                View All Bids
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Deals */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center">
              <HandshakeIcon className="w-5 h-5 mr-2" />
              Recent Deals
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {mockRecentDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      {deal.material}
                    </h4>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(deal.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{deal.transporter}</span>
                    <span>
                      {new Date(deal.date).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 rounded-b-lg">
              <Button variant="outline" className="w-full">
                View All Deals
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="mt-6 shadow-lg border-0 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <TrendingUpIcon className="w-6 h-6 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">
              Performance Insights
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-2xl font-bold text-indigo-600">92%</p>
              <p className="text-sm text-gray-600">Bid Acceptance Rate</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-2xl font-bold text-purple-600">4.2 days</p>
              <p className="text-sm text-gray-600">Avg. Bid Duration</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-2xl font-bold text-green-600">₹1,847</p>
              <p className="text-sm text-gray-600">Avg. Deal Value per Ton</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
