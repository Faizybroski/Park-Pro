"use client";

import { Suspense, useEffect, useState } from "react";
import { PriceCalculation } from "@/types";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { formatDayCount, formatPrice } from "@/lib/utils";
import { DateTimePicker } from "@/components/ui/DatePicker";
import {TerminalSelect} from "@/components/ui/TerminalPicker"
import PageHero from "@/components/shared/PageHero";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarClock,
  User,
  Mail,
  Phone,
  Car,
  Hash,
  Palette,
  PlaneTakeoff,
  PlaneLanding,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Tag,
  Ban,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── regex patterns ───────────────────────────────────────────────
const FLIGHT_REGEX = /^[A-Z]{2,3}\d{1,4}[A-Z]?$/i; // BA123, EK2045, UA1234A
const TERMINAL_REGEX = /^T\d{1,2}$/i; // T1 … T12
const CAR_NUMBER_REGEX = /^[A-Z0-9][A-Z0-9 -]{3,10}[A-Z0-9]$/i; // AB12 CDE
const PHONE_REGEX = /^\+?[\d\s()-]{8,18}$/; // +44 7700 900000

// ─── zod schema ───────────────────────────────────────────────────
const bookingSchema = z
  .object({
    userName: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be under 100 characters"),

    userEmail: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),

    userPhone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(PHONE_REGEX, "Enter a valid phone number (e.g. +44 7700 900000)"),

    carMake: z
      .string()
      .trim()
      .min(1, "Car make is required")
      .max(50, "Car make is too long"),

    carModel: z
      .string()
      .trim()
      .min(1, "Car model is required")
      .max(50, "Car model is too long"),

    carNumber: z
      .string()
      .trim()
      .min(1, "Registration number is required")
      .regex(CAR_NUMBER_REGEX, "Enter a valid registration (e.g. AB12 CDE)"),

    carColor: z
      .string()
      .trim()
      .min(1, "Car colour is required")
      .max(30, "Colour is too long"),

    bookedStartTime: z
      .string()
      .min(1, "Drop-off date & time is required")
      .refine(
        (v) => new Date(v) > new Date(),
        "Drop-off must be in the future",
      ),

    bookedEndTime: z.string().min(1, "Pick-up date & time is required"),

    departureTerminal: z
      .string()
      .trim()
      .optional()
      .refine(
        (v) => !v || TERMINAL_REGEX.test(v),
        "Invalid terminal (e.g. T1, T2)",
      ),

    departureFlightNo: z
      .string()
      .trim()
      .optional()
      .refine(
        (v) => !v || FLIGHT_REGEX.test(v),
        "Invalid flight number (e.g. BA123)",
      ),

    arrivalTerminal: z
      .string()
      .trim()
      .optional()
      .refine(
        (v) => !v || TERMINAL_REGEX.test(v),
        "Invalid terminal (e.g. T1, T5)",
      ),

    arrivalFlightNo: z
      .string()
      .trim()
      .optional()
      .refine(
        (v) => !v || FLIGHT_REGEX.test(v),
        "Invalid flight number (e.g. BA456)",
      ),
  })
  .refine(
    (d) => {
      if (!d.bookedStartTime || !d.bookedEndTime) return true;
      return new Date(d.bookedEndTime) > new Date(d.bookedStartTime);
    },
    {
      message: "Pick-up must be after drop-off",
      path: ["bookedEndTime"],
    },
  )
  .refine(
    (d) => {
      if (!d.bookedStartTime || !d.bookedEndTime) return true;
      const diff =
        new Date(d.bookedEndTime).getTime() -
        new Date(d.bookedStartTime).getTime();
      return diff >= 60 * 60 * 1000; // minimum 1 hour
    },
    {
      message:
        "Booking must be at least 1 hour. Partial days are charged as full days.",
      path: ["bookedEndTime"],
    },
  );

type BookingFormValues = z.infer<typeof bookingSchema>;

