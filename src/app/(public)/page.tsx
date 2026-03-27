"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  BadgeDollarSign,
  Zap,
  MapPin,
  Car,
  Smartphone,
  Plane,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Fully Secured",
    desc: "24/7 CCTV monitored parking with security patrols",
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    icon: BadgeDollarSign,
    title: "Best Prices",
    desc: "Competitive rates with multi-day discounts",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    desc: "Book in 60 seconds, no account needed",
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    icon: MapPin,
    title: "Guaranteed Space",
    desc: "Your spot is reserved the moment you book",
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    icon: Car,
    title: "Meet & Greet",
    desc: "Drive straight to the terminal, we handle the rest",
    color: "text-red-600",
    bg: "bg-red-100",
  },
  {
    icon: Smartphone,
    title: "Track Anytime",
    desc: "Track your booking status in real-time",
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    text: "Absolutely brilliant service! Booked within a minute and my car was safe the entire trip. Will definitely use again.",
    stars: 5,
  },
  {
    name: "James R.",
    text: "Best airport parking I've ever used. The price was unbeatable and the whole process was seamless.",
    stars: 5,
  },
  {
    name: "Emily K.",
    text: "Used ParkPro for our family holiday. Easy booking, great price, and peace of mind knowing our car was secure.",
    stars: 5,
  },
];

