"use client";

import Link from "next/link";
import Image from "next/image";
import { MoveUpRight } from "lucide-react";

type Props = {
  title: string;
  description: string;
  image: string;
};

export default function ParkingCard({ title, description, image }: Props) {
  return (
    <>
      {/* ── Mobile card — simple rect, no SVG mask ────────────────────────── */}
      <div className="sm:hidden relative w-full h-55 rounded-2xl overflow-hidden group cursor-pointer border border-gray-100">
        <Image
          src={image}
          alt=""
          fill
          aria-hidden
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

        {/* Shimmer */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/2 top-0 h-full w-1/2 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_1.2s_ease-in-out]" />
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white z-10">
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-xs text-white/75 mb-3 leading-relaxed line-clamp-2">{description}</p>
          <Link
            href="/book"
            className="inline-block backdrop-blur-xl bg-white/20 border border-white/30 text-white text-xs font-semibold px-5 py-2 rounded-full shadow-lg transition-all duration-300 group-hover:bg-white/30"
          >
            Book Now →
          </Link>
        </div>
      </div>

      {/* ── Desktop card — SVG-masked parking shape ───────────────────────── */}
      <div className="hidden sm:block relative w-full aspect-607/299 min-h-45 group cursor-pointer">
        {/* MASKED CARD */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            WebkitMaskImage: "url('/parking-shape.svg')",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            WebkitMaskSize: "contain",
            maskImage: "url('/parking-shape.svg')",
            maskRepeat: "no-repeat",
            maskPosition: "center",
            maskSize: "contain",
          }}
        >
          {/* Background */}
          <Image
            src={image}
            alt=""
            fill
            aria-hidden
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

          {/* Shimmer */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-1/2 top-0 h-full w-1/2 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_1.2s_ease-in-out]" />
          </div>

          {/* Content */}
          <div className="absolute bottom-[10%] left-[5%] right-[25%] text-white z-10">
            <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{title}</h3>
            <p className="text-xs sm:text-sm text-white/75 mb-3 sm:mb-5 leading-relaxed max-w-xs">
              {description}
            </p>
            <Link
              href="/book"
              className="block backdrop-blur-xl bg-white/20 border border-white/30 text-white text-xs sm:text-sm font-semibold py-2 sm:py-3 rounded-full text-center shadow-lg transition-all duration-300 group-hover:bg-white/30"
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* Arrow centered in notch — notch center ≈ 92.75% from left, 85.4% from top */}
        <div className="absolute z-20 left-[92.75%] top-[85.4%] -translate-x-1/2 -translate-y-1/2">
          <Link
            href="/book"
            className="w-12 h-12 sm:w-13.5 sm:h-13.5 flex items-center justify-center rounded-full bg-primary bg-linear-to-r from-transparent to-black/50 shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:scale-105"
          >
            <MoveUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </Link>
        </div>
      </div>
    </>
  );
}
