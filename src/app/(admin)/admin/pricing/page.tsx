"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PricingConfig } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  CheckCircle2,
  BadgeDollarSign,
  Percent,
  ClipboardList,
} from "lucide-react";

export default function PricingPage() {
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pricePerHour, setPricePerHour] = useState(3);
  const [rules, setRules] = useState<{ minDays: number; percentage: number }[]>(
    [],
  );
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.getPricing();
        setConfig(res.data);
        setPricePerHour(res.data.pricePerHour);
        setRules(res.data.discountRules);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const res = await api.updatePricing({
        pricePerHour,
        discountRules: rules,
      });
      setConfig(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addRule = () => {
    setRules([...rules, { minDays: 1, percentage: 5 }]);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const updateRule = (
    index: number,
    field: "minDays" | "percentage",
    value: number,
  ) => {
    const newRules = [...rules];
    newRules[index][field] = value;
    setRules(newRules);
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
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1
          className="text-xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          Pricing Configuration
        </h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Set your hourly rate and discount tiers
        </p>
      </div>

      {success && (
        <div className="flex items-start gap-2 p-3 rounded-xl text-sm text-green-700 bg-green-50 border border-green-200">
          <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
          <span>Pricing updated successfully!</span>
        </div>
      )}

      {/* Price per hour */}
      <div
        className="rounded-2xl border p-6"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BadgeDollarSign className="w-5 h-5 text-yellow-600" />

          <h2
            className="text-lg font-bold"
            style={{ color: "var(--foreground)" }}
          >
            Hourly Rate
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <span
            className="text-3xl font-bold"
            style={{ color: "var(--primary)" }}
          >
            £
          </span>
          <input
            type="number"
            value={pricePerHour}
            onChange={(e) => setPricePerHour(parseFloat(e.target.value) || 0)}
            step="0.5"
            min="0"
            className="w-32 px-4 py-3 rounded-xl border text-2xl font-bold text-center"
            style={{
              background: "var(--muted)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          />
          <span
            className="text-lg"
            style={{ color: "var(--muted-foreground)" }}
          >
            per hour
          </span>
        </div>
        <div
          className="mt-3 text-sm"
          style={{ color: "var(--muted-foreground)" }}
        >
          = {formatPrice(pricePerHour * 24)} per day | ={" "}
          {formatPrice(pricePerHour * 24 * 7)} per week
        </div>
      </div>

      {/* Discount Tiers */}
      <div
        className="rounded-2xl border p-6"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-100">
              <Percent className="w-5 h-5 text-blue-600" />
            </div>

            <h2
              className="text-lg font-bold"
              style={{ color: "var(--foreground)" }}
            >
              Discount Tiers
            </h2>
          </div>
          <button
            onClick={addRule}
            className="px-4 py-1.5 rounded-lg text-sm font-medium text-white"
            style={{ background: "var(--primary)" }}
          >
            + Add Tier
          </button>
        </div>

        {rules.length === 0 ? (
          <p
            className="text-center py-6 text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            No discount tiers. Add one above.
          </p>
        ) : (
          <div className="space-y-3">
            {rules.map((rule, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "var(--muted)" }}
              >
                <span
                  className="text-sm whitespace-nowrap"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  If booking ≥
                </span>
                <input
                  type="number"
                  value={rule.minDays}
                  onChange={(e) =>
                    updateRule(i, "minDays", parseInt(e.target.value) || 0)
                  }
                  min="1"
                  className="w-20 px-3 py-2 rounded-lg border text-sm text-center font-bold"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
                <span
                  className="text-sm whitespace-nowrap"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  days → discount
                </span>
                <input
                  type="number"
                  value={rule.percentage}
                  onChange={(e) =>
                    updateRule(i, "percentage", parseInt(e.target.value) || 0)
                  }
                  min="0"
                  max="100"
                  className="w-20 px-3 py-2 rounded-lg border text-sm text-center font-bold"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
                <span
                  className="text-sm"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  %
                </span>
                <button
                  onClick={() => removeRule(i)}
                  className="text-red-500 hover:text-red-700 text-lg ml-auto"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview */}
      <div
        className="rounded-2xl border p-6"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-100">
            <ClipboardList className="w-5 h-5 text-blue-600" />
          </div>

          <h2
            className="text-lg font-bold"
            style={{ color: "var(--foreground)" }}
          >
            Pricing Preview
          </h2>
        </div>
        <div className="space-y-2 text-sm">
          {[1, 3, 5, 7, 10, 14, 15, 21].map((days) => {
            const hours = days * 24;
            const base = hours * pricePerHour;
            const matchedRule = [...rules]
              .sort((a, b) => b.minDays - a.minDays)
              .find((r) => days >= r.minDays);
            const discount = matchedRule?.percentage || 0;
            const final = base * (1 - discount / 100);
            return (
              <div
                key={days}
                className="flex justify-between py-1.5 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <span style={{ color: "var(--muted-foreground)" }}>
                  {days} day{days !== 1 ? "s" : ""}
                </span>
                <div className="text-right">
                  {discount > 0 && (
                    <span className="text-xs text-green-600 mr-2">
                      -{discount}%
                    </span>
                  )}
                  <span
                    className="font-bold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {formatPrice(Math.round(final * 100) / 100)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 rounded-xl text-white font-bold text-base transition-all hover:opacity-90 disabled:opacity-50"
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
