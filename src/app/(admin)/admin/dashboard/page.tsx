"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DashboardStats } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  ClipboardList,
  Car,
  BadgeDollarSign,
  ParkingCircle,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getDashboard();
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl animate-pulse"
              style={{ background: "var(--border)" }}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-48 rounded-2xl animate-pulse"
              style={{ background: "var(--border)" }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!stats)
    return (
      <p style={{ color: "var(--muted-foreground)" }}>
        Failed to load dashboard
      </p>
    );

  const kpis = [
    {
      label: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Active Parkings",
      value: stats.activeBookings.toLocaleString(),
      icon: Car,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: BadgeDollarSign,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      label: "Available Slots",
      value: `${stats.slots.available}/${stats.slots.total}`,
      icon: ParkingCircle,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div
              key={i}
              className="rounded-2xl border p-5 transition-all hover:shadow-md hover:scale-[1.02]"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {kpi.label}
                </span>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg} group-hover:scale-110 transition`}
                >
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>

                {/* <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: kpi.bgColor }}
              >
                {kpi.icon}
              </div> */}
              </div>
              <p className="text-2xl font-bold" style={{ color: kpi.color }}>
                {kpi.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className="rounded-2xl border p-6"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: "var(--foreground)" }}
          >
            Booking Status Overview
          </h3>
          <div className="space-y-3">
            {[
              {
                label: "Upcoming",
                value: stats.upcomingBookings,
                color: "#3b82f6",
              },
              {
                label: "Active",
                value: stats.activeBookings,
                color: "#10b981",
              },
              {
                label: "Completed",
                value: stats.completedBookings,
                color: "#6b7280",
              },
              {
                label: "Cancelled",
                value: stats.cancelledBookings,
                color: "#ef4444",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: item.color }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {item.label}
                  </span>
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl border p-6"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: "var(--foreground)" }}
          >
            Slot Utilization
          </h3>
          <div className="flex items-center justify-center">
            <div className="relative w-36 h-36">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray={`${(stats.slots.occupied / stats.slots.total) * 100}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-2xl font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  {Math.round((stats.slots.occupied / stats.slots.total) * 100)}
                  %
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Occupied
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-6 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />{" "}
              <span style={{ color: "var(--muted-foreground)" }}>
                Occupied ({stats.slots.occupied})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "var(--border)" }}
              />{" "}
              <span style={{ color: "var(--muted-foreground)" }}>
                Available ({stats.slots.available})
              </span>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl border p-6"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: "var(--foreground)" }}
          >
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div
              className="p-3 rounded-xl"
              style={{ background: "var(--muted)" }}
            >
              <p
                className="text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                Today&apos;s Bookings
              </p>
              <p
                className="text-xl font-bold"
                style={{ color: "var(--foreground)" }}
              >
                {stats.todayBookings}
              </p>
            </div>
            <div
              className="p-3 rounded-xl"
              style={{ background: "var(--muted)" }}
            >
              <p
                className="text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                Total Parking Slots
              </p>
              <p
                className="text-xl font-bold"
                style={{ color: "var(--foreground)" }}
              >
                {stats.slots.total}
              </p>
            </div>
            <div
              className="p-3 rounded-xl"
              style={{ background: "var(--muted)" }}
            >
              <p
                className="text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                Avg. Revenue Per Booking
              </p>
              <p
                className="text-xl font-bold"
                style={{ color: "var(--foreground)" }}
              >
                {stats.totalBookings > 0
                  ? formatPrice(
                      stats.totalRevenue /
                        (stats.completedBookings + stats.activeBookings || 1),
                    )
                  : "£0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
