"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative bg-gradient-to-br from-primary to-primary-light text-white overflow-hidden">
      {/* Background SVG Layer */}
      {/* <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[url('/footer.svg')] bg-no-repeat bg-right-bottom bg-[length:400px] sm:bg-[length:500px] md:bg-[length:600px]" />
      </div> */}
      <Image
        src="/footer.png"
        alt=""
        width={500}
        height={655}
        className="absolute bottom-0 right-0 opacity-10 pointer-events-none w-[300px] sm:w-[400px] md:w-[500px] h-auto"
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/FooterLogo.svg" alt="Logo" width={32} height={32} />
              <p className="text-lg uppercase leading-none">
                <span className="font-bold">Park</span>
                <span className="font-light">Pro</span>
              </p>
            </Link>

            <p className="text-sm opacity-70 leading-relaxed max-w-sm">
              Secure, affordable airport parking with guaranteed spaces. Book
              online and travel stress-free.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/book", label: "Book Parking" },
                { href: "/track", label: "Track Booking" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="opacity-70 hover:opacity-100 transition"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/faqs", label: "FAQs" },
                { href: "/contact", label: "Contact Us" },
                // { href: "/support", label: "Support" },
                { href: "/about", label: "About Us" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="opacity-70 hover:opacity-100 transition"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>

            <div className="space-y-3 text-sm">
              {/* <div className="flex items-start gap-3 opacity-70 hover:opacity-100 transition">
                <MapPin className="w-4 h-4 mt-1 shrink-0" />
                <a
                  href="https://maps.app.goo.gl/5Kpmej29MWZ5qRbD7"
                  target="_blank"
                  className="leading-snug"
                >
                  103 Pennine Way <br /> UB3 5LJ
                </a>
              </div> */}

              <div className="flex items-center gap-3 opacity-70 hover:opacity-100 transition">
                <Phone className="w-4 h-4 shrink-0" />
                <a href="tel:07927970960">07927970960</a>
              </div>

              <div className="flex items-center gap-3 opacity-70 hover:opacity-100 transition">
                <Mail className="w-4 h-4 shrink-0" />
                <a href="mailto:info@parkpro.uk">info@parkpro.uk</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center sm:justify-between text-sm opacity-60 text-xs border-t border-white/10 pt-4 gap-2 text-center sm:text-left">
          <p>
            Made with ❤️ <a href="https://thesocialnexus.co.uk" className="underline hover:opacity-100 transition">
              TSN
            </a>
          </p>
        </div>
        <div className="pt-3 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm opacity-60 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} ParkPro Airport Parking. All rights
            reserved.
          </p>

          <div className="flex gap-4">
            <Link href="/policies" className="hover:opacity-100 cursor-pointer">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:opacity-100 cursor-pointer">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
    // <footer className=" bg-gradient-to-br from-primary to-primary-light  text-white">
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[url('/footer.svg')] bg-contain bg-center bg-no-repeat">
    //     <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    //       {/* Brand */}
    //       <div className="">
    //         <Link href="/" className="flex items-center gap-2 mb-4">
    //           <Image src="/FooterLogo.svg" alt="Logo" width={32} height={32} />
    //           <p className="flex items-center text-lg text-white uppercase leading-none">
    //             <span className="font-bold">Park</span>
    //             <span className="font-normal">Pro</span>
    //           </p>
    //         </Link>
    //         <p className="text-sm opacity-70 max-w-md leading-relaxed">
    //           Secure, affordable airport parking with guaranteed spaces. Book
    //           online and enjoy peace of mind while you travel.
    //         </p>
    //       </div>

    //       {/* Quick Links */}
    //       <div>
    //         <h4 className="font-semibold text-white mb-4">Quick Links</h4>
    //         <ul className="space-y-2 text-sm">
    //           {[
    //             { href: "/", label: "Home" },
    //             { href: "/book", label: "Book Parking" },
    //             { href: "/track", label: "Track Booking" },
    //             { href: "/about", label: "About Us" },
    //           ].map(({ href, label }) => (
    //             <li key={href}>
    //               <Link
    //                 href={href}
    //                 className="opacity-70 hover:opacity-100 transition-opacity"
    //               >
    //                 {label}
    //               </Link>
    //             </li>
    //           ))}
    //         </ul>
    //       </div>

    //       {/* Support */}
    //       <div>
    //         <h4 className="font-semibold text-white mb-4">Support</h4>
    //         <ul className="space-y-2 text-sm">
    //           {[
    //             { href: "/faqs", label: "FAQs" },
    //             { href: "/contact", label: "Contact Us" },
    //             { href: "/support", label: "Support" },
    //           ].map(({ href, label }) => (
    //             <li key={href}>
    //               <Link
    //                 href={href}
    //                 className="opacity-70 hover:opacity-100 transition-opacity"
    //               >
    //                 {label}
    //               </Link>
    //             </li>
    //           ))}
    //         </ul>
    //       </div>

    //       <div>
    //         <h4 className="font-semibold text-white mb-4">Contact Us</h4>
    //         <div className="flex items-start gap-3 opacity-70 hover:opacity-100 transition-opacity">
    //           <MapPin className="w-4 h-4 mt-1 shrink-0" />
    //           <p className="text-sm">
    //             <a
    //               href="https://maps.app.goo.gl/8p6775Y581w297t97"
    //               target="_blank"
    //               rel="noopener noreferrer"
    //             >
    //               103 Pennine Way <br />
    //               UB3 5LJ
    //             </a>
    //           </p>
    //         </div>

    //         {/* Phone */}
    //         <div className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
    //           <Phone className="w-4 h-4 shrink-0" />
    //           <p className="text-sm">
    //             <a href="tel:07903835808">07903 835808</a>
    //           </p>
    //         </div>

    //         {/* Email */}
    //         <div className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
    //           <Mail className="w-4 h-4 shrink-0" />
    //           <p className="text-sm">
    //             <a href="mailto:info@parkpro.uk">info@parkpro.uk</a>
    //           </p>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
    //       <p className="text-sm opacity-60">
    //         © {new Date().getFullYear()} ParkPro Airport Parking. All rights
    //         reserved.
    //       </p>
    //       <div className="flex items-center gap-4 text-sm opacity-60">
    //         <span>Privacy Policy</span>
    //         <span>Terms of Service</span>
    //       </div>
    //     </div>
    //   </div>
    // </footer>
  );
}
