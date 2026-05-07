'use client';

import PageHero from "@/components/shared/PageHero";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <PageHero 
        title="Privacy Policy" 
        subtitle="How we collect, use, and protect your information"
      />

      <section className="py-16 max-w-4xl mx-auto px-4 space-y-10">

        {/* Section */}
        <div className="rounded-2xl border p-6 card-hover hover-border-pop">
          <h2 className="text-xl font-bold mb-4">1. Information We Collect</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Personal details such as name, email address, and phone number.</li>
            <li>• Booking information including dates, locations, and preferences.</li>
            <li>• Vehicle details provided during booking.</li>
            <li>• Payment information processed through secure third-party providers.</li>
          </ul>
        </div>

        {/* Section */}
        <div className="rounded-2xl border p-6 card-hover hover-border-pop">
          <h2 className="text-xl font-bold mb-4">2. How We Use Your Information</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• To process and manage your bookings.</li>
            <li>• To communicate updates regarding your service.</li>
            <li>• To provide customer support.</li>
            <li>• To improve our services and user experience.</li>
          </ul>
        </div>

        {/* Section */}
        <div className="rounded-2xl border p-6 card-hover hover-border-pop">
          <h2 className="text-xl font-bold mb-4">3. Sharing of Information</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• With payment processors to complete transactions.</li>
            <li>• With partner or affiliated service providers where required.</li>
            <li>• When required by law or legal authorities.</li>
          </ul>
        </div>

        {/* Section */}
        <div className="rounded-2xl border p-6 card-hover hover-border-pop">
          <h2 className="text-xl font-bold mb-4">4. Data Security</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• We implement reasonable security measures to protect your data.</li>
            <li>• However, no online system is completely secure.</li>
          </ul>
        </div>

        {/* Section */}
        <div className="rounded-2xl border p-6 card-hover hover-border-pop">
          <h2 className="text-xl font-bold mb-4">5. Data Retention</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Your data is retained only as long as necessary for service and legal purposes.</li>
          </ul>
        </div>

        {/* Section */}
        <div className="rounded-2xl border p-6 card-hover hover-border-pop">
          <h2 className="text-xl font-bold mb-4">6. Your Rights</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• You may request access to your personal data.</li>
            <li>• You may request corrections or deletion of your data.</li>
            <li>• You may contact us for any privacy-related concerns.</li>
          </ul>
        </div>

        {/* Section */}
        <div className="rounded-2xl border p-6 card-hover hover-border-pop">
          <h2 className="text-xl font-bold mb-4">7. Cookies</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• We may use cookies to enhance user experience.</li>
            <li>• Cookies help us analyze usage and improve functionality.</li>
          </ul>
        </div>

        {/* Section */}
        <div className="rounded-2xl border p-6 card-hover hover-border-pop">
          <h2 className="text-xl font-bold mb-4">8. Contact Information</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• For privacy-related inquiries, please contact us via email or phone.</li>
          </ul>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-center text-muted-foreground mt-10">
          This Privacy Policy outlines how ParkPro Parking Limited handles your personal data.
        </p>

      </section>
    </div>
  );
}