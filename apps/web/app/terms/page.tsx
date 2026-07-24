import type { Metadata } from 'next';
import Link from 'next/link';

import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Terms for using Project Aphrodite.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0c0910] px-6 py-16 text-white sm:px-10">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-fuchsia-200/75 transition hover:text-fuchsia-100">
          ← Back to Aphrodite
        </Link>
        <h1 className="mt-10 text-4xl font-semibold tracking-[-0.05em]">Terms of Service</h1>
        <p className="mt-3 text-sm text-white/40">Last updated July 24, 2026</p>
        <div className="mt-10 space-y-8 text-sm leading-7 text-white/65">
          <Section title="Using Aphrodite">
            You must be at least 18 years old and provide accurate account information. You are
            responsible for activity under your account and for keeping your credentials secure.
          </Section>
          <Section title="AI-generated content">
            Companions generate artificial content that may be inaccurate, unexpected, or
            inappropriate. Aphrodite is not a person, therapist, medical provider, lawyer, or
            financial adviser. Do not rely on generated content for professional or emergency
            decisions.
          </Section>
          <Section title="Acceptable use">
            Do not use the service to break the law, exploit or harm others, create sexual content
            involving minors, infringe rights, distribute malware, evade safeguards, or interfere
            with the service. Accounts may be restricted or removed for abuse.
          </Section>
          <Section title="Subscriptions">
            Paid plans renew until canceled. Prices and included usage are shown before checkout.
            You can manage or cancel a subscription through the billing portal. Except where law
            requires otherwise, charges for a completed billing period are non-refundable.
          </Section>
          <Section title="Your content">
            You retain ownership of content you submit. You grant Aphrodite the limited permission
            needed to host, process, and transmit it to operate the service. You must have the
            rights necessary to submit that content.
          </Section>
          <Section title="Availability and liability">
            The service is provided “as is” without a promise of uninterrupted availability.
            Features and limits may change. To the extent permitted by law, Aphrodite is not liable
            for indirect, incidental, special, or consequential damages arising from use.
          </Section>
          <Section title="Changes">
            These terms may be updated as the service evolves. Continued use after an update means
            you accept the revised terms.
          </Section>
        </div>
      </article>
      <div className="mx-auto mt-16 max-w-7xl">
        <Footer />
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2">{children}</p>
    </section>
  );
}
