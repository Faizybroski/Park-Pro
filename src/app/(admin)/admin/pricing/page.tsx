"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { BadgeDollarSign, CheckCircle2, ClipboardList } from "lucide-react";

const FIRST_TEN_DAY_COUNT = 10;
const DAY_11_TO_30_INCREMENT = 3;
const DAY_31_PLUS_INCREMENT = 2;

const defaultPrices = [12, 20, 28, 36, 44, 52, 60, 68, 76, 84];

const calculatePriceForDays = (
  days: number,
  firstTenDayPrices: number[],
): number => {
  if (days <= 0) {
    return 0;
  }

  if (days <= FIRST_TEN_DAY_COUNT) {
    return firstTenDayPrices[days - 1] ?? 0;
  }

  const dayTenPrice = firstTenDayPrices[FIRST_TEN_DAY_COUNT - 1] ?? 0;
  const daysFrom11To30 = Math.min(days, 30) - FIRST_TEN_DAY_COUNT;
  const daysFrom31Plus = Math.max(0, days - 30);

  return (
    dayTenPrice +
    daysFrom11To30 * DAY_11_TO_30_INCREMENT +
    daysFrom31Plus * DAY_31_PLUS_INCREMENT
  );
};

export default function PricingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstTenDayPrices, setFirstTenDayPrices] =
    useState<number[]>(defaultPrices);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.getPricing();
        const prices =
          res.data.firstTenDayPrices?.length === FIRST_TEN_DAY_COUNT
            ? res.data.firstTenDayPrices
            : defaultPrices;
        setFirstTenDayPrices(prices);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, []);

  const handlePriceChange = (index: number, value: number) => {
    setFirstTenDayPrices((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const res = await api.updatePricing({ firstTenDayPrices });
      setFirstTenDayPrices(res.data.firstTenDayPrices);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 rounded-2xl animate-pulse"
            style={{ background: "var(--border)" }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      <div>
        <h1
          className="text-xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          Daily Pricing Configuration
        </h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Set the total price for each of the first 10 days. Day 11 to 30 adds{" "}
          {formatPrice(DAY_11_TO_30_INCREMENT)} per extra day, and day 31 onward
          adds {formatPrice(DAY_31_PLUS_INCREMENT)} per extra day.
        </p>
      </div>

      {success && (
        <div className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
          <span>Pricing updated successfully.</span>
        </div>
      )}

      <div
        className="rounded-2xl border p-6"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100">
            <BadgeDollarSign className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--foreground)" }}
            >
              First 10 Days
            </h2>
            <p
              className="text-sm"
              style={{ color: "var(--muted-foreground)" }}
            >
              Enter the full booking price for each day.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {firstTenDayPrices.map((price, index) => (
            <label
              key={index}
              className="rounded-xl border p-3"
              style={{
                background: "var(--muted)",
                borderColor: "var(--border)",
              }}
            >
              <span
                className="mb-2 block text-sm font-medium"
                style={{ color: "var(--muted-foreground)" }}
              >
                Day {index + 1}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="text-lg font-bold"
                  style={{ color: "var(--primary)" }}
                >
                  £
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) =>
                    handlePriceChange(
                      index,
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  className="w-full rounded-lg border px-3 py-2 text-base font-semibold"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </label>
          ))}
        </div>

        <div
          className="mt-5 rounded-xl border p-4 text-sm"
          style={{
            background: "var(--muted)",
            borderColor: "var(--border)",
            color: "var(--muted-foreground)",
          }}
        >
          <p>Day 10 price: {formatPrice(firstTenDayPrices[9] ?? 0)}</p>
          <p>
            Day 11 price:{" "}
            {formatPrice(calculatePriceForDays(11, firstTenDayPrices))}
          </p>
          <p>
            Day 30 price:{" "}
            {formatPrice(calculatePriceForDays(30, firstTenDayPrices))}
          </p>
          <p>
            Day 31 price:{" "}
            {formatPrice(calculatePriceForDays(31, firstTenDayPrices))}
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl border p-6"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <ClipboardList className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--foreground)" }}
            >
              Pricing Preview
            </h2>
            <p
              className="text-sm"
              style={{ color: "var(--muted-foreground)" }}
            >
              Preview how the automatic daily increments continue after day 10.
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {[1, 2, 3, 5, 7, 10, 11, 15, 20, 30, 31, 40].map((days) => (
            <div
              key={days}
              className="flex items-center justify-between border-b py-2"
              style={{ borderColor: "var(--border)" }}
            >
              <span style={{ color: "var(--muted-foreground)" }}>
                {days} day{days !== 1 ? "s" : ""}
              </span>
              <span
                className="font-bold"
                style={{ color: "var(--foreground)" }}
              >
                {formatPrice(calculatePriceForDays(days, firstTenDayPrices))}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-xl py-3 text-base font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
        style={{
          background:
            "linear-gradient(135deg, var(--primary), var(--primary-light))",
        }}
      >
        {saving ? "Saving..." : "Save Pricing Configuration"}
      </button>
    </div>
  );
}
