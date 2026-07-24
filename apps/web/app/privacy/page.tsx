import type { Metadata } from 'next';
import Link from 'next/link';

import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'How Project Aphrodite handles account and conversation data.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0c0910] px-6 py-16 text-white sm:px-10">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-fuchsia-200/75 transition hover:text-fuchsia-100">
          ← Back to Aphrodite
        </Link>
        <h1 className="mt-10 text-4xl font-semibold tracking-[-0.05em]">Privacy Policy</h1>
        <p className="mt-3 text-sm text-white/40">Last updated July 24, 2026</p>
        <div className="mt-10 space-y-8 text-sm leading-7 text-white/65">
          <Section title="What we collect">
            We store the account details you provide, the companions and settings you create,
            conversation content, memories you choose to save, favorites, and subscription status.
            Payment card details are handled by Stripe and are not stored by Aphrodite.
          </Section>
          <Section title="How we use information">
            We use this information to operate and secure the service, provide personalized
            conversations, enforce usage limits, process subscriptions, and improve reliability.
            Conversation content may be sent to the configured AI provider to generate replies.
          </Section>
          <Section title="Data sharing">
            We share information only with service providers needed to run Aphrodite, such as
            hosting, database, AI, authentication, and payment providers, or when required by law.
            We do not sell personal information.
          </Section>
          <Section title="Retention and control">
            Conversations and account data remain stored while your account is active unless you
            delete supported records or request account deletion. You should not submit highly
            sensitive information. Service operators may retain limited records when required for
            security, fraud prevention, legal compliance, or billing.
          </Section>
          <Section title="Security and age">
            We use reasonable safeguards, but no online service can guarantee absolute security.
            Aphrodite is intended only for users who are at least 18 years old.
          </Section>
          <Section title="Contact">
            Questions or deletion requests can be directed to the service operator through the
            contact method published with the production deployment.
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