const steps = [
  {
    num: "01",
    title: "Enter Dates",
    desc: "Pick your drop-off and pick-up dates and times",
  },
  {
    num: "02",
    title: "Fill Details",
    desc: "Enter your car and contact information",
  },
  {
    num: "03",
    title: "Get Confirmed",
    desc: "Receive instant confirmation with your slot number",
  },
  {
    num: "04",
    title: "Park & Fly",
    desc: "Drop off your car and head to the terminal",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pricePerHour, setPricePerHour] = useState(3);

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      router.push(`/book?start=${startDate}&end=${endDate}`);
    } else {
      router.push("/book");
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.getPricePerHour();
        setPricePerHour(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,var(--primary-dark,#142a45)_0%,var(--primary,#1e3a5f)_50%,var(--primary-light,#2d5f8b)_100%)]">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 bg-accent"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-10 bg-accent-light"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-white animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6 bg-[rgba(245,158,11,0.2)] text-[#fbbf24]">
                <Plane className="w-4 h-4" strokeWidth={2} />
                Trusted by 50,000+ travellers
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Secure Airport
                <br />
                <span className="text-[#fbbf24]">Parking</span> Made Simple
              </h1>
              <p className="text-lg opacity-80 mb-8 max-w-lg">
                Book your guaranteed parking space in 60 seconds. No account
                needed. Competitive prices with multi-day discounts.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  variant="custom"
                  className="px-8 py-3.5 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Link href="/book">Book Now →</Link>
                </Button>
                <Button
                  asChild
                  className="px-8 py-3.5 rounded-xl text-lg font-semibold  text-white transition-all duration-300 hover:bg-white/10"
                >
                  <Link href="/track">Track Booking</Link>
                </Button>
              </div>
            </div>

            {/* Quick booking form */}
            <div className="animate-fade-in">
              <Card className="shadow-2xl rounded-2xl p-6 lg:p-8 bg-card text-card-foreground">
                <CardHeader className="p-0">
                  <CardTitle className="text-xl font-bold mb-1">
                    Quick Price Check
                  </CardTitle>
                  <CardDescription className="text-sm mb-4">
                    Enter your dates to see pricing
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                  <form onSubmit={handleQuickBook} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Drop-off Date & Time</Label>
                      <Input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Pick-up Date & Time</Label>
                      <Input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>

                    <Button className="w-full">Check Price & Book →</Button>
                  </form>

                  <p className="text-xs text-muted-foreground text-center mt-3">
                    From £{pricePerHour}/hour • No hidden fees
                  </p>
                </CardContent>
              </Card>
            </div>
            {/* <div className="animate-fade-in">
              <div
                className="rounded-2xl p-6 lg:p-8 shadow-2xl"
                style={{
                  background: "var(--card)",
                  color: "var(--card-foreground)",
                }}
              >
                <h2
                  className="text-xl font-bold mb-1"
                  style={{ color: "var(--foreground)" }}
                >
                  Quick Price Check
                </h2>
                <p
                  className="text-sm mb-6"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Enter your dates to see pricing
                </p>
                <form onSubmit={handleQuickBook} className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1.5"
                      style={{ color: "var(--foreground)" }}
                    >
                      Drop-off Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all"
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
                      Pick-up Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{
                        background: "var(--muted)",
                        borderColor: "var(--border)",
                        color: "var(--foreground)",
                      }}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-white font-bold text-base transition-all duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
                    }}
                  >
                    Check Price & Book →
                  </button>
                </form>
                <p
                  className="text-center text-xs mt-3 opacity-50"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  From £3/hour • No hidden fees
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              How It Works
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
              Book your secure parking space in four simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Card className="text-center hover:shadow-lg transition">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 rounded-xl text-2xl bg-[linear-gradient(135deg,var(--primary-dark,#142a45)_0%,var(--primary-light,#2d5f8b)_100%)] text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold">
                      {step.num}
                    </div>

                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </CardContent>
                </Card>
                {/* <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--primary), var(--primary-light))",
                  }}
                >
                  {step.num}
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {step.desc}
                </p> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              Why Choose ParkPro?
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
              We make airport parking stress-free with unbeatable features
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <Card
                  key={i}
                  className="group p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 ">
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-lg bg-muted group-hover:scale-110 transition ${b.bg}`}
                    >
                      <Icon className={`w-6 h-6 ${b.color}`} />
                    </div>

                    <h3 className="font-semibold text-lg">{b.title}</h3>
                  </div>

                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </Card>
                // <div
                //   key={i}
                //   className="group p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                //   style={{
                //     background: "var(--card)",
                //     borderColor: "var(--border)",
                //   }}
                // >
                //   <h3
                //     className="text-lg font-bold mb-5  flex items-center gap-2"
                //     style={{ color: "var(--foreground)" }}
                //   >
                //     <div
                //       className={`w-12 h-12 flex items-center justify-center rounded-xl  ${b.bg} group-hover:scale-110 transition`}
                //     >
                //       <Icon className={`w-6 h-6 ${b.color}`} />
                //     </div>
                //     {b.title}
                //   </h3>
                //   <p
                //     className="text-sm leading-relaxed"
                //     style={{ color: "var(--muted-foreground)" }}
                //   >
                //     {b.desc}
                //   </p>
                // </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              What Our Customers Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex mb-3 text-yellow-400">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <span key={j}>★</span>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {`"${t.text}"`}
                  </p>

                  <p className="font-semibold text-sm">{t.name}</p>
                </CardContent>
              </Card>
              // <div
              //   key={i}
              //   className="p-6 rounded-2xl border"
              //   style={{
              //     background: "var(--card)",
              //     borderColor: "var(--border)",
              //   }}
              // >
              //   <div className="flex mb-3">
              //     {Array.from({ length: t.stars }).map((_, j) => (
              //       <span key={j} className="text-yellow-400 text-lg">
              //         ★
              //       </span>
              //     ))}
              //   </div>
              //   <p
              //     className="text-sm mb-4 leading-relaxed"
              //     style={{ color: "var(--muted-foreground)" }}
              //   >
              //     "{t.text}"
              //   </p>
              //   <p
              //     className="font-semibold text-sm"
              //     style={{ color: "var(--foreground)" }}
              //   >
              //     {t.name}
              //   </p>
              // </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[linear-gradient(135deg,var(--primary-dark,#142a45),var(--primary))]">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Book Your Parking?
          </h2>
          <p className="text-lg opacity-80 mb-8">
            Secure your space now and travel with peace of mind
          </p>
          <Button
            asChild
            variant="custom"
            className="inline-flex items-center px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105"
          >
            <Link href="/book">Book Now — From £{pricePerHour}/hr</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
