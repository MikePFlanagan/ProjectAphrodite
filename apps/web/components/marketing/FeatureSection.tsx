'use client';

import { motion } from 'framer-motion';
import { History, Palette, Sparkles, BrainCircuit } from 'lucide-react';

const features = [
  {
    icon: BrainCircuit,
    label: 'Memory',
    copy: 'Conversations that carry context forward, so every exchange feels continuous.',
  },
  {
    icon: Sparkles,
    label: 'Personality',
    copy: 'Define tone, values, interests, and the small details that make a character feel distinct.',
  },
  {
    icon: History,
    label: 'Conversation History',
    copy: 'Return to saved conversations and continue where you left off.',
  },
  {
    icon: Palette,
    label: 'Creator Studio',
    copy: 'Shape a companion’s identity, personality, and visual direction in one workspace.',
  },
];

export function FeatureSection() {
  return (
    <section className="px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-fuchsia-200/70">
            DESIGNED FOR DEPTH
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            A companion shaped around your world.
          </h2>
        </div>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.08 }}
                className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.025] p-5 backdrop-blur-sm transition hover:-translate-y-1 hover:border-fuchsia-300/25"
              >
                <div className="grid size-10 place-items-center rounded-xl bg-fuchsia-300/10 text-fuchsia-200">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-10 text-lg font-medium tracking-tight text-white">
                  {feature.label}
                </h3>
                <p className="text-white/48 mt-2 text-sm leading-6">{feature.copy}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
