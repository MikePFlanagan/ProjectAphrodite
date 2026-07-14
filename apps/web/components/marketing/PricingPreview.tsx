'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
  { name: 'Free', price: '$0', copy: 'Begin with one personal companion.', items: ['1 companion', 'Core memory', 'Text conversations'], featured: false },
  { name: 'Premium', price: '$19', copy: 'For deeper, more expressive connection.', items: ['Unlimited companions', 'Expanded memory', 'Voice conversations', 'Image creation'], featured: true },
  { name: 'Creator', price: '$49', copy: 'For people crafting worlds for others.', items: ['Everything in Premium', 'Character publishing', 'Creator analytics', 'Priority access'], featured: false },
];

export function PricingPreview() {
  return <section id="pricing" className="px-6 py-20 sm:px-10 sm:py-28"><div className="mx-auto max-w-7xl"><div className="text-center"><p className="text-xs font-semibold tracking-[0.18em] text-fuchsia-200/70">SIMPLE BY DESIGN</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">Choose your way in.</h2><p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/50">Start thoughtfully. Upgrade only when the experience calls for more.</p></div><div className="mx-auto mt-12 grid max-w-5xl gap-4 lg:grid-cols-3">{plans.map((plan, index) => <motion.article key={plan.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className={`rounded-3xl border p-6 ${plan.featured ? 'border-fuchsia-300/50 bg-gradient-to-b from-fuchsia-300/15 to-white/[0.045] shadow-[0_0_50px_rgba(206,109,255,0.12)]' : 'border-white/10 bg-white/[0.035]'}`}><p className="text-sm font-medium text-white">{plan.name}</p><p className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-white">{plan.price}<span className="ml-1 text-sm font-normal tracking-normal text-white/40">/ month</span></p><p className="mt-4 min-h-12 text-sm leading-6 text-white/50">{plan.copy}</p><ul className="mt-7 space-y-3">{plan.items.map((item) => <li key={item} className="flex items-center gap-2.5 text-sm text-white/70"><span className="grid size-5 place-items-center rounded-full bg-fuchsia-200/10 text-fuchsia-200"><Check className="size-3" /></span>{item}</li>)}</ul><a href="/signup" className={`mt-8 block rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition ${plan.featured ? 'bg-white text-[#170d20] hover:bg-fuchsia-100' : 'border border-white/15 bg-white/[0.045] text-white hover:bg-white/10'}`}>Get started</a></motion.article>)}</div></div></section>;
}
