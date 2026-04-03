"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShieldCheck,
  BadgeDollarSign,
  Zap,
  Plane,
  Car,
  Clock,
  Star,
  ChevronDown,
  CheckCircle2,
  CalendarDays,
  ClipboardCheck,
  PlaneTakeoff,
  Building2,
  Search,
  Users,
  MapPin,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/ui/DatePicker";
import { api } from "@/lib/api";
import type React from "react";

// ─── Data ──────────────────────────────────────────────────────────────────────

const steps = [
  {
    icon: CalendarDays,
    num: "01",
    title: "Enter Dates",
    desc: "Pick your drop-off and pick-up dates and times",
  },
  {
    icon: ClipboardCheck,
    num: "02",
    title: "Fill Details",
    desc: "Enter your car and contact information",
  },
  {
    icon: CheckCircle2,
    num: "03",
    title: "Get Confirmed",
    desc: "Receive instant confirmation with your slot number",
  },
  {
    icon: PlaneTakeoff,
    num: "04",
    title: "Park & Fly",
    desc: "Drop off your car and head to the terminal",
  },
];

const parkingOptions = [
  {
    title: "Short Stay",
    desc: "Perfect for quick drop-offs",
    gradient: "from-sky-500 to-blue-700",
    icon: Clock,
  },
  {
    title: "Long Stay",
    desc: "Best value for longer trips",
    gradient: "from-emerald-500 to-teal-700",
    icon: CalendarDays,
  },
  {
    title: "Meet & Greet",
    desc: "Door-to-terminal valet service",
    gradient: "from-violet-500 to-purple-700",
    icon: Users,
  },
  {
    title: "Business Class",
    desc: "Premium parking experience",
    gradient: "from-orange-400 to-primary",
    icon: Building2,
  },
];

