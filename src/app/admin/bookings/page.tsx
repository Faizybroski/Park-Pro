"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Booking } from "@/types";
import {
  formatDateTime,
  formatPrice,
  formatDuration,
  getStatusColor,
} from "@/lib/utils";
import { Download } from "lucide-react";

const tabs = [
  { key: "", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.getBookings({
        status: activeTab || undefined,
        page,
        limit: 15,
        search: search || undefined,
      });
      setBookings(res.data.bookings);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeTab, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBookings();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(true);
    try {
      const payload: Record<string, string> = { status: newStatus };
      if (newStatus === "completed") {
        payload.actualExitTime = new Date().toISOString();
      }
      await api.updateBookingStatus(id, newStatus, payload.actualExitTime);
      fetchBookings();
      setSelectedBooking(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleExport = async () => {
    try {
      const csv = await api.exportBookings(activeTab || undefined);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bookings-${activeTab || "all"}-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            Bookings
          </h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {total} total bookings
          </p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 flex items-center gap-2 rounded-xl text-sm font-semibold border transition-all hover:shadow-md"
          style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
        >
          {/* 📥 Export CSV */}
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div
        className="flex flex-wrap gap-1 p-1 rounded-xl"
        style={{ background: "var(--muted)" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? "text-white shadow-sm" : ""}`}
            style={
              activeTab === tab.key
                ? { background: "var(--primary)" }
                : { color: "var(--muted-foreground)" }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, tracking #, or car reg..."
          className="flex-1 px-4 py-2.5 rounded-xl border text-sm"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl text-white text-sm font-medium"
          style={{ background: "var(--primary)" }}
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--muted)" }}>
                <th
                  className="text-left px-4 py-3 font-medium"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Tracking #
                </th>
                <th
                  className="text-left px-4 py-3 font-medium"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Customer
                </th>
                <th
                  className="text-left px-4 py-3 font-medium hidden md:table-cell"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Vehicle
                </th>
                <th
                  className="text-left px-4 py-3 font-medium hidden lg:table-cell"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Slot
                </th>
                <th
                  className="text-left px-4 py-3 font-medium hidden lg:table-cell"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Dates
                </th>
                <th
                  className="text-left px-4 py-3 font-medium"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Price
                </th>
                <th
                  className="text-left px-4 py-3 font-medium"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Status
                </th>
                <th
                  className="text-left px-4 py-3 font-medium"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="px-4 py-4">
                      <div
                        className="h-4 rounded animate-pulse"
                        style={{ background: "var(--border)" }}
                      />
                    </td>
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const hours =
                    (new Date(booking.bookedEndTime).getTime() -
                      new Date(booking.bookedStartTime).getTime()) /
                    (1000 * 60 * 60);
                  return (
                    <tr
                      key={booking._id}
                      className="border-t cursor-pointer hover:opacity-80 transition-all"
                      style={{ borderColor: "var(--border)" }}
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <td
                        className="px-4 py-3 font-mono font-bold text-xs"
                        style={{ color: "var(--primary)" }}
                      >
                        {booking.trackingNumber}
                      </td>
                      <td className="px-4 py-3">
                        <p
                          className="font-medium"
                          style={{ color: "var(--foreground)" }}
                        >
                          {booking.userName}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          {booking.userEmail}
                        </p>
                      </td>
                      <td
                        className="px-4 py-3 hidden md:table-cell"
                        style={{ color: "var(--foreground)" }}
                      >
                        {booking.carMake} {booking.carModel}
                        <br />
                        <span
                          className="text-xs font-mono"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          {booking.carNumber}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3 hidden lg:table-cell font-bold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {booking.slotNumber}
                      </td>
                      <td
                        className="px-4 py-3 hidden lg:table-cell text-xs"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {formatDateTime(booking.bookedStartTime)}
                        <br />→ {formatDateTime(booking.bookedEndTime)}
                        <br />
                        <span className="font-medium">
                          {formatDuration(hours)}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3 font-bold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {formatPrice(booking.totalPrice)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {booking.status === "upcoming" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(booking._id, "active");
                            }}
                            className="text-xs font-medium px-3 py-1 rounded-lg text-white"
                            style={{ background: "#10b981" }}
                          >
                            Activate
                          </button>
                        )}
                        {booking.status === "active" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(booking._id, "completed");
                            }}
                            className="text-xs font-medium px-3 py-1 rounded-lg text-white"
                            style={{ background: "#3b82f6" }}
                          >
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 rounded-lg border text-sm disabled:opacity-30"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            Previous
          </button>
          <span
            className="px-4 py-2 text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded-lg border text-sm disabled:opacity-30"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            Next
          </button>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up"
            style={{ background: "var(--card)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                className="text-lg font-bold"
                style={{ color: "var(--foreground)" }}
              >
                Booking Details
              </h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-xl"
                style={{ color: "var(--muted-foreground)" }}
              >
                ✕
              </button>
            </div>
            <div className="text-center mb-4">
              <p
                className="text-2xl font-bold font-mono"
                style={{ color: "var(--primary)" }}
              >
                {selectedBooking.trackingNumber}
              </p>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase mt-2 ${getStatusColor(selectedBooking.status)}`}
              >
                {selectedBooking.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <Row label="Name" value={selectedBooking.userName} />
              <Row label="Email" value={selectedBooking.userEmail} />
              <Row label="Phone" value={selectedBooking.userPhone} />
              <Row
                label="Vehicle"
                value={`${selectedBooking.carMake} ${selectedBooking.carModel} (${selectedBooking.carColor})`}
              />
              <Row label="Registration" value={selectedBooking.carNumber} />
              <Row label="Slot" value={`Slot ${selectedBooking.slotNumber}`} />
              <Row
                label="Drop-off"
                value={formatDateTime(selectedBooking.bookedStartTime)}
              />
              <Row
                label="Pick-up"
                value={formatDateTime(selectedBooking.bookedEndTime)}
              />
              {selectedBooking.actualExitTime && (
                <Row
                  label="Actual Exit"
                  value={formatDateTime(selectedBooking.actualExitTime)}
                />
              )}
              <Row
                label="Booked Duration"
                value={formatDuration(
                  (new Date(selectedBooking.bookedEndTime).getTime() -
                    new Date(selectedBooking.bookedStartTime).getTime()) /
                    (1000 * 60 * 60),
                )}
              />
              {selectedBooking.overtimeHours > 0 && (
                <Row
                  label="Overtime"
                  value={`${selectedBooking.overtimeHours}h (+${formatPrice(selectedBooking.overtimePrice)})`}
                />
              )}
              <div
                className="pt-3 mt-3 border-t flex justify-between"
                style={{ borderColor: "var(--border)" }}
              >
                <span
                  className="font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  Total Price
                </span>
                <span
                  className="font-bold text-lg"
                  style={{ color: "var(--primary)" }}
                >
                  {formatPrice(selectedBooking.totalPrice)}
                </span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {selectedBooking.status === "upcoming" && (
                <>
                  <button
                    onClick={() =>
                      handleStatusChange(selectedBooking._id, "active")
                    }
                    disabled={updating}
                    className="flex-1 py-2 rounded-xl text-white text-sm font-medium"
                    style={{ background: "#10b981" }}
                  >
                    Activate
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(selectedBooking._id, "cancelled")
                    }
                    disabled={updating}
                    className="flex-1 py-2 rounded-xl text-white text-sm font-medium"
                    style={{ background: "#ef4444" }}
                  >
                    Cancel
                  </button>
                </>
              )}
              {selectedBooking.status === "active" && (
                <button
                  onClick={() =>
                    handleStatusChange(selectedBooking._id, "completed")
                  }
                  disabled={updating}
                  className="flex-1 py-2 rounded-xl text-white text-sm font-medium"
                  style={{ background: "#3b82f6" }}
                >
                  Mark Completed (Car Picked Up)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1">
      <span style={{ color: "var(--muted-foreground)" }}>{label}</span>
      <span className="font-medium" style={{ color: "var(--foreground)" }}>
        {value}
      </span>
    </div>
  );
}
