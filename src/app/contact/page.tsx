'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <section className="py-20" style={{ background: 'linear-gradient(135deg, var(--primary-dark, #142a45), var(--primary))' }}>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg opacity-80">We&apos;re here to help</p>
        </div>
      </section>
      <section className="py-16 max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border p-8" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Send us a message</h2>
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✅</div>
                <p className="font-bold" style={{ color: 'var(--foreground)' }}>Message sent!</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <input type="text" placeholder="Your Name" required className="w-full px-4 py-3 rounded-xl border text-sm" style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                <input type="email" placeholder="Your Email" required className="w-full px-4 py-3 rounded-xl border text-sm" style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                <textarea rows={4} placeholder="Your Message" required className="w-full px-4 py-3 rounded-xl border text-sm resize-none" style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                <button type="submit" className="w-full py-3 rounded-xl text-white font-bold" style={{ background: 'var(--primary)' }}>Send Message</button>
              </form>
            )}
          </div>
          <div className="space-y-6">
            {[
              { icon: '📧', title: 'Email', value: 'support@parkpro.com' },
              { icon: '📞', title: 'Phone', value: '+44 20 7946 0958' },
              { icon: '📍', title: 'Address', value: 'Airport Parking Complex, Terminal Road, London, UK' },
              { icon: '⏰', title: 'Hours', value: 'Open 24/7, 365 days a year' },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border p-5 flex items-start gap-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
