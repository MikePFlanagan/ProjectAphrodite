import { CharacterGrid } from '@/components/characters/CharacterGrid';
import { EmptyState } from '@/components/characters/EmptyState';
import { db } from '@aphrodite/database';
import { requireUser } from '@/lib/require-auth';
export default async function FavoritesPage() { const user = await requireUser(); const favorites = await db.favorite.findMany({ where: { userId: user.id }, include: { character: true }, orderBy: { createdAt: 'desc' } }); return <div><p className="text-xs font-semibold tracking-[0.18em] text-fuchsia-200/70">YOUR COLLECTION</p><h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">Favorites</h1><div className="mt-10">{favorites.length ? <CharacterGrid characters={favorites.map(({ character }) => character)} /> : <EmptyState title="Nothing saved yet" copy="When a companion feels like a fit, save them here for later." />}</div></div>; }