const services = [
  {
    icon: Car,
    title: "Meet & Greet",
    desc: "Our team meets you at the terminal, takes your keys, and parks your car while you check in stress-free.",
    color: "text-primary",
    bg: "bg-orange-100",
  },
  {
    icon: Plane,
    title: "Park & Ride",
    desc: "Drive to our secure facility, jump on our complimentary shuttle, and arrive at the terminal in minutes.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Building2,
    title: "On-Airport Parking",
    desc: "Stay close to the action with on-site parking — walk directly to departures without any wait.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const deals = [
  {
    location: "Heathrow Airport",
    duration: "7 days",
    price: "£35.00",
    popular: true,
  },
  {
    location: "Gatwick Airport",
    duration: "7 days",
    price: "£28.00",
    popular: false,
  },
  {
    location: "Stansted Airport",
    duration: "7 days",
    price: "£24.00",
    popular: false,
  },
  {
    location: "Manchester Airport",
    duration: "7 days",
    price: "£21.00",
    popular: false,
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Frequent Flyer",
    text: "Absolutely brilliant service! Booked within a minute and my car was safe the entire trip. Will definitely use again.",
    stars: 5,
    initials: "SM",
    color: "bg-blue-500",
  },
  {
    name: "James R.",
    role: "Business Traveller",
    text: "Best airport parking I've ever used. The price was unbeatable and the whole process was seamless.",
    stars: 5,
    initials: "JR",
    color: "bg-purple-500",
  },
  {
    name: "Emily K.",
    role: "Family Traveller",
    text: "Used ParkPro for our family holiday. Easy booking, great price, and peace of mind knowing our car was secure.",
    stars: 5,
    initials: "EK",
    color: "bg-emerald-500",
  },
];

const faqs = [
  {
    q: "How do I book a parking space?",
    a: "Simply enter your drop-off and pick-up dates, fill in your vehicle and contact details, and confirm your booking. You'll receive an instant confirmation with a unique tracking number.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account needed! Just book and go. You'll receive a tracking number to manage your booking anytime.",
  },
  {
    q: "How is the price calculated?",
    a: "Pricing is based on an hourly rate with automatic multi-day discounts: 5+ days (10% off), 10+ days (20% off), and 15+ days (30% off). No hidden fees.",
  },
  {
    q: "Can I cancel or modify my booking?",
    a: "Please contact our support team with your tracking number and we'll be happy to assist with any changes or cancellations.",
  },
  {
    q: "Is the car park secure?",
    a: "Absolutely. Our facility has 24/7 CCTV surveillance, security patrols, and controlled access. Your vehicle is in safe hands.",
  },
];

// ─── Page Component ────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pricePerHour, setPricePerHour] = useState(3);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleQuickBook = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      router.push(`/book?start=${startDate}&end=${endDate}`);
    } else {
      router.push("/book");
    }
  };

  useEffect(() => {
    api
      .getPricePerHour()
      .then((res) => setPricePerHour(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      {/* <section className="bg-image[url(/container.png)] relative overflow-hidden"> */}
      <section className="bg-[url('/Container.png')] bg-cover bg-center relative overflow-hidden pt-10 lg:pt-0">
        {/* Diagonal orange accent strips */}
        <Image
          src="/hero_strips.svg"
          alt=""
          width={1440}
          height={900}
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover hidden md:block"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: headline + trust badges */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 bg-primary/10 text-primary border border-primary/20">
                <Plane className="w-3.5 h-3.5" />
                Trusted by 50,000+ travellers
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-5 text-foreground">
                Park Smarter.{" "}
                <span className="text-primary">Travel Stress‑Free.</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Book your guaranteed airport parking space in under 60 seconds.
                No account needed. Competitive prices with multi-day discounts.
              </p>

              {/* Mini trust badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { icon: ShieldCheck, label: "24/7 Security" },
                  { icon: BadgeDollarSign, label: "Best Prices" },
                  { icon: Zap, label: "Instant Booking" },
                  { icon: MapPin, label: "Guaranteed Space" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted rounded-full px-3 py-1.5 border border-border"
                  >
                    <Icon className="w-3.5 h-3.5 text-primary" />
                    {label}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  className="px-8 py-3  font-bold text-base w-full md:w-auto"
                >
                  <Link href="/book">Book Now →</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="px-8 py-3 rounded-full font-semibold text-base w-full md:w-auto"
                >
                  <Link href="/track">Track Booking</Link>
                </Button>
              </div>
            </div>

            {/* Right: orange booking widget */}
            <div className="animate-fade-in hidden md:block">
              <Card className="shadow-none rounded-2xl p-6 lg:p-8 bg-card text-card-foreground border border-primary">
                <CardHeader className="p-0  text-primary">
                  <CardTitle className="text-xl font-bold mb-1">
                    Quick Price Check
                  </CardTitle>
                  <CardDescription className="text-sm mb-4  text-primary">
                    Enter your dates to see pricing
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                  <form onSubmit={handleQuickBook} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Drop-off Date & Time</Label>
                      {/* <Input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      /> */}
                      <DateTimePicker
                        value={startDate}
                        onChange={setStartDate}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Pick-up Date & Time</Label>
                      {/* <Input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      /> */}
                      <DateTimePicker value={endDate} onChange={setEndDate} />
                    </div>

                    <Button className="w-full rounded-full">
                      Check Price & Book
                    </Button>
                  </form>

                  <p className="text-xs text-muted-foreground text-center mt-3">
                    From £{pricePerHour}/hour • No hidden fees
                  </p>
                </CardContent>
              </Card>
            </div>
            {/* <div className="animate-fade-in">
              <div className="bg-primary rounded-2xl p-7 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-1">
                  Your Parking
                </h2>
                <p className="text-sm text-white/75 mb-6">
                  Get an instant price estimate
                </p>

                <form onSubmit={handleQuickBook} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-1.5">
                      Drop-off Date & Time
                    </label>
                    <DateTimePicker value={startDate} onChange={setStartDate} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-1.5">
                      Pick-up Date & Time
                    </label>
                    <DateTimePicker value={endDate} onChange={setEndDate} />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white text-primary font-bold py-3.5 rounded-xl text-base transition-all duration-200 hover:bg-orange-50 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Check Price & Book →
                  </button>
                </form>

                <p className="text-center text-xs text-white/60 mt-4">
                  From £{pricePerHour}/hour · No hidden fees · Instant
                  confirmation
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* <div className="bg-[url('/full.svg')] bg-cover"> */}
      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden bg-primary-light/10 md:bg-transparent md:bg-[url('/left.svg')] bg-no-repeat bg-cover ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-foreground">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Book your secure parking space in four simple steps
            </p>
          </div>

          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="relative bg-background rounded-2xl p-6 shadow-sm border border-border text-center hover:shadow-md hover:border-primary/30 transition-all duration-300"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-6 h-0.5 bg-primary/30 z-10" />
                  )}

                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-xs font-extrabold text-primary mb-2 tracking-wider">
                    {step.num}
                  </div>
                  <h3 className="text-base font-bold mb-1.5 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              );
            })}
          </div> */}
          <div className="relative">
            {/* Line */}
            {/* <div className="hidden lg:block absolute top-10 left-0 right-0 h-[2px] bg-border z-0" /> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {/* STEP 1 */}
              <div className="text-center relative">
                {/* Connector (RIGHT SIDE ONLY) */}
                <div className="hidden lg:block absolute top-10 left-1/2 right-[-50%] h-[2px] bg-primary z-0" />

                {/* Icon */}
                <div className="relative inline-flex justify-center mb-6 z-10">
                  <span className="absolute -top-2 -right-2 bg-foreground text-background text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                    01
                  </span>

                  <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                      <CalendarDays className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2">Enter Dates</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Pick your drop-off and pick-up dates and times
                </p>
              </div>

              {/* STEP 2 */}
              <div className="text-center relative">
                <div className="hidden lg:block absolute top-10 left-1/2 right-[-50%] h-[2px] bg-primary z-0" />

                <div className="relative inline-flex justify-center mb-6 z-10">
                  <span className="absolute -top-2 -right-2 bg-foreground text-background text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                    02
                  </span>
                  <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                      <ClipboardCheck className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Fill Details
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Enter your car and contact information
                </p>
              </div>

              {/* STEP 3 */}
              <div className="text-center relative">
                <div className="hidden lg:block absolute top-10 left-1/2 right-[-50%] h-[2px] bg-primary z-0" />

                <div className="relative inline-flex justify-center mb-6 z-10">
                  <span className="absolute -top-2 -right-2 bg-foreground text-background text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                    03
                  </span>
                  <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Get Confirmed
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Receive instant confirmation with your slot number
                </p>
              </div>

              {/* STEP 4 */}
              <div className="text-center relative">
                <div className="relative inline-flex justify-center mb-6">
                  <span className="absolute -top-2 -right-2 bg-foreground text-background text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                    04
                  </span>
                  <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                      <PlaneTakeoff className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Park & Fly
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Drop off your car and head to the terminal
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PARKING OPTIONS
      ══════════════════════════════════════════════════════ */}
      {/* <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-foreground">
              Parking Options to Suit Every Trip
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choose from a range of parking solutions tailored to your travel
              needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {parkingOptions.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <Link
                  key={i}
                  href="/book"
                  className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`h-52 bg-linear-to-br ${opt.gradient} flex items-center justify-center`}
                  >
                    <Icon className="w-16 h-16 text-white/70 group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  <div className="absolute inset-0 bg-linear-to-t from-black/65 via-transparent to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-lg">{opt.title}</h3>
                    <p className="text-sm opacity-80">{opt.desc}</p>
                  </div>

                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Book →
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* ══════════════════════════════════════════════════════
          OUR PARKING SERVICES
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 md:bg-[url('/right.svg')] relative overflow-hidden bg-no-repeat bg-cover">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-foreground">
              Our Parking Services
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We offer a range of services to make your airport experience
              seamless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="group bg-background rounded-2xl p-7 shadow-sm border border-border hover:shadow-md hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center  group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-7 h-7 ${s.color}`} />
                    </div>
                    <h3 className="text-lg font-bold  text-foreground">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {s.desc}
                  </p>
                  <Link
                    href="/book"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all"
                  >
                    Book now →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          COMPARE LIVE PARKING DEALS
      ══════════════════════════════════════════════════════ */}
      {/* <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-foreground">
              Compare Live Parking Deals
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Transparent pricing with no hidden fees
            </p>
          </div>

          <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-primary/5 border-b border-border px-6 py-3">
              <span className="text-sm font-semibold text-muted-foreground">
                Location
              </span>
              <span className="text-sm font-semibold text-muted-foreground text-center">
                Est. Price
              </span>
              <span className="text-sm font-semibold text-muted-foreground text-right">
                Action
              </span>
            </div>

            {deals.map((deal, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 items-center px-6 py-4 border-b border-border last:border-0 hover:bg-orange-50/40 transition-colors ${
                  deal.popular ? "bg-orange-50/30" : "bg-background"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground text-sm">
                      {deal.location}
                    </p>
                    {deal.popular && (
                      <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {deal.duration}
                  </p>
                </div>
                <p className="text-center text-lg font-bold text-primary">
                  {deal.price}
                </p>
                <div className="flex justify-end">
                  <Link
                    href="/book"
                    className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            * Prices shown for illustrative purposes. Actual price is calculated
            based on your specific dates.
          </p>
        </div>
      </section> */}

      {/* ══════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden bg-primary-light/10 md:bg-transparent md:bg-[url('/left.svg')] bg-no-repeat bg-cover">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-foreground">
              Loved by Travelers
            </h2>
            <p className="text-muted-foreground">
              See what our customers have to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-background rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>

                <div className="flex mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MORE THAN JUST A PARKING SPACE  (split section)
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 relative overflow-hidden md:bg-[url('/right.svg')] bg-no-repeat bg-cover">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          {/* Card Container */}
          <div className="grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-xl">
            {/* Left Panel */}
            <div className="bg-gradient-to-b from-primary to-primary-light px-8 py-16 lg:px-16 flex items-center">
              <div className="text-white lg:max-w-md">
                <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-5">
                  More Than Just A Parking Space.
                </h2>

                <p className="text-lg opacity-90 mb-6 leading-relaxed">
                  At ParkPro, we&apos;re committed to making your airport
                  experience as smooth as possible — from the moment you arrive
                  to the moment you return home.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    {
                      title: "No Hidden Fees",
                      desc: "The price you see is the price you pay. No sneaky booking charges.",
                      icon: CheckCircle2,
                    },
                    {
                      title: "Price Match Guarantee",
                      desc: "Find it cheaper elsewhere? We'll match it and refund the difference.",
                      icon: CreditCard,
                    },
                    {
                      title: "Book in 60 Seconds",
                      desc: "Our streamlined checkout gets your spot confirmed instantly.",
                      icon: Clock,
                    },
                    {
                      title: "Flexible Cancellation",
                      desc: "Plans change. Cancel up to 24 hours before for a full refund.",
                      icon: ShieldCheck,
                    },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex flex-col items-start gap-3">
                        {/* Icon circle */}
                        <div className="flex flex-row items-center lg:flex-col lg:items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>

                          {/* Title */}
                          <h4 className="text-white font-semibold text-lg">
                            {item.title}
                          </h4>
                        </div>

                        {/* Description */}
                        <p className="text-white/80 text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Image Panel */}
            <div
              className="min-h-[400px] hidden lg:block lg:min-h-full bg-cover bg-center"
              style={{ backgroundImage: "url('/premium-service.png')" }}
            />
          </div>
        </div>
      </section>
      {/* <section className="relative overflow-hidden ">
        <div className="grid lg:grid-cols-2"> */}
      {/* Left: orange panel with content */}
      {/* <div className="bg-gradient-to-b from-primary to-primary-light px-8 py-16 lg:py-20 lg:px-16 flex items-center">
            <div className="text-white max-w-md">
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-5">
                More Than Just A Parking Space.
              </h2>
              <p className="text-lg opacity-85 mb-6 leading-relaxed">
                At ParkPro, we&apos;re committed to making your airport
                experience as smooth as possible — from the moment you arrive to
                the moment you return home.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "24/7 CCTV & security patrols",
                  "Instant booking confirmation",
                  "No account required",
                  "Multi-day discounts available",
                  "Real-time booking tracking",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm opacity-90"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul> */}
      {/* <Button
                asChild
                className="bg-white text-primary hover:bg-primary/10 hover:text-white font-bold px-8 py-3 rounded-xl border-0"
              >
                <Link href="/book">Start Booking →</Link>
              </Button> */}
      {/* </div>
          </div> */}

      {/* Right: dark panel with icon graphic */}
      {/* <div className="bg-[url('/Premium-Service.png')] bg-cover bg-center min-h-[400px] flex items-center justify-center relative overflow-hidden"> */}
      {/*Grid pattern overlay
             <div className="absolute inset-0 opacity-10" />
            <div className="text-center text-white relative z-10 p-8">
              <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-5">
                <Car className="w-12 h-12 text-white/80" />
              </div>
              <p className="text-xl font-bold opacity-70 mb-1">
                Secure Parking
              </p>
              <p className="text-sm opacity-40">24/7 monitored facility</p>
              <div className="flex items-center justify-center gap-4 mt-6">
                {[ShieldCheck, Smartphone, MapPin].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center"
                  >
                    <Icon className="w-5 h-5 text-white/60" />
                  </div>
                ))}
              </div>
            </div> */}
      {/* </div>
        </div>
      </section> */}

      {/* ══════════════════════════════════════════════════════
          FAQs
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden bg-primary-light/10 md:bg-transparent md:bg-[url('/left.svg')] bg-no-repeat bg-cover">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Find answers to common questions about our service
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-border overflow-hidden shadow-sm bg-background"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground shrink-0 ml-4 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed animate-fade-in border-t border-border pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-[url('/readyToSave.svg')] bg-cover bg-center relative overflow-hidden">
        {/* <Image src="/readyToSave.svg" alt="" width={1440} height={353} /> */}
        {/* Decorative angled shapes */}
        {/* <div className="pointer-events-none absolute -right-20 top-0 h-full w-64 bg-white/5 rotate-12 rounded-3xl" /> */}
        {/* <div className="pointer-events-none absolute -left-16 bottom-0 h-full w-48 bg-white/5 -rotate-12 rounded-3xl" /> */}
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Ready to Save on Airport Parking?
          </h2>
          <p className="text-lg opacity-80 mb-8 max-w-xl mx-auto">
            Book your guaranteed parking space today and travel with complete
            peace of mind.
          </p>
          <Button
            asChild
            className="bg-white text-primary hover:bg-primary hover:text-white font-bold px-10 py-4 rounded-xl text-lg border-0"
          >
            <Link href="/book">Book Now — From £{pricePerHour}/hr</Link>
          </Button>
        </div>
      </section>
      {/* </div> */}
    </div>
  );
}
