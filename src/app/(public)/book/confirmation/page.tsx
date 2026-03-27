'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Booking } from '@/types';
import { formatDateTime, formatPrice, formatDuration } from '@/lib/utils';

export default function ConfirmationPage() {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('lastBooking');
    if (data) {
      setBooking(JSON.parse(data));
    } else {
      router.push('/book');
    }
  }, [router]);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const totalHours = (new Date(booking.bookedEndTime).getTime() - new Date(booking.bookedStartTime).getTime()) / (1000 * 60 * 60);

  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--muted)' }}>
      <div className="max-w-2xl mx-auto px-4">
        {/* Success header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4" style={{ background: '#dcfce7' }}>
            ✅
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Booking Confirmed!</h1>
          <p style={{ color: 'var(--muted-foreground)' }}>A confirmation email has been sent to {booking.userEmail}</p>
        </div>

        {/* Tracking number */}
        <div className="rounded-2xl border p-6 text-center mb-6 animate-fade-in" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>YOUR TRACKING NUMBER</p>
          <p className="text-4xl font-bold tracking-wider mb-2" style={{ color: 'var(--primary)' }}>{booking.trackingNumber}</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Save this number to track your booking anytime</p>
        </div>

        {/* Booking details */}
        <div className="rounded-2xl border p-6 mb-6" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>Booking Details</h2>
          <div className="space-y-3">
            <DetailRow label="Parking Slot" value={`Slot ${booking.slotNumber}`} highlight />
            <DetailRow label="Drop-off" value={formatDateTime(booking.bookedStartTime)} />
            <DetailRow label="Pick-up" value={formatDateTime(booking.bookedEndTime)} />
            <DetailRow label="Duration" value={formatDuration(totalHours)} />
            <DetailRow label="Vehicle" value={`${booking.carMake} ${booking.carModel} (${booking.carColor})`} />
            <DetailRow label="Registration" value={booking.carNumber} />
            <div className="pt-3 mt-3 border-t flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
              <span className="font-bold" style={{ color: 'var(--foreground)' }}>Total Price</span>
              <div className="text-right">
                <span className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>{formatPrice(booking.totalPrice)}</span>
                {booking.discountPercent > 0 && (
                  <p className="text-xs text-green-600">{booking.discountPercent}% discount applied</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/track?number=${booking.trackingNumber}`}
            className="flex-1 py-3 rounded-xl text-white font-semibold text-center transition-all hover:opacity-90"
            style={{ background: 'var(--primary)' }}
          >
            Track Booking
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 rounded-xl font-semibold text-center border transition-all hover:opacity-80"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{label}</span>
      <span
        className={`text-sm font-semibold ${highlight ? 'px-3 py-1 rounded-full text-white' : ''}`}
        style={highlight ? { background: 'var(--primary)' } : { color: 'var(--foreground)' }}
      >
        {value}
      </span>
    </div>
  );
}
