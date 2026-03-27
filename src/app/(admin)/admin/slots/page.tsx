'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Slot } from '@/types';

export default function SlotsPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [stats, setStats] = useState({ total: 0, available: 0, occupied: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await api.getSlots(filter || undefined);
      setSlots(res.data.slots);
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlots(); }, [filter]);

  const handleToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'available' ? 'occupied' : 'available';
    try {
      await api.updateSlot(id, newStatus as 'available' | 'occupied');
      fetchSlots();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Slots', value: stats.total, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Available', value: stats.available, color: '#10b981', bg: '#ecfdf5' },
          { label: 'Occupied', value: stats.occupied, color: '#f59e0b', bg: '#fffbeb' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border p-4 text-center" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { key: '', label: 'All' },
          { key: 'available', label: 'Available' },
          { key: 'occupied', label: 'Occupied' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f.key ? 'text-white' : ''}`}
            style={filter === f.key ? { background: 'var(--primary)' } : { background: 'var(--muted)', color: 'var(--muted-foreground)' }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Slot Grid */}
      {loading ? (
        <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--border)' }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-2">
          {slots.map((slot) => (
            <button
              key={slot._id}
              onClick={() => handleToggle(slot._id, slot.status)}
              className={`p-3 rounded-xl text-center transition-all hover:scale-105 active:scale-95 border ${
                slot.status === 'available'
                  ? 'border-green-200 dark:border-green-800'
                  : 'border-amber-200 dark:border-amber-800'
              }`}
              style={{
                background: slot.status === 'available' ? '#ecfdf5' : '#fffbeb',
              }}
              title={`Slot ${slot.slotNumber} - ${slot.status} (click to toggle)`}
            >
              <p className={`text-lg font-bold ${slot.status === 'available' ? 'text-green-700' : 'text-amber-700'}`}>
                {slot.slotNumber}
              </p>
              <p className={`text-[10px] font-medium uppercase ${slot.status === 'available' ? 'text-green-600' : 'text-amber-600'}`}>
                {slot.status === 'available' ? 'Free' : 'Used'}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-6 justify-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
          Available (click to mark occupied)
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-100 border border-amber-300" />
          Occupied (click to mark available)
        </div>
      </div>
    </div>
  );
}
