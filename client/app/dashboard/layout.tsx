import Link from "next/link";
import { ReactNode } from "react";
// import { cn } from "@/lib/utils"; // optional if using class merging
import LogoutButton from "@/components/shared/logoutButton";

const navItems = [
  { name: "Bids", href: "/dashboard/bids" },
  { name: "Transporters", href: "/dashboard/transporters" },
  { name: "Analytics", href: "/dashboard/analytics" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-100 dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold mb-6">🚛 Transport Hub</h1>
        <nav className="space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <LogoutButton />
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white dark:bg-black p-6">{children}</main>
    </div>
  );
}
