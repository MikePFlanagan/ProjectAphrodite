import { db } from '@aphrodite/database';
export const publishedCharacters = () => db.character.findMany({ where: { isPublished: true }, orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }] });
export const characterBySlug = (slug: string) => db.character.findFirst({ where: { slug, isPublished: true } });
