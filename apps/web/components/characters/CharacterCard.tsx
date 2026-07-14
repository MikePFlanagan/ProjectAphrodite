import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { CharacterAvatar } from './CharacterAvatar';
import { CharacterCategoryBadge } from './CharacterCategoryBadge';
type Character = { slug: string; name: string; tagline: string; avatarUrl: string; category: string; description?: string };
export function CharacterCard({ character }: { character: Character }) { return <Link href={`/characters/${character.slug}`} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:-translate-y-1 hover:border-fuchsia-200/35 hover:bg-white/[0.06]"><div className="flex items-start justify-between"><CharacterAvatar name={character.name} gradient={character.avatarUrl} /><ArrowUpRight className="size-4 text-white/35 transition group-hover:text-fuchsia-200" /></div><h3 className="mt-6 font-medium text-white">{character.name}</h3><p className="mt-1 text-sm text-white/48">{character.tagline}</p><div className="mt-4"><CharacterCategoryBadge category={character.category} /></div></Link>; }
