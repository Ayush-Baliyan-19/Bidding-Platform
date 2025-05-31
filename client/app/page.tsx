"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TruckIcon,
  BarChart3Icon,
  ClipboardCheckIcon,
  PackageIcon,
  UsersIcon,
  PlusIcon,
  TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  DollarSignIcon,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-md flex items-center justify-center">
              <TruckIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800">
              FreightFlow
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">Documentation</Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-cyan-600"
              onClick={() => (window.location.href = "/login")}
            >
              Access Platform
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Freight Operations
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              Command Center
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Streamline your bidding process, manage transporters efficiently,
            and gain actionable insights into your freight operations with our
            comprehensive management platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Create New Bid
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">
                    Active Bids
                  </p>
                  <p className="text-3xl font-bold text-blue-800">24</p>
                  <p className="text-blue-600 text-xs">+3 from yesterday</p>
                </div>
                <ClipboardCheckIcon className="h-12 w-12 text-blue-600 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">
                    Completed Deals
                  </p>
                  <p className="text-3xl font-bold text-green-800">156</p>
                  <p className="text-green-600 text-xs">This month</p>
                </div>
                <CheckCircleIcon className="h-12 w-12 text-green-600 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">
                    Active Transporters
                  </p>
                  <p className="text-3xl font-bold text-amber-800">89</p>
                  <p className="text-amber-600 text-xs">Verified partners</p>
                </div>
                <TruckIcon className="h-12 w-12 text-amber-600 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Revenue</p>
                  <p className="text-3xl font-bold text-purple-800">₹2.4M</p>
                  <p className="text-purple-600 text-xs">+12% this quarter</p>
                </div>
                <DollarSignIcon className="h-12 w-12 text-purple-600 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Bid Activity
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <PackageIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          Steel Coils - Mumbai to Delhi
                        </p>
                        <p className="text-sm text-slate-500">
                          25 tons • Deadline: 3 days
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">5 Offers</Badge>
                      <p className="text-sm text-slate-500 mt-1">
                        ₹45,000 - ₹52,000
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          Cement - Pune to Bangalore
                        </p>
                        <p className="text-sm text-slate-500">
                          40 tons • Completed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">
                        Delivered
                      </Badge>
                      <p className="text-sm text-slate-500 mt-1">₹38,500</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <ClockIcon className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          Electronics - Chennai to Hyderabad
                        </p>
                        <p className="text-sm text-slate-500">
                          15 tons • In Transit
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">In Progress</Badge>
                      <p className="text-sm text-slate-500 mt-1">₹28,000</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Key metrics for this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">
                        Bid Success Rate
                      </span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "78%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">
                        On-Time Delivery
                      </span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">
                        Cost Efficiency
                      </span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">
                        Transporter Rating
                      </span>
                      <span className="text-sm font-medium">4.6/5</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Alerts */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create New Bid
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TruckIcon className="mr-2 h-4 w-4" />
                  Add Transporter
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <PackageIcon className="mr-2 h-4 w-4" />
                  Log Manual Deal
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3Icon className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <UsersIcon className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircleIcon className="mr-2 h-5 w-5 text-amber-500" />
                  Alerts & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm font-medium text-amber-800">
                    Bid Expiring Soon
                  </p>
                  <p className="text-xs text-amber-600">
                    Steel shipment bid expires in 2 hours
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    New Transporter Request
                  </p>
                  <p className="text-xs text-blue-600">
                    3 new transporters pending approval
                  </p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    Monthly Target Achieved
                  </p>
                  <p className="text-xs text-green-600">
                    Congratulations! 105% of target reached
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUpIcon className="mr-2 h-5 w-5 text-green-500" />
                  Market Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">
                        Mumbai-Delhi Route
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        ↑ 5%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Average rate: ₹1,850/ton
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">
                        Chennai-Bangalore Route
                      </span>
                      <span className="text-sm font-medium text-red-600">
                        ↓ 2%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Average rate: ₹1,420/ton
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">
                        Pune-Hyderabad Route
                      </span>
                      <span className="text-sm font-medium text-slate-600">
                        → 0%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Average rate: ₹1,650/ton
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
