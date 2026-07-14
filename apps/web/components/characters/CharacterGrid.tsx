import { CharacterCard } from './CharacterCard';
export function CharacterGrid({ characters }: { characters: Parameters<typeof CharacterCard>[0]['character'][] }) { return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{characters.map((character) => <CharacterCard key={character.slug} character={character} />)}</div>; }
