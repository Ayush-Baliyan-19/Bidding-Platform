// app/dashboard/layout.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  Package,
  FileText,
  Truck,
  Home,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface SidebarItemProps {
  title: string;
  icon: React.ReactNode;
  href?: string;
  children?: { title: string; href: string }[];
}

function SidebarItem({ title, icon, href, children }: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (href && !children) {
    return (
      <Link
        href={href}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {icon}
        <span className="font-medium">{title}</span>
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        {children &&
          (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
      </button>

      {children && isOpen && (
        <div className="ml-6 mt-1 space-y-1">
          {children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authUser, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const sidebarItems: SidebarItemProps[] = [
    {
      title: "Dashboard",
      icon: <Home size={20} />,
      href: "/dashboard",
    },
    {
      title: "Bids",
      icon: <Package size={20} />,
      children: [
        { title: "Active Bids", href: "/dashboard/bids/active" },
        { title: "Create Bid", href: "/dashboard/bids/create" },
      ],
    },
    {
      title: "Deals",
      icon: <FileText size={20} />,
      children: [
        { title: "All Deals", href: "/dashboard/deals/all-deals" },
        { title: "Manual Entry", href: "/dashboard/deals/manual" },
        { title: "Upload CSV", href: "/dashboard/deals/upload" },
      ],
    },
    {
      title: "Transporters",
      icon: <Truck size={20} />,
      children: [
        { title: "All Transporters", href: "/dashboard/transporters" },
        { title: "Add Transporter", href: "/dashboard/transporters/create" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:inset-0
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">
              🚚 Transport Hub
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome, {authUser.email}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <SidebarItem key={item.title} {...item} />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className=" w-full">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
