"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShieldCheck,
  Plane,
  Car,
  Clock,
  Star,
  ChevronDown,
  CheckCircle2,
  CalendarDays,
  ClipboardCheck,
  MapPin,
  CreditCard,
  Search,
  ArrowRight,PlaneTakeoff,
  BadgeDollarSign,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import AirportPopover from "@/components/ui/AirportPicker";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/ui/DatePicker";
import ParkingCard from "@/components/shared/PricingCard";
import { api } from "@/lib/api";
import type React from "react";

// ─── Wheel SVG overlay — drawn on top of the car image ────────────────────────
function WheelSVG() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full" aria-hidden>
      {/* Outer tyre */}
      <circle cx="30" cy="30" r="29" fill="#111" />
      {/* Rim */}
      <circle cx="30" cy="30" r="19" fill="#2a2a2a" />
      {/* 5 spokes */}
      {[0, 72, 144, 216, 288].map((a) => (
        <line
          key={a}
          x1="30" y1="11" x2="30" y2="30"
          stroke="#999" strokeWidth="3.5" strokeLinecap="round"
          transform={`rotate(${a} 30 30)`}
        />
      ))}
      {/* Hub */}
      <circle cx="30" cy="30" r="5" fill="#ccc" />
      <circle cx="30" cy="30" r="2.5" fill="#555" />
    </svg>
  );
}

// ─── Scroll Animation Hook ─────────────────────────────────────────────────────

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

// ─── Page Loader ───────────────────────────────────────────────────────────────