// ─── main form component ─────────────────────────────────────────
function BookingFormContent() {
  const searchParams = useSearchParams();

  const [pricePreview, setPricePreview] = useState<PriceCalculation | null>(
    null,
  );
  const [priceLoading, setPriceLoading] = useState(false);
  const [bookingEnabled, setBookingEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    api
      .getBookingStatus()
      .then((res) => setBookingEnabled(res.data.bookingEnabled))
      .catch(() => setBookingEnabled(true)); // fail open
  }, []);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      userName: "",
      userEmail: "",
      userPhone: "",
      carMake: "",
      carModel: "",
      carNumber: "",
      carColor: "",
      bookedStartTime: searchParams.get("start") || "",
      bookedEndTime: searchParams.get("end") || "",
      departureTerminal: "",
      departureFlightNo: "",
      arrivalTerminal: "",
      arrivalFlightNo: "",
    },
    mode: "onBlur",
  });

  const startTime = form.watch("bookedStartTime");
  const endTime = form.watch("bookedEndTime");

  // ── price preview ──────────────────────────────────────────────
  // const hasDates =
  //   !!startTime && !!endTime && new Date(endTime) > new Date(startTime);

  // const { data: priceData, isFetching: priceLoading } = useQuery({
  //   queryKey: ["price", startTime, endTime],
  //   queryFn: () =>
  //     api.calculatePrice(
  //       new Date(startTime).toISOString(),
  //       new Date(endTime).toISOString(),
  //     ),
  //   enabled: hasDates,
  //   staleTime: 30_000,
  // });

  // const price = priceData?.data;
  useEffect(() => {
    const fetchPrice = async () => {
      if (!startTime || !endTime) return;
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (end <= start) return;

      setPriceLoading(true);
      try {
        const res = await api.calculatePrice(
          start.toISOString(),
          end.toISOString(),
        );
        setPricePreview(res.data);
      } catch {
        setPricePreview(null);
      } finally {
        setPriceLoading(false);
      }
    };
    fetchPrice();
  }, [startTime, endTime]);

  // ── submit mutation ────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: (data: BookingFormValues) =>
      api.createCheckoutSession({
        ...data,
        bookedStartTime: new Date(data.bookedStartTime).toISOString(),
        bookedEndTime: new Date(data.bookedEndTime).toISOString(),
      }),
    onSuccess: (res) => {
      // Redirect to Stripe hosted checkout page
      window.location.href = res.data.checkoutUrl;
    },
  });

  const onSubmit = (data: BookingFormValues) => mutation.mutate(data);

  // Booking disabled full-page block
  if (bookingEnabled === false) {
    return (
      <div className="min-h-screen py-20 bg-muted/40 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-5">
            <Ban className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Bookings Temporarily Unavailable
          </h1>
          <p className="text-muted-foreground mb-6">
            We are not accepting new parking reservations at the moment. Please
            check back soon or contact us for assistance.
          </p>
          <Button asChild variant="outline">
            <a href="/contact">Contact Us</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHero
        title="Book Your Parking"
        subtitle="Fill in the details below to reserve your airport parking space"
      />
      <div className="min-h-screen py-10 bg-muted/40">
        <div className="max-w-3xl mx-auto px-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              {/* ── mutation error ────────────────────────────── */}
              {mutation.isError && (
                <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>
                    {mutation.error instanceof Error
                      ? mutation.error.message
                      : "Something went wrong. Please try again."}
                  </span>
                </div>
              )}

              {/* ═══════════════════════════════════════════════ */}
              {/*  DATES SECTION                                 */}
              {/* ═══════════════════════════════════════════════ */}
              <Card className="rounded-2xl p-6 lg:p-8 bg-card text-card-foreground border border-primary ring-0">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold mb-4 ">
                    <CalendarClock className="h-6 w-6 text-primary" />
                    Parking Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-5 p-0">
                  {/* Drop-off */}
                  <FormField
                    control={form.control}
                    name="bookedStartTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Drop-off Date & Time
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <DateTimePicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                          {/* <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="datetime-local"
                            className="pl-9"
                            {...field}
                          />
                        </div> */}
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Pick-up */}
                  <FormField
                    control={form.control}
                    name="bookedEndTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Pick-up Date & Time
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <DateTimePicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                          {/* <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="datetime-local"
                            className="pl-9"
                            {...field}
                          />
                        </div> */}
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Price preview */}
                  {pricePreview && (
                    <div className="mt-4 p-4 rounded-xl border border-primary-light/10 bg-input sm:col-span-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-primary">
                            {formatDayCount(pricePreview.totalDays)} charged for
                            your selected dates
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Calculated automatically using the current day-based
                            pricing schedule.
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            {priceLoading
                              ? "..."
                              : formatPrice(pricePreview.finalPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* {hasDates && (
                  <div className="sm:col-span-2 rounded-lg border bg-muted/60 p-4">
                    {priceLoading ? (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Calculating price…
                      </div>
                    ) : price ? (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDuration(price.totalHours)} (
                            {price.totalHours?.toFixed(0)} hours) &nbsp;@{" "}
                            {formatPrice(price.pricePerHour)}/hr
                          </p>
                          {price.discountPercent > 0 && (
                            <p className="flex items-center gap-1.5 text-green-600 font-medium">
                              <Percent className="h-3.5 w-3.5" />
                              {price.discountPercent}% discount applied!
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {price.discountPercent > 0 && (
                            <p className="text-sm line-through text-muted-foreground">
                              {formatPrice(price.basePrice)}
                            </p>
                          )}
                          <p className="text-2xl font-bold text-primary">
                            {formatPrice(price.finalPrice)}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )} */}
                </CardContent>
              </Card>

              {/* ═══════════════════════════════════════════════ */}
              {/*  PERSONAL DETAILS SECTION                      */}
              {/* ═══════════════════════════════════════════════ */}
              <Card className="rounded-2xl p-6 lg:p-8 bg-card text-card-foreground border border-primary ring-0">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold mb-4">
                    <User className="h-6 w-6 text-primary" />
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-5 p-0">
                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Full Name<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input
                              placeholder="John Smith"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="userEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email Address<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="userPhone"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>
                          Phone Number<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input
                              type="tel"
                              placeholder="+44 7700 900000"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* ═══════════════════════════════════════════════ */}
              {/*  VEHICLE DETAILS SECTION                       */}
              {/* ═══════════════════════════════════════════════ */}
              <Card className="rounded-2xl p-6 lg:p-8 bg-card text-card-foreground border border-primary ring-0">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold mb-4">
                    <Car className="h-6 w-6 text-primary" />
                    Vehicle Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-5 p-0">
                  {/* Car Make */}
                  <FormField
                    control={form.control}
                    name="carMake"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Car Make<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input
                              placeholder="e.g. Toyota"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Car Model */}
                  <FormField
                    control={form.control}
                    name="carModel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Car Model<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input
                              placeholder="e.g. Corolla"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Registration Number */}
                  <FormField
                    control={form.control}
                    name="carNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Registration Number
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input
                              placeholder="e.g. AB12 CDE"
                              className="pl-9 uppercase"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Car Colour */}
                  <FormField
                    control={form.control}
                    name="carColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Car Color<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Palette className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input
                              placeholder="e.g. Silver"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* ═══════════════════════════════════════════════ */}
              {/*  FLIGHT DETAILS SECTION (OPTIONAL)             */}
              {/* ═══════════════════════════════════════════════ */}
              <Card className="rounded-2xl p-6 lg:p-8 bg-card text-card-foreground border border-primary ring-0">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold mb-4">
                    <PlaneTakeoff className="h-6 w-6 text-primary" />
                    Flight Details
                  </CardTitle>
                  <CardDescription>
                    Optional — helps us coordinate your parking
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-5 p-0">
                  {/* Departure Terminal */}
                  <FormField
                    control={form.control}
                    name="departureTerminal"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Departure Terminal</FormLabel>
                        <FormControl>
                           <TerminalSelect
                                    value={field.value}
                                    onChange={field.onChange}
                                  />
                          {/* <div className="relative">
                          <PlaneTakeoff className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary pointer-events-none z-10" />
                          <select
                            className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm appearance-none"
                            {...field}
                          >
                            <option value="">— Not selected —</option>
                            <option value="T1">T1</option>
                            <option value="T2">T2</option>
                            <option value="T3">T3</option>
                            <option value="T4">T4</option>
                            <option value="T5">T5</option>
                          </select>
                        </div> */}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Arrival Terminal */}
                  <FormField
                    control={form.control}
                    name="arrivalTerminal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arrival Terminal</FormLabel>
                        <FormControl>
                           <TerminalSelect
          value={field.value}
          onChange={field.onChange}
        />
                          {/* <div className="relative">
                          <PlaneLanding className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary pointer-events-none z-10" />
                          <select
                            className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm appearance-none"
                            {...field}
                          >
                            <option value="">— Not selected —</option>
                            <option value="T1">T1</option>
                            <option value="T2">T2</option>
                            <option value="T3">T3</option>
                            <option value="T4">T4</option>
                            <option value="T5">T5</option>
                          </select>
                        </div> */}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Arrival Flight No */}
                  <FormField
                    control={form.control}
                    name="arrivalFlightNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arrival Flight No.</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <PlaneLanding className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input
                              placeholder="e.g. BA456"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* ── submit button ────────────────────────────── */}
              <Button
                type="submit"
                className="w-full text-base font-semibold rounded-2xl"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Redirecting to payment…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Pay Now
                    {pricePreview
                      ? ` — ${formatPrice(pricePreview.finalPrice)}`
                      : ""}
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

// ─── page wrapper with suspense ───────────────────────────────────
export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <BookingFormContent />
    </Suspense>
  );
}
