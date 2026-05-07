"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/book", label: "Book Now" },
  { href: "/track", label: "Track Booking" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faqs", label: "FAQs" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Don't show navbar on admin pages
  if (pathname.startsWith("/admin")) return null;

  const linkColor = pastHero
    ? "text-primary hover:text-primary/70"
    : "text-white hover:text-white/80";
  const iconColor = pastHero
    ? "bg-primary text-white hover:text-primary hover:bg-white"
    : "text-primary bg-white hover:text-white hover:bg-primary";
  const navBg = pastHero
    ? "bg-white/95 border-primary/20"
    : "bg-white/20 border-white/50";

  return (
    <nav
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 py-2 max-w-7xl w-[94%] rounded-full backdrop-blur-sm shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06),0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border transition-colors duration-300 ${navBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link id="navbar-logo" href="/" className="flex items-center gap-2 py-5">
            {/* <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
              }}
            >
              PP
            </div> */}
            <Image src="/ParkPro.svg" alt="Logo" width={150} height={100} />
            {/* <p className="flex items-center text-lg text-primary uppercase leading-none">
              <span className="font-bold">Park</span>
              <span className="font-normal">Pro</span>
            </p> */}
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm transition-all duration-200 ${
                    pastHero
                      ? isActive
                        ? "font-bold text-primary-light  border-b border-primary-light"
                        : "text-muted-foreground font-medium hover:opacity-80"
                      : isActive
                        ? "font-bold text-primary  border-b border-primary"
                        : "text-white font-medium hover:text-white/80"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

         

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${iconColor} `}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t animate-fade-in border-border bg-background rounded-b-4xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === href ? "text-white" : ""
                }`}
                style={
                  pathname === href
                    ? { background: "var(--primary)" }
                    : { color: "var(--muted-foreground)" }
                }
              >
                {label}
              </Link>
            ))}
            {/* <div className="pt-2 flex items-center gap-3">
              <ThemeToggle />
            </div> */}
          </div>
        </div>
      )}
    </nav>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  const toggle = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg transition-colors"
      style={{ background: "var(--muted)", color: "var(--foreground)" }}
      title="Toggle theme"
    >
      {dark ? (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
