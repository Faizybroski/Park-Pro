"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { PriceCalculation } from "@/types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Car, User, Plane } from "lucide-react";

const flightRegex = /^[A-Z]{2}\d{1,4}$/; // e.g. BA123
const terminalRegex = /^T\d{1,2}$/i; // e.g. T1, T2
const carNumberRegex = /^[A-Z0-9- ]{5,12}$/i;

const schema = z
  .object({
    userName: z.string().min(2),
    userEmail: z.string().email(),
    userPhone: z.string().min(8),

    carMake: z.string().min(1),
    carModel: z.string().min(1),
    carNumber: z.string().regex(carNumberRegex),
    carColor: z.string().min(1),

    bookedStartTime: z.string(),
    bookedEndTime: z.string(),

    departureTerminal: z.string().optional(),
    departureFlightNo: z.string().optional(),
    arrivalTerminal: z.string().optional(),
    arrivalFlightNo: z.string().optional(),
  })
  .refine((d) => new Date(d.bookedEndTime) > new Date(d.bookedStartTime), {
    message: "End must be after start",
    path: ["bookedEndTime"],
  })
  .refine(
    (d) => !d.departureTerminal || terminalRegex.test(d.departureTerminal),
    {
      message: "Invalid terminal (T1)",
      path: ["departureTerminal"],
    },
  )
  .refine((d) => !d.arrivalTerminal || terminalRegex.test(d.arrivalTerminal), {
    message: "Invalid terminal (T2)",
    path: ["arrivalTerminal"],
  })
  .refine(
    (d) => !d.departureFlightNo || flightRegex.test(d.departureFlightNo),
    {
      message: "Invalid flight (BA123)",
      path: ["departureFlightNo"],
    },
  )
  .refine((d) => !d.arrivalFlightNo || flightRegex.test(d.arrivalFlightNo), {
    message: "Invalid flight (BA456)",
    path: ["arrivalFlightNo"],
  });

type FormData = z.infer<typeof schema>;

function BookingFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pricePreview, setPricePreview] = useState<PriceCalculation | null>(
    null,
  );
  // const [priceLoading, setPriceLoading] = useState(false);

  // const [form, setForm] = useState({
  //   userName: '',
  //   userEmail: '',
  //   userPhone: '',
  //   carMake: '',
  //   carModel: '',
  //   carNumber: '',
  //   carColor: '',
  //   bookedStartTime: searchParams.get('start') || '',
  //   bookedEndTime: searchParams.get('end') || '',
  //   departureTerminal: '',
  //   departureFlightNo: '',
  //   arrivalTerminal: '',
  //   arrivalFlightNo: '',
  // });
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bookedStartTime: searchParams.get("start") || "",
      bookedEndTime: searchParams.get("end") || "",
    },
  });

  const start = form.watch("bookedStartTime");
  const end = form.watch("bookedEndTime");

  // const updateField = (field: string, value: string) => {
  //   setForm((prev) => ({ ...prev, [field]: value }));
  // };

  // Fetch price preview when dates change
  // useEffect(() => {
  //   const fetchPrice = async () => {
  //     if (!form.bookedStartTime || !form.bookedEndTime) return;
  //     const start = new Date(form.bookedStartTime);
  //     const end = new Date(form.bookedEndTime);
  //     if (end <= start) return;

  //     setPriceLoading(true);
  //     try {
  //       const res = await api.calculatePrice(start.toISOString(), end.toISOString());
  //       setPricePreview(res.data);
  //     } catch {
  //       setPricePreview(null);
  //     } finally {
  //       setPriceLoading(false);
  //     }
  //   };
  //   fetchPrice();
  // }, [form.bookedStartTime, form.bookedEndTime]);

  // ----------------------
  // PRICE QUERY
  // ----------------------

  const { data: price, isLoading: priceLoading } = useQuery({
    queryKey: ["price", start, end],
    queryFn: () => api.calculatePrice(start, end),
    enabled: !!start && !!end && new Date(end) > new Date(start),
  });

  // ----------------------
  // SUBMIT
  // ----------------------

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      return api.createBooking({
        ...data,
        bookedStartTime: new Date(data.bookedStartTime).toISOString(),
        bookedEndTime: new Date(data.bookedEndTime).toISOString(),
      });
    },
    onSuccess: (res: any) => {
      sessionStorage.setItem("lastBooking", JSON.stringify(res.data));
      router.push("/book/confirmation");
    },
  });

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');

  //   try {
  //     const payload = {
  //       ...form,
  //       bookedStartTime: new Date(form.bookedStartTime).toISOString(),
  //       bookedEndTime: new Date(form.bookedEndTime).toISOString(),
  //     };
  //     const res = await api.createBooking(payload);
  //     // Store booking data for confirmation page
  //     sessionStorage.setItem('lastBooking', JSON.stringify(res.data));
  //     router.push('/book/confirmation');
  //   } catch (err: unknown) {
  //     setError(err instanceof Error ? err.message : 'Failed to create booking');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen py-8 bg-muted">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Book Your Parking
          </h1>
          <p className="text-muted-foreground">
            Fill in the details below to reserve your space
          </p>
        </div>

        {/* <form onSubmit={handleSubmit} className="space-y-6"> */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
            className="space-y-6"
          >
            {error && (
              <div className="p-4 rounded-xl text-red-800 bg-red-50 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                {error}
              </div>
            )}

            {/* Dates */}
            <div
              className="rounded-2xl border p-6"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ color: "var(--foreground)" }}
              >
                📅 Parking Dates
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--foreground)" }}
                  >
                    Drop-off Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={form.bookedStartTime}
                    onChange={(e) =>
                      updateField("bookedStartTime", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--muted)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--foreground)" }}
                  >
                    Pick-up Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={form.bookedEndTime}
                    onChange={(e) =>
                      updateField("bookedEndTime", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--muted)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                    required
                  />
                </div>
              </div>
              {/* Price preview */}
              {pricePreview && (
                <div
                  className="mt-4 p-4 rounded-xl"
                  style={{ background: "var(--muted)" }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p
                        className="text-sm"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {pricePreview.totalDays.toFixed(1)} days (
                        {pricePreview.totalHours.toFixed(0)} hours) @{" "}
                        {formatPrice(pricePreview.pricePerHour)}/hr
                      </p>
                      {pricePreview.discountPercent > 0 && (
                        <p className="text-xs text-green-600 font-medium mt-1">
                          🎉 {pricePreview.discountPercent}% discount applied!
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {pricePreview.discountPercent > 0 && (
                        <p
                          className="text-sm line-through"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          {formatPrice(pricePreview.basePrice)}
                        </p>
                      )}
                      <p
                        className="text-2xl font-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        {priceLoading
                          ? "..."
                          : formatPrice(pricePreview.finalPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Personal Details */}
            <div
              className="rounded-2xl border p-6"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ color: "var(--foreground)" }}
              >
                👤 Personal Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--foreground)" }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={form.userName}
                    onChange={(e) => updateField("userName", e.target.value)}
                    placeholder="John Smith"
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--muted)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--foreground)" }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={form.userEmail}
                    onChange={(e) => updateField("userEmail", e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--muted)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--foreground)" }}
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={form.userPhone}
                    onChange={(e) => updateField("userPhone", e.target.value)}
                    placeholder="+44 7700 900000"
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--muted)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Car Details */}
            <div
              className="rounded-2xl border p-6"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ color: "var(--foreground)" }}
              >
                🚗 Vehicle Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--foreground)" }}
                  >
                    Car Make *
                  </label>
                  <input
                    type="text"
                    value={form.carMake}
                    onChange={(e) => updateField("carMake", e.target.value)}
                    placeholder="e.g. Toyota"
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--muted)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--foreground)" }}
                  >
                    Car Model *
                  </label>
                  <input
                    type="text"
                    value={form.carModel}
                    onChange={(e) => updateField("carModel", e.target.value)}
                    placeholder="e.g. Corolla"
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--muted)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--foreground)" }}
                  >
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    value={form.carNumber}
                    onChange={(e) => updateField("carNumber", e.target.value)}
                    placeholder="e.g. AB12 CDE"
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 uppercase"
                    style={{
                      background: "var(--muted)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--foreground)" }}
                  >
                    Car Colour *
                  </label>
                  <input
                    type="text"
                    value={form.carColor}
                    onChange={(e) => updateField("carColor", e.target.value)}
                    placeholder="e.g. Silver"
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--muted)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Flight Details (Optional) */}
            <div
              className="rounded-2xl border p-6"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <h2
                className="text-lg font-bold mb-1"
                style={{ color: "var(--foreground)" }}
              >
                ✈️ Flight Details
              </h2>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--muted-foreground)" }}
              >
                Optional — helps us coordinate your parking
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--foreground)" }}
                  >
                    Departure Terminal
                  </label>
                  <input
                    type="text"
                    value={form.departureTerminal}
                    onChange={(e) =>
                      updateField("departureTerminal", e.target.value)
                    }
                    placeholder="e.g. T2"
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--muted)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--foreground)" }}
                  >
                    Departure Flight No
                  </label>
                  <input
                    type="text"
                    value={form.departureFlightNo}
                    onChange={(e) =>
                      updateField("departureFlightNo", e.target.value)
                    }
                    placeholder="e.g. BA123"
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--muted)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--foreground)" }}
                  >
                    Arrival Terminal
                  </label>
                  <input
                    type="text"
                    value={form.arrivalTerminal}
                    onChange={(e) =>
                      updateField("arrivalTerminal", e.target.value)
                    }
                    placeholder="e.g. T5"
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--muted)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--foreground)" }}
                  >
                    Arrival Flight No
                  </label>
                  <input
                    type="text"
                    value={form.arrivalFlightNo}
                    onChange={(e) =>
                      updateField("arrivalFlightNo", e.target.value)
                    }
                    placeholder="e.g. BA456"
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--muted)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  Confirm Booking{" "}
                  {pricePreview
                    ? `— ${formatPrice(pricePreview.finalPrice)}`
                    : ""}
                </>
              )}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <BookingFormContent />
    </Suspense>
  );
}
