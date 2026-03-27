'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Booking } from '@/types';
import { formatDateTime, formatPrice, formatDuration, getStatusColor } from '@/lib/utils';

function TrackContent() {
  const searchParams = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get('number') || '');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (searchParams.get('number')) {
      handleSearch();
    }
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError('');
    setBooking(null);
    setSearched(true);

    try {
      const res = await api.trackBooking(trackingNumber.trim());
      setBooking(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Booking not found');
    } finally {
      setLoading(false);
    }
  };

  const totalHours = booking
    ? (new Date(booking.bookedEndTime).getTime() - new Date(booking.bookedStartTime).getTime()) / (1000 * 60 * 60)
    : 0;

  const now = new Date();
  const endTime = booking ? new Date(booking.bookedEndTime) : now;
  const timeRemaining = booking && booking.status === 'active'
    ? Math.max(0, (endTime.getTime() - now.getTime()) / (1000 * 60 * 60))
    : 0;
  const timeExceeded = booking && booking.status === 'active'
    ? Math.max(0, (now.getTime() - endTime.getTime()) / (1000 * 60 * 60))
    : 0;

  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--muted)' }}>
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Track Your Booking</h1>
          <p style={{ color: 'var(--muted-foreground)' }}>Enter your tracking number to view your booking status</p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
              placeholder="e.g. PPK-A3B4C5"
              className="flex-1 px-5 py-3.5 rounded-xl border text-lg font-mono tracking-wider focus:outline-none focus:ring-2 uppercase"
              style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-xl text-white font-bold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--primary)' }}
            >
              {loading ? '...' : 'Track'}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl text-center text-red-800 bg-red-50 border border-red-200 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Results */}
        {booking && (
          <div className="space-y-4 animate-fade-in">
            {/* Status badge */}
            <div className="rounded-2xl border p-6 text-center" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <span className={`inline-flex px-4 py-1.5 rounded-full text-sm font-bold uppercase ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
              <p className="text-3xl font-bold tracking-wider mt-3" style={{ color: 'var(--primary)' }}>{booking.trackingNumber}</p>

              {/* Time indicator */}
              {booking.status === 'active' && (
                <div className="mt-4 p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                  {timeExceeded > 0 ? (
                    <p className="text-red-600 font-semibold">⚠️ Exceeded by {formatDuration(timeExceeded)}</p>
                  ) : (
                    <p className="text-green-600 font-semibold">⏰ {formatDuration(timeRemaining)} remaining</p>
                  )}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>Booking Details</h2>
              <div className="space-y-2.5">
                <DetailRow label="Slot Number" value={`Slot ${booking.slotNumber}`} />
                <DetailRow label="Drop-off" value={formatDateTime(booking.bookedStartTime)} />
                <DetailRow label="Pick-up" value={formatDateTime(booking.bookedEndTime)} />
                <DetailRow label="Duration" value={formatDuration(totalHours)} />
                <DetailRow label="Vehicle" value={`${booking.carMake} ${booking.carModel} (${booking.carColor})`} />
                <DetailRow label="Registration" value={booking.carNumber} />
                <div className="pt-3 mt-3 border-t flex justify-between" style={{ borderColor: 'var(--border)' }}>
                  <span className="font-bold" style={{ color: 'var(--foreground)' }}>Total Price</span>
                  <span className="text-xl font-bold" style={{ color: 'var(--primary)' }}>{formatPrice(booking.totalPrice)}</span>
                </div>
                {booking.overtimeHours > 0 && (
                  <div className="text-xs text-red-600">Overtime: {booking.overtimeHours}h (+{formatPrice(booking.overtimePrice)})</div>
                )}
              </div>
            </div>
          </div>
        )}

        {searched && !booking && !loading && !error && (
          <div className="text-center p-8 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>No booking found for this tracking number</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{label}</span>
      <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{value}</span>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>}>
      <TrackContent />
    </Suspense>
  );
}