function PageLoader({ onDone }: { onDone: () => void }) {
  const [moved, setMoved] = useState(false);
  const [fading, setFading] = useState(false);
  // Real pixel position of the navbar logo — measured after mount
  const [dest, setDest] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Measure the actual navbar logo so we fly to exactly the right spot
    const navLogo = document.getElementById("navbar-logo");
    if (navLogo) {
      const r = navLogo.getBoundingClientRect();
      setDest({ left: r.left, top: r.top });
    }

    const t1 = setTimeout(() => setMoved(true), 650);
    const t2 = setTimeout(() => setFading(true), 1250);
    const t3 = setTimeout(() => {
      document.body.style.overflow = "";
      onDone();
    }, 1700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      document.body.style.overflow = "";
    };
  }, [onDone]);

  // Fall back to a safe default until the measurement resolves
  const left = dest?.left ?? 24;
  const top = dest?.top ?? 20;

  return (
    <div
      className="fixed inset-0 bg-white z-[200]"
      style={{
        opacity: fading ? 0 : 1,
        transition: fading ? "opacity 0.45s ease" : "none",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {/*
        Element sits at its real final position (left/top).
        Transform starts it at the viewport center, then transitions to (0,0)
        so it lands exactly on the navbar logo.
      */}
      <div
        style={{
          position: "fixed",
          left: `${left}px`,
          top: `${top}px`,
          transform: moved
            ? "translate(0, 0) scale(1)"
            : `translate(calc(50vw - ${left}px - 50%), calc(50vh - ${top}px - 50%)) scale(2.2)`,
          transition: moved
            ? "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)"
            : undefined,
          willChange: "transform",
        }}
      >
        <Image src="/ParkPro.svg" alt="ParkPro" width={150} height={50} />
      </div>
    </div>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const steps = [
  {
    num: "01",
    icon: ClipboardCheck,
    title: "Fill Details",
    desc: "Enter your departure airport and travel dates to see live availability.",
  },
  {
    num: "02",
    icon: ShieldCheck,
    title: "Book Securely",
    desc: "Complete your reservation in 60 sec with our SSL secure checkout.",
  },
  {
    num: "03",
    icon: PlaneTakeoff,
    title: "Park & Fly",
    desc: "Drop off your car and head to the terminal.",
  },
];

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Verified Customer",
    time: "2 days ago",
    text: '"Saved over £40 on a week\'s parking at Gatwick compared to booking direct. The site was super easy to use and the Meet & Greet service was flawless."',
    stars: 5,
    initials: "SJ",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Mark T.",
    role: "Verified Customer",
    time: "1 week ago",
    text: '"Used ParkPro to find parking for Heathrow. Found a great off-airport option that took 5 mins on the bus. Highly recommend for the savings."',
    stars: 5,
    initials: "MT",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Emma Williams",
    role: "Verified Customer",
    time: "3 weeks ago",
    text: '"I always use this site now. It takes the stress out of finding parking and I know I\'m not getting ripped off. Customer service replied instantly too."',
    stars: 5,
    initials: "EW",
    color: "bg-purple-100 text-purple-700",
  },
];

const faqs = [
  {
    q: "How does ParkPro comparison work?",
    a: "Simply enter your departure airport, drop-off, and pick-up dates. We query our extensive database of trusted parking providers to show you real-time availability and prices, allowing you to choose the best option.",
  },
  {
    q: "Are there any hidden booking fees?",
    a: "No. The price you see is the price you pay. We never add hidden fees or surcharges. Our pricing is completely transparent.",
  },
  {
    q: "Can I cancel or amend my booking?",
    a: "Yes. Most bookings can be amended or cancelled free of charge up to 24 hours before your drop-off date. Contact our support team with your booking reference.",
  },
  {
    q: "Is my car secure while I'm away?",
    a: "Absolutely. All our parking partners are carefully vetted and provide 24/7 CCTV surveillance, security patrols, and controlled access to ensure your vehicle is safe.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend booking as early as possible to secure the best prices and availability, especially during peak travel periods like school holidays and bank holidays.",
  },
];

// ─── Static delay-class arrays (string literals so Tailwind scans them) ───────
const stepDelays = ["delay-[0ms]", "delay-[220ms]", "delay-[440ms]"] as const;
const testimonialDelays = ["delay-[0ms]", "delay-[180ms]", "delay-[360ms]"] as const;

// ─── Page Component ────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startingDayPrice, setStartingDayPrice] = useState(12);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [pageVisible, setPageVisible] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  // Section visibility refs
  const [howRef, howInView] = useInView();
  const [smartRef, smartInView] = useInView();
  const [servicesRef, servicesInView] = useInView();
  const [testimonialsRef, testimonialsInView] = useInView();
  const [moreRef, moreInView] = useInView();
  const [faqRef, faqInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

  // Car scroll animation — GSAP ScrollTrigger (same technique as ParkEase)
  const carSectionRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const rearWheelRef = useRef<HTMLDivElement>(null);
  const frontWheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = carSectionRef.current;
    const car = carRef.current;
    if (!section || !car) return;

    const ctx = gsap.context(() => {
      // One timeline drives both the car translation and wheel rotation
      // so they are perfectly in sync with the same scrub.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "bottom bottom",
          end: "+=2000",
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Car crosses from right to left
      tl.fromTo(car, { x: "120vw" }, { x: "-20vw", ease: "none" }, 0);

      // Wheels rotate at the same scrub rate.
      // Car travels 140 vw; at 1440px viewport a ~26px-radius wheel
      // makes ≈10 full turns — 3600° looks physically correct.
      const wheels = [rearWheelRef.current, frontWheelRef.current].filter(Boolean);
      if (wheels.length) {
        tl.fromTo(
          wheels,
          { rotation: 0 },
          { rotation: 3600, ease: "none" },
          0,
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleQuickBook = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      router.push(`/book?start=${startDate}&end=${endDate}`);
    } else {
      router.push("/book");
    }
  };

  useEffect(() => {
    const alreadyLoaded = sessionStorage.getItem("pp_loaded");
    if (alreadyLoaded) {
      setPageVisible(true);
    } else {
      setShowLoader(true);
    }
  }, []);

  const handleLoaderDone = useCallback(() => {
    setShowLoader(false);
    setPageVisible(true);
    sessionStorage.setItem("pp_loaded", "1");
  }, []);

  useEffect(() => {
    api
      .getStartingDayPrice()
      .then((res) => setStartingDayPrice(res.data))
      .catch(() => {});
  }, []);

  return (
    <>
      {showLoader && <PageLoader onDone={handleLoaderDone} />}

      <div
        className="overflow-hidden"
        style={{
          opacity: pageVisible ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}
      >
        {/* ══════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex items-center bg-[url('/hero.svg')] bg-cover bg-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Shape 1 */}
            <div
              className="absolute -left-10 -top-10 w-[700px] h-[700px] blur-3xl mix-blend-soft-light
    bg-[radial-gradient(circle,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_50%,rgba(255,255,255,0.2)_70%,transparent_100%)]"
            />

            {/* Shape 2 */}
            <div
              className="absolute -left-[300px] top-[250px] w-[900px] h-[600px] blur-3xl mix-blend-soft-light
    bg-[radial-gradient(ellipse,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.8)_50%,transparent_85%)]"
            />
          </div>
          {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.6)_15%,rgba(255,255,255,0.3)_25%,transparent_40%),linear-gradient(to_bottom,rgba(255,255,255,0.4)_0%,transparent_60%)]" /> */}
          {/* <Image
            src="/hero_strips.svg"
            alt=""
            width={1440}
            height={900}
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover hidden md:block opacity-30"
          /> */}

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-28 sm:py-24 sm:pt-32 w-full">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left */}
              <div className="animate-slide-up">
                {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 bg-white/10 text-white border border-white/25 backdrop-blur-sm">
                  <Plane className="w-3.5 h-3.5 text-primary" />
                  Trusted by 50,000+ travellers
                </div> */}

                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] italic mb-5">
                  <span className="text-primary">
                    Park Smart&#46;
                    <br />
                    Fly Easy.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-black/75 mb-8 max-w-lg leading-relaxed">
                  Compare 50+ UK airport parking deals. Save up to{" "}
                  <span className="text-primary font-bold">65%</span> on your
                  next trip with our price match guarantee.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <Button
                    asChild
                    className="px-8 py-3 rounded-full text-base bg-primary btn-bubble"
                  >
                    <Link href="/book" className="bg-linear-to-r from-transparent to-black/50">
                      Book Now →
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="px-8 py-3 rounded-full  text-base border-white text-black hover:bg-white/10 bg-white/30 backdrop-blur-md"
                  >
                    <Link href="#how-it-works">How it works</Link>
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Avatars + badge */}
                  <div className="flex items-center">
                    <div className="flex -space-x-3">
                      <Avatar className="w-10 h-10 border-2 border-white">
                        <AvatarImage src="/user1.png" />
                        <AvatarFallback>U1</AvatarFallback>
                      </Avatar>

                      <Avatar className="w-10 h-10 border-2 border-white">
                        <AvatarImage src="/user2.png" />
                        <AvatarFallback>U2</AvatarFallback>
                      </Avatar>

                      <Avatar className="w-10 h-10 border-2 border-white">
                        <AvatarImage src="/user3.png" />
                        <AvatarFallback>U3</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-10 h-10 border-3 border-white ">
                        <AvatarImage src="/aw.png" />
                        <AvatarFallback className="bg-orange-500 text-white bg-linear-to-r from-transparent  to-black/50">
                          <div className="">10k+</div>
                        </AvatarFallback>
                      </Avatar>
                      {/* <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white text-xs font-bold border-2 border-white">
                        
                      </div> */}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    <span className="text-orange-500 text-sm font-semibold">
                      4.8/5 Average Rating
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: booking widget */}
              <div className="animate-fade-in">
                <Card className="p-5 shadow-2xl rounded-4xl border-t-4 border-l bg-white/20 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-white">
                      Book Your Parking
                    </CardTitle>
                    <CardDescription className="text-white">
                      Get an instant price comparison
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleQuickBook} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-white">Select Airport</Label>
                        <AirportPopover />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white">
                          Drop-off Date & Time
                        </Label>
                        <DateTimePicker
                          value={startDate}
                          onChange={setStartDate}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white">
                          Pick-up Date & Time
                        </Label>
                        <DateTimePicker value={endDate} onChange={setEndDate} />
                      </div>
                      <Button className="w-full rounded-full py-3 text-base font-bold bg-primary bg-linear-to-r from-transparent via-transparent to-black/30 btn-bubble">
                        Book Now
                      </Button>
                    </form>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      From £{startingDayPrice}/day · No hidden fees · Instant
                      confirmation
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════════════ */}
        <section
          id="how-it-works"
          className="py-16 sm:py-24"
          // style={{
          //   background:
          //     "radial-gradient(ellipse at top left, #fde8d0 0%, #fef3ea 40%, #fef8f4 70%, #fff8f3 100%)",
          // }}
          ref={howRef as React.RefObject<HTMLElement>}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div
              className={`text-center mb-12 sm:mb-20 transition-all duration-700 ${
                howInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold italic mb-4 text-[#1a2332]">
                How It Works
              </h2>
              <p className="text-gray-500 max-w-md mx-auto text-base leading-relaxed">
                Securing your airport parking is as easy as 1-2-3. Save time
                and money with ParkPro.
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
              {steps.map((step, i) => {
                const Icon = step.icon;

                return (
                  <div
                    key={i}
                    className={`relative flex flex-col sm:flex-row items-center sm:items-start gap-2 transition-all duration-700 ${stepDelays[i]} ${
                      howInView
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-20"
                    }`}
                  >
                    {/* Big number */}
                    <div className="text-[64px] sm:text-[90px] font-extrabold text-orange-500 leading-none select-none sm:mt-10 shrink-0 w-16 sm:w-20 text-center sm:text-right">
                      {step.num}
                    </div>

                    {/* Card + background circle wrapper */}
                    <div className="relative flex-1 flex justify-center">
                      {/* Peach circle behind card */}
                      <div className="absolute -bottom-6 -right-4 w-40 h-40 rounded-full bg-orange-100/80" />

                      {/* Card — no overflow-hidden here so the floating icon above it isn't clipped */}
                      <div className="relative z-10 w-full bg-white rounded-3xl pt-14 pb-8 px-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-gray-100/80 text-center group card-hover hover-border-pop">
                        {/* Shimmer overlay keeps its own overflow-hidden so it stays within the card */}
                        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl z-20">
                          <div className="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_1.2s_ease-in-out]" />
                        </div>

                        {/* Floating icon */}
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                          <div className="w-14 h-14 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SMART PARKING — Split section
        ══════════════════════════════════════════════════════ */}
        <section
          className="py-14 sm:py-20 px-4 sm:px-8 lg:px-16"
          ref={smartRef as React.RefObject<HTMLElement>}
        >
          <div className="max-w-2xl mx-auto text-center">

            {/* Content */}
            <div
              className={`transition-all duration-700 ${
                smartInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-[#1a2332] mb-5">
                Smart Parking.{" "}
                <span className="italic">Designed for Every Journey.</span>
              </h2>

              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
                From quick drop-offs to extended long-term stays, discover a
                parking experience designed to adapt to your needs. Whether
                you're traveling for business or leisure, our solutions offer
                seamless access, advanced security, and complete peace of mind.
              </p>

              <Button className="rounded-full px-8 bg-orange-500 hover:bg-orange-600 bg-linear-to-r from-transparent to-black/30 text-white shadow-md btn-bubble">
                See Services Below
              </Button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            OUR PARKING SERVICES
        ══════════════════════════════════════════════════════ */}
        <section
          className="py-16 sm:py-24 bg-background"
          ref={servicesRef as React.RefObject<HTMLElement>}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`text-center mb-8 sm:mb-14 transition-all duration-700 ${servicesInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-foreground">
                Our Parking Services
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Choose the perfect parking type for your needs and budget. We
                partner with top-rated operators to ensure quality.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Slides in from the LEFT */}
              <div
                className={`transition-all duration-700 ease-out ${
                  servicesInView
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-24"
                }`}
              >
                <ParkingCard
                  title="Meet & Greet"
                  description="Drive straight to the terminal and hand your keys to a fully insured professional chauffeur."
                  image="/service1.png"
                />
              </div>

              {/* Slides in from the RIGHT — delayed 200ms */}
              <div
                className={`transition-all duration-700 ease-out delay-[200ms] ${
                  servicesInView
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-24"
                }`}
              >
                <ParkingCard
                  title="On-Airport Parking"
                  description="Park directly within the airport grounds for maximum convenience and shortest walk times."
                  image="/service2.png"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            LOVED BY TRAVELERS + CAR ANIMATION
            GSAP ScrollTrigger pins when section bottom hits
            viewport bottom, scrubs car across for 2000px of
            scroll, then releases — no white gaps, no manual math.
        ══════════════════════════════════════════════════════ */}
        <div ref={carSectionRef} className="bg-background overflow-hidden">
          {/* ── Testimonials ──────────────────────────────── */}
          <div
            ref={testimonialsRef as React.RefObject<HTMLDivElement>}
            className="py-12 px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-7xl mx-auto">
              {/* HEADER */}
              <div
                className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 transition-all duration-700 ${
                  testimonialsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="max-w-lg">
                  <h2 className="text-3xl sm:text-4xl font-bold italic text-foreground mb-3">
                    Loved by Travelers
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                    Don&apos;t just take our word for it. Read what over 10,000
                    satisfied customers have to say about their ParkPro
                    experience.
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-3xl font-extrabold text-foreground leading-none">
                      4.8/5
                    </p>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">
                    Trustpilot
                  </span>
                </div>
              </div>

              {/* CARDS — card 0 from left, card 1 from bottom, card 2 from right */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {testimonials.map((t, i) => {
                  const entryClass =
                    i === 0
                      ? testimonialsInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
                      : i === 1
                      ? testimonialsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                      : testimonialsInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20";

                  return (
                    <div
                      key={i}
                      className={`relative bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.07)] border border-gray-100 flex flex-col overflow-hidden group card-hover hover-border-pop transition-all duration-700 ease-out ${testimonialDelays[i]} ${entryClass}`}
                    >
                      {/* Shimmer overlay */}
                      <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
                        <div className="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_1.2s_ease-in-out]" />
                      </div>

                      <div className="flex gap-0.5 mb-4">
                        {[...Array(t.stars)].map((_, j) => (
                          <Star
                            key={j}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-6">
                        {t.text}
                      </p>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center font-bold text-xs shrink-0`}
                        >
                          {t.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground leading-tight">
                            {t.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t.role} {"•"} {t.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Car strip ─────────────────────────────────── */}
          <div style={{ height: "240px", position: "relative", overflow: "hidden" }}>
            <div className="absolute inset-0 bg-[url('/road.png')] bg-cover bg-[center_75%]" />
            <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-background to-transparent z-10" />
            <div className="absolute inset-0 bg-black/10" />
            {/* Car wrapper — GSAP animates translateX on this div */}
            <div
              ref={carRef}
              className="absolute bottom-0 left-0 h-40 sm:h-52"
              style={{ willChange: "transform" }}
            >
              <Image
                src="/car.svg"
                alt=""
                width={500}
                height={220}
                aria-hidden
                className="h-full w-auto"
              />

              {/* Rear wheel overlay — sits on top of the car image wheel */}
              {/* <div
                ref={rearWheelRef}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "17%",
                  height: "35%",
                  aspectRatio: "1",
                  transformOrigin: "center center",
                }}
              >
                <WheelSVG />
              </div>

              
              <div
                ref={frontWheelRef}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "73%",
                  height: "35%",
                  aspectRatio: "1",
                  transformOrigin: "center center",
                }}
              >
                <WheelSVG />
              </div> */}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            MORE THAN JUST A PARKING SPACE
        ══════════════════════════════════════════════════════ */}
        <section className="py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* bg via CSS so it shows behind flowing content on mobile */}
            <div
              className="relative rounded-[30px] overflow-hidden lg:min-h-[680px] bg-cover bg-center"
              style={{ backgroundImage: 'url("/Service.png")' }}
            >
              {/* Glass overlay — normal flow on mobile, absolute on lg+ */}
              <div className="relative lg:absolute lg:inset-0 flex">
                {/* GLASS PANE */}
                <div className="w-full lg:w-[50%] lg:h-full backdrop-blur-sm bg-white/20 rounded-[30px] lg:rounded-none">
                  <div className="relative z-10 flex items-start lg:items-center p-6 sm:p-10 lg:p-16 text-white">
                    <div className="max-w-xl w-full py-2 lg:py-0">
                      {/* Tag */}
                      <span className="text-[11px] px-3 py-1 rounded-full bg-white/20 inline-block mb-4 tracking-wide">
                        Why ParkPro
                      </span>

                      {/* Heading */}
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold italic leading-[1.15] mb-4 tracking-tight">
                        More Than Just A Parking Space.
                      </h2>

                      {/* Description */}
                      <p className="text-white/75 text-sm leading-[1.8] mb-5 max-w-md">
                        We take the stress out of airport parking by providing
                        full transparency, unbeatable prices, and award-winning
                        support.
                      </p>

                      {/* FEATURES — always 2-col so all four items fit on mobile */}
                      <div className="grid grid-cols-2 gap-x-4 sm:gap-x-10 gap-y-5 sm:gap-y-8">
                        {[
                          {
                            title: "No Hidden Fees",
                            desc: "The price you see is the price you pay. No sneaky booking charges.",
                            icon: CheckCircle2,
                          },
                          {
                            title: "Price Match",
                            desc: "Find it cheaper elsewhere? We'll match it and refund the difference.",
                            icon: CreditCard,
                          },
                          {
                            title: "Book in 60s",
                            desc: "Our streamlined checkout gets your spot confirmed instantly.",
                            icon: Clock,
                          },
                          {
                            title: "Flexible Cancel",
                            desc: "Plans change. Cancel up to 24 hours before for a full refund.",
                            icon: ShieldCheck,
                          },
                        ].map((item, i) => {
                          const Icon = item.icon;
                          return (
                            <div key={i} className="flex flex-col items-start gap-2 sm:gap-3">
                              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
                              </div>
                              <h4 className="font-semibold text-sm sm:text-[15px] text-white/95">
                                {item.title}
                              </h4>
                              <p className="text-xs sm:text-[13px] text-white/60 leading-relaxed">
                                {item.desc}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side empty on lg+ */}
                <div className="hidden lg:block flex-1" />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            FAQs
        ══════════════════════════════════════════════════════ */}
        <section
          className="py-16 sm:py-24 bg-background"
          ref={faqRef as React.RefObject<HTMLElement>}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* HEADER (CENTERED) */}
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Got a question? We&apos;ve got answers. If you can&apos;t find
                what you&apos;re looking for, our support team is available
                24/7.
              </p>
            </div>

            {/* CONTENT */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
              {/* IMAGE */}
              <div className="hidden lg:block lg:pr-4">
                <div className="rounded-[28px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
                  <img
                    src="/faqs.png"
                    className="w-full h-[420px] object-cover"
                  />
                </div>
              </div>

              {/* ACCORDION */}
              <div className="space-y-5">
                {faqs.map((faq, i) => {
                  const isOpen = openFaq === i;

                  return (
                    <div
                      key={i}
                      className={`rounded-2xl transition-all duration-300 ${
                        isOpen
                          ? "bg-[#f8f8f8] shadow-[0_10px_30px_rgba(0,0,0,0.08)] border-t-3 border-t-orange-400"
                          : "bg-[#f3f3f3] hover:bg-[#eeeeee] shadow-[0_4px_15px_rgba(0,0,0,0.05)]"
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="w-full flex justify-between items-center px-4 sm:px-7 py-4 sm:py-5 text-left"
                      >
                        <span className="font-semibold text-sm sm:text-[15.5px] leading-relaxed">
                          {faq.q}
                        </span>

                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            isOpen ? "rotate-180 text-orange-500" : ""
                          }`}
                        />
                      </button>

                      <div
                        className={`overflow-hidden ${isOpen ? "max-h-[200px]" : "max-h-0"}`}
                      >
                        <div className="px-4 sm:px-7 pb-5 sm:pb-6 text-sm text-muted-foreground leading-relaxed">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            CTA BANNER
        ══════════════════════════════════════════════════════ */}
        {/* <section
          className="py-20 bg-[#1a2332] relative overflow-hidden"
          ref={ctaRef as React.RefObject<HTMLElement>}
        >
          <div className="cta-grid-pattern absolute inset-0 opacity-5" />

          <div
            className={`relative max-w-3xl mx-auto px-4 text-center transition-all duration-700 ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="flex items-center justify-center gap-2 mb-5">
              <Image src="/logo.svg" alt="ParkPro" width={28} height={28} />
              <p className="flex items-center text-sm text-primary uppercase leading-none">
                <span className="font-bold">Park</span>
                <span className="font-normal">Pro</span>
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-white">
              Ready to Save on Airport Parking with ParkPro?
            </h2>
            <p className="text-white/55 mb-10 max-w-xl mx-auto leading-relaxed">
              Join millions of smart travellers who compare and book with
              ParkPro. Enter your dates and let&apos;s find you the best deal.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Select airport"
                  readOnly
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-foreground text-sm focus:outline-none cursor-pointer"
                  onClick={() => router.push("/book")}
                />
              </div>
              <Button
                asChild
                className="rounded-full px-8 py-3 font-bold shrink-0 w-full sm:w-auto"
              >
                <Link href="/book">Find Parking</Link>
              </Button>
            </div>
          </div>
        </section> */}
      </div>
    </>
  );
}
