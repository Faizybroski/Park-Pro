import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About Us - ParkPro', description: 'Learn about ParkPro airport parking services.' };

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <section className="py-20" style={{ background: 'linear-gradient(135deg, var(--primary-dark, #142a45), var(--primary))' }}>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">About ParkPro</h1>
          <p className="text-lg opacity-80">Your trusted airport parking partner</p>
        </div>
      </section>
      <section className="py-16 max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          <div className="rounded-2xl border p-8" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Our Mission</h2>
            <p className="leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>At ParkPro, we believe airport parking should be simple, affordable, and stress-free. We provide secure, monitored parking spaces with a seamless online booking experience — no accounts, no hassle. Just book, park, and fly.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🛡️', title: '24/7 Security', desc: 'CCTV monitored with regular security patrols' },
              { icon: '⭐', title: '50,000+ Happy Customers', desc: 'Trusted by thousands of travellers every year' },
              { icon: '💰', title: 'Best Price Guarantee', desc: 'Competitive rates with transparent pricing' },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border p-6 text-center" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--foreground)' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
