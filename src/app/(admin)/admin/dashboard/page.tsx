"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DashboardStats } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  ClipboardList,
  Car,
  BadgeDollarSign,
  CalendarDays,
  ToggleRight,
  ToggleLeft,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getDashboard()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
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
      </div>
    );
  }

  if (!stats)
    return (
      <p style={{ color: "var(--muted-foreground)" }}>Failed to load dashboard</p>
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
      label: "Activated Parkings",
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
      label: "Today's Bookings",
      value: stats.todayBookings.toLocaleString(),
      icon: CalendarDays,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Booking toggle status banner */}
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-2xl border text-sm font-medium ${
          stats.bookingEnabled
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}
      >
        {stats.bookingEnabled ? (
          <ToggleRight className="w-5 h-5 shrink-0" />
        ) : (
          <ToggleLeft className="w-5 h-5 shrink-0" />
        )}
        <span>
          Booking is currently{" "}
          <strong>{stats.bookingEnabled ? "enabled" : "disabled"}</strong>
          {!stats.bookingEnabled && " — customers cannot make new reservations."}{" "}
          {stats.bookingEnabled && "— customers can book parking spaces."}
        </span>
        <a
          href="/admin/bookings"
          className="ml-auto underline text-xs font-semibold opacity-70 hover:opacity-100"
        >
          Manage →
        </a>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div
              key={i}
              className="rounded-2xl border p-5 transition-all hover:shadow-md"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
                  {kpi.label}
                </span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            </div>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Booking status breakdown */}
        <div
          className="rounded-2xl border p-6"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>
            Booking Status Overview
          </h3>
          <div className="space-y-3">
            {[
              { label: "Upcoming", value: stats.upcomingBookings, color: "#3b82f6" },
              { label: "Activated", value: stats.activeBookings, color: "#10b981" },
              { label: "Completed", value: stats.completedBookings, color: "#6b7280" },
              { label: "Cancelled", value: stats.cancelledBookings, color: "#ef4444" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                  <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {item.label}
                  </span>
                </div>
                <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div
          className="rounded-2xl border p-6"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>
            Quick Stats
          </h3>
          <div className="space-y-4">
            {[
              { label: "Today's Bookings", value: String(stats.todayBookings) },
              {
                label: "Avg. Revenue Per Booking",
                value:
                  stats.completedBookings + stats.activeBookings > 0
                    ? formatPrice(
                        stats.totalRevenue /
                          (stats.completedBookings + stats.activeBookings),
                      )
                    : "£0.00",
              },
              { label: "Total Revenue", value: formatPrice(stats.totalRevenue) },
            ].map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-xl"
                style={{ background: "var(--muted)" }}
              >
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {item.label}
                </p>
                <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
