'use client';

import { useState } from 'react';

const faqs = [
  { q: 'How do I book a parking space?', a: 'Simply visit our booking page, enter your drop-off and pick-up dates, fill in your personal and vehicle details, and confirm your booking. You\'ll receive an instant confirmation with your tracking number.' },
  { q: 'Do I need to create an account?', a: 'No! We\'ve made it simple — no account needed. Just book and go. You\'ll get a tracking number to manage your booking.' },
  { q: 'How is the price calculated?', a: 'Our pricing is based on an hourly rate. We offer multi-day discounts: 5+ days (10% off), 10+ days (20% off), and 15+ days (30% off). No hidden fees.' },
  { q: 'Can I track my booking?', a: 'Yes! Use your unique tracking number on our Track Booking page to check your booking status, slot number, and time remaining at any time.' },
  { q: 'What happens if I pick up my car late?', a: 'If you exceed your booked time, overtime charges apply at the standard hourly rate (no discounts). The total will be recalculated when you collect your car.' },
  { q: 'Is the car park secure?', a: 'Absolutely. Our facility has 24/7 CCTV surveillance, security patrols, and controlled access. Your vehicle is in safe hands.' },
  { q: 'Can I cancel or modify my booking?', a: 'Please contact our support team with your tracking number and we\'ll be happy to assist with any changes or cancellations.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards. Payment is processed securely at the time of booking.' },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <section className="py-20" style={{ background: 'linear-gradient(135deg, var(--primary-dark, #142a45), var(--primary))' }}>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg opacity-80">Find answers to common questions</p>
        </div>
      </section>
      <section className="py-16 max-w-3xl mx-auto px-4">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left px-6 py-4 flex justify-between items-center font-medium"
                style={{ color: 'var(--foreground)' }}
              >
                {faq.q}
                <span className="text-xl transition-transform" style={{ transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 text-sm leading-relaxed animate-fade-in" style={{ color: 'var(--muted-foreground)' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
