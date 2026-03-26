import type { Metadata } from "next";
import { ShieldCheck, Star, BadgeDollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - ParkPro",
  description: "Learn about ParkPro airport parking services.",
};

const items = [
  {
    icon: ShieldCheck,
    title: "24/7 Security",
    desc: "CCTV monitored with regular security patrols",
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    icon: Star,
    title: "50,000+ Happy Customers",
    desc: "Trusted by thousands of travellers every year",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
  },
  {
    icon: BadgeDollarSign,
    title: "Best Price Guarantee",
    desc: "Competitive rates with transparent pricing",
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <section
        className="py-20"
        style={{
          background:
            "linear-gradient(135deg, var(--primary-dark, #142a45), var(--primary))",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">About ParkPro</h1>
          <p className="text-lg opacity-80">
            Your trusted airport parking partner
          </p>
        </div>
      </section>
      <section className="py-16 max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          <div
            className="rounded-2xl border p-8"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--foreground)" }}
            >
              Our Mission
            </h2>
            <p
              className="leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              At ParkPro, we believe airport parking should be simple,
              affordable, and stress-free. We provide secure, monitored parking
              spaces with a seamless online booking experience — no accounts, no
              hassle. Just book, park, and fly.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {items.map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className="rounded-2xl border p-6 text-center"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div
                    className={`w-14 h-14 mx-auto flex items-center justify-center rounded-xl mb-4 ${item.bg} group-hover:scale-110 transition`}
                  >
                    <Icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  {/* <div className="text-4xl mb-3">{item.icon}</div> */}
                  <h3
                    className="font-bold mb-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
