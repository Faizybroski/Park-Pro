'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer style={{ background: 'var(--primary-dark, #142a45)', color: '#e2e8f0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }}>
                PP
              </div>
              <span className="text-xl font-bold text-white">ParkPro</span>
            </div>
            <p className="text-sm opacity-70 max-w-md leading-relaxed">
              Secure, affordable airport parking with guaranteed spaces.
              Book online and enjoy peace of mind while you travel.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/book', label: 'Book Parking' },
                { href: '/track', label: 'Track Booking' },
                { href: '/about', label: 'About Us' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="opacity-70 hover:opacity-100 transition-opacity">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/faqs', label: 'FAQs' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/support', label: 'Support' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="opacity-70 hover:opacity-100 transition-opacity">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} ParkPro Airport Parking. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm opacity-60">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
