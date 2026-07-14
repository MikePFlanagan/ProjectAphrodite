'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';

const characters = [
  { name: 'Lumen', role: 'The creative confidant', initial: 'L', palette: 'from-pink-300 via-fuchsia-500 to-violet-700', note: '“Tell me what you are trying to make.”' },
  { name: 'Sora', role: 'The calm perspective', initial: 'S', palette: 'from-cyan-200 via-blue-500 to-indigo-700', note: '“Let’s make room for the whole thought.”' },
  { name: 'Miro', role: 'The curious strategist', initial: 'M', palette: 'from-amber-200 via-orange-400 to-rose-600', note: '“What would make this feel effortless?”' },
];

export function CharacterShowcase() {
  return (
    <section id="characters" className="border-y border-white/10 bg-white/[0.018] px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div className="max-w-2xl"><p className="text-xs font-semibold tracking-[0.18em] text-fuchsia-200/70">MEET THE POSSIBILITY</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">No two companions should feel the same.</h2></div><p className="max-w-sm text-sm leading-6 text-white/50">Start from a spark, then shape a character&rsquo;s voice, memory, and point of view around what matters to you.</p></div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">{characters.map((character, index) => <motion.article key={character.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -6 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="overflow-hidden rounded-3xl border border-white/10 bg-[#17111d] shadow-2xl shadow-black/20"><div className={`relative flex h-56 items-end bg-gradient-to-br p-6 ${character.palette}`}><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_5%,rgba(255,255,255,0.56),transparent_28%)]" /><span className="relative grid size-24 place-items-center rounded-full border border-white/35 bg-black/10 text-5xl font-semibold tracking-[-0.08em] text-white/90 backdrop-blur">{character.initial}</span><span className="absolute right-5 top-5 rounded-full bg-black/15 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white/80">ORIGINAL</span></div><div className="p-6"><div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-medium tracking-tight text-white">{character.name}</h3><p className="mt-1 text-sm text-white/45">{character.role}</p></div><MessageCircle className="mt-1 size-4 text-fuchsia-200/75" /></div><p className="mt-8 text-sm italic leading-6 text-white/65">{character.note}</p><div className="mt-6 flex items-center gap-2 text-xs text-fuchsia-200/75"><Sparkles className="size-3.5" /> Personalized personality</div></div></motion.article>)}</div>
      </div>
    </section>
  );
}
