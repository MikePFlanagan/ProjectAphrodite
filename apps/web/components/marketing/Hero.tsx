'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pb-20 pt-40 sm:px-10 sm:pb-28 sm:pt-48">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_18%,rgba(173,70,255,0.22),transparent_25rem),radial-gradient(circle_at_18%_60%,rgba(239,89,170,0.17),transparent_28rem)]" />
      <div className="pointer-events-none absolute right-[-8rem] top-28 -z-10 size-[30rem] rounded-full border border-fuchsia-300/10" />
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 rounded-full border border-fuchsia-200/15 bg-fuchsia-200/5 px-3 py-1.5 text-xs font-medium text-fuchsia-100/85"><Sparkles className="size-3.5" /> A more personal kind of AI</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.06 }} className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.96] tracking-[-0.065em] text-white sm:text-7xl lg:text-8xl">
          Create AI companions that <span className="bg-gradient-to-r from-fuchsia-300 via-rose-200 to-violet-300 bg-clip-text text-transparent">remember you.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.14 }} className="mt-7 max-w-xl text-base leading-7 text-white/60 sm:text-lg">Build meaningful conversations with personalized AI characters.</motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22 }} className="mt-9 flex flex-wrap gap-3">
          <a id="create" href="#pricing" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#170d20] transition hover:bg-fuchsia-100">Start creating <ArrowRight className="size-4" /></a>
          <a href="#characters" className="rounded-xl border border-white/15 bg-white/[0.045] px-5 py-3 text-sm font-semibold text-white/80 backdrop-blur transition hover:bg-white/10 hover:text-white">Explore characters</a>
        </motion.div>
      </div>
    </section>
  );
}
