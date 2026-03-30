"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Booking } from "@/types";
import {
  formatDateTime,
  formatDuration,
  formatPrice,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, ToggleLeft, ToggleRight } from "lucide-react";

const tabs = [
  { key: "", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "active", label: "Activated" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updating, setUpdating] = useState(false);
  const [bookingEnabled, setBookingEnabled] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);

  const fetchBookings = useCallback(
    async (
      showLoader = true,
      overrides?: { page?: number; search?: string },
    ) => {
      if (showLoader) {
        setLoading(true);
      }

      try {
        const effectivePage = overrides?.page ?? page;
        const effectiveSearch = overrides?.search ?? appliedSearch;
        const res = await api.getBookings({
          status: activeTab || undefined,
          page: effectivePage,
          limit: 15,
          search: effectiveSearch || undefined,
        });

        setBookings(res.data.bookings);
        setTotalPages(res.data.totalPages);
        setTotal(res.data.total);
        setSelectedBooking((current) =>
          current
            ? res.data.bookings.find((booking) => booking._id === current._id) ??
              current
            : null,
        );
      } catch (err) {
        console.error(err);
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    [activeTab, appliedSearch, page],
  );

  const fetchToggle = async () => {
    try {
      const res = await api.getBookingToggle();
      setBookingEnabled(res.data.bookingEnabled);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    void fetchToggle();
  }, []);

  useEffect(() => {
    void fetchBookings();

    const intervalId = window.setInterval(() => {
      void fetchBookings(false);
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [fetchBookings]);

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const nextSearch = search.trim();
    const shouldRefetchImmediately =
      page === 1 && nextSearch === appliedSearch;

    setAppliedSearch(nextSearch);
    setPage(1);

    if (shouldRefetchImmediately) {
      void fetchBookings(true, { page: 1, search: nextSearch });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(true);
    try {
      const actualExitTime =
        newStatus === "completed" ? new Date().toISOString() : undefined;

      await api.updateBookingStatus(id, newStatus, actualExitTime);
      await fetchBookings(false);
      setSelectedBooking(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggle = async () => {
    setToggleLoading(true);
    try {
      const res = await api.setBookingToggle(!bookingEnabled);
      setBookingEnabled(res.data.bookingEnabled);
    } catch (err) {
      console.error(err);
    } finally {
      setToggleLoading(false);
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
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            Bookings
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            {total} total bookings
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all hover:shadow-md"
            style={{
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div
        className="flex items-center justify-between rounded-2xl border p-4"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Accept New Bookings
          </p>
          <p
            className="mt-0.5 text-xs"
            style={{ color: "var(--muted-foreground)" }}
          >
            {bookingEnabled
              ? "Customers can currently book parking spaces."
              : "Booking is disabled and customers cannot make new reservations."}
          </p>
        </div>

        <button
          onClick={handleToggle}
          disabled={toggleLoading}
          className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all disabled:opacity-60 ${
            bookingEnabled
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {toggleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : bookingEnabled ? (
            <ToggleRight className="h-5 w-5" />
          ) : (
            <ToggleLeft className="h-5 w-5" />
          )}
          {bookingEnabled ? "Enabled" : "Disabled"}
        </button>
      </div>

      <div
        className="flex flex-wrap gap-1 rounded-xl p-1"
        style={{ background: "var(--muted)" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setPage(1);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.key ? "text-white shadow-sm" : ""
            }`}
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

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, tracking #, or car reg..."
          className="flex-1 rounded-xl border px-4 py-2.5 text-sm"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        />
        <button
          type="submit"
          className="rounded-xl px-5 py-2.5 text-sm font-medium text-white"
          style={{ background: "var(--primary)" }}
        >
          Search
        </button>
      </form>

      <div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-2xl animate-pulse"
                style={{ background: "var(--border)" }}
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div
            className="py-12 text-center"
            style={{ color: "var(--muted-foreground)" }}
          >
            No bookings found
          </div>
        ) : (
          bookings.map((booking) => {
            const scheduledHours =
              (new Date(booking.bookedEndTime).getTime() -
                new Date(booking.bookedStartTime).getTime()) /
              (1000 * 60 * 60);
            const statusLabel = booking.statusLabel ?? getStatusLabel(booking.status);
            const currentTotalPrice =
              booking.currentTotalPrice ?? booking.totalPrice;
            const uptimeHours = booking.uptimeHours ?? 0;
            const uptimePrice = booking.uptimePrice ?? 0;

            return (
              <div
                key={booking._id}
                onClick={() => setSelectedBooking(booking)}
                className="mb-3 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition-all hover:shadow-md"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--card)",
                }}
              >
                <div className="min-w-45">
                  <p
                    className="text-xs font-mono font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    {booking.trackingNumber}
                  </p>
                  <p className="font-medium">{booking.userName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {booking.userEmail}
                  </p>
                </div>

                <div className="min-w-40">
                  <p>
                    {booking.carMake} {booking.carModel}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground">
                    {booking.carNumber}
                  </p>
                </div>

                <div className="min-w-30">
                  <p className="text-xs truncate">
                    <span>{formatDateTime(booking.bookedStartTime)}</span>
                    <br />
                    <span>to</span>
                    <br />
                    <span>{formatDateTime(booking.bookedEndTime)}</span>
                  </p>
                  <p className="font-medium">{formatDuration(scheduledHours)}</p>
                  {booking.isOvertimeRunning && uptimeHours > 0 && (
                    <p className="text-xs font-medium text-amber-600">
                      Uptime {formatDuration(uptimeHours)}
                    </p>
                  )}
                </div>

                <div className="min-w-30 text-right">
                  <p className="text-lg font-bold">
                    {formatPrice(currentTotalPrice)}
                  </p>
                  {booking.lateChargeMode === "pending" && uptimePrice > 0 && (
                    <p className="text-xs text-amber-600">
                      Uptime charges +{formatPrice(uptimePrice)}
                    </p>
                  )}
                  {booking.lateChargeMode === "finalized" && uptimePrice > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Late exit already added
                    </p>
                  )}
                </div>

                <div className="flex min-w-40 flex-col items-center gap-2">
                  <Badge
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs uppercase ${getStatusColor(booking.status)}`}
                  >
                    {statusLabel}
                  </Badge>
                  {booking.status === "upcoming" &&
                    (booking.canActivate ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleStatusChange(booking._id, "active");
                        }}
                        disabled={updating}
                        className="min-w-35 max-w-fit rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
                      >
                        Activate
                      </button>
                    ) : (
                      <p className="max-w-32 text-center text-[11px] text-amber-600">
                        Activate from {formatDateTime(booking.bookedStartTime)}
                      </p>
                    ))}
                  {booking.status === "active" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleStatusChange(booking._id, "completed");
                      }}
                      disabled={updating}
                      className="min-w-35 max-w-fit rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-30"
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
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
            disabled={page >= totalPages}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-30"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            Next
          </button>
        </div>
      )}

      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl p-6 animate-slide-up"
            style={{ background: "var(--card)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
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
                x
              </button>
            </div>

            <div className="mb-4 text-center">
              <p
                className="text-2xl font-bold font-mono"
                style={{ color: "var(--primary)" }}
              >
                {selectedBooking.trackingNumber}
              </p>
              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${getStatusColor(selectedBooking.status)}`}
              >
                {selectedBooking.statusLabel ??
                  getStatusLabel(selectedBooking.status)}
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
                label="Duration"
                value={formatDuration(
                  (new Date(selectedBooking.bookedEndTime).getTime() -
                    new Date(selectedBooking.bookedStartTime).getTime()) /
                    (1000 * 60 * 60),
                )}
              />
              <Row label="Booked Price" value={formatPrice(selectedBooking.price)} />
              {selectedBooking.status === "upcoming" &&
                !selectedBooking.canActivate && (
                  <Row
                    label="Activation"
                    value={`Available from ${formatDateTime(selectedBooking.bookedStartTime)}`}
                  />
                )}
              {selectedBooking.status === "active" &&
                !selectedBooking.isOvertimeRunning &&
                (selectedBooking.timeRemainingHours ?? 0) > 0 && (
                  <Row
                    label="Time Remaining"
                    value={formatDuration(
                      selectedBooking.timeRemainingHours ?? 0,
                    )}
                  />
                )}
              {(selectedBooking.uptimeHours ?? 0) > 0 && (
                <Row
                  label={
                    selectedBooking.lateChargeMode === "pending"
                      ? "Pending Uptime"
                      : "Uptime"
                  }
                  value={`${formatDuration(
                    selectedBooking.uptimeHours ?? 0,
                  )} (+${formatPrice(selectedBooking.uptimePrice ?? 0)})`}
                />
              )}
              <div
                className="mt-3 border-t pt-3"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex justify-between">
                  <span
                    className="font-bold"
                    style={{ color: "var(--foreground)" }}
                  >
                    Total Price
                  </span>
                  <span
                    className="text-lg font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    {formatPrice(
                      selectedBooking.currentTotalPrice ??
                        selectedBooking.totalPrice,
                    )}
                  </span>
                </div>
                {selectedBooking.lateChargeMode === "pending" && (
                  <p className="mt-2 text-xs text-amber-600">
                    Extra uptime should be collected manually in cash at pickup.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              {selectedBooking.status === "upcoming" && (
                <>
                  <button
                    onClick={() =>
                      void handleStatusChange(selectedBooking._id, "active")
                    }
                    disabled={updating || !selectedBooking.canActivate}
                    className="flex-1 rounded-xl bg-green-500 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-60"
                  >
                    {selectedBooking.canActivate
                      ? "Activate"
                      : "Waiting for start time"}
                  </button>
                  <button
                    onClick={() =>
                      void handleStatusChange(selectedBooking._id, "cancelled")
                    }
                    disabled={updating}
                    className="flex-1 rounded-xl bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </>
              )}
              {selectedBooking.status === "active" && (
                <button
                  onClick={() =>
                    void handleStatusChange(selectedBooking._id, "completed")
                  }
                  disabled={updating}
                  className="flex-1 rounded-xl bg-blue-500 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60"
                >
                  Mark Completed
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
    <div className="flex justify-between gap-4 py-1">
      <span style={{ color: "var(--muted-foreground)" }}>{label}</span>
      <span
        className="text-right font-medium"
        style={{ color: "var(--foreground)" }}
      >
        {value}
      </span>
    </div>
  );
}
