import type { ContentCharacterContext, ContentDNA, Scene } from './types';

export interface TransformInput {
  contentDna: ContentDNA;
  character: ContentCharacterContext;
  objective: string;
  platform: string;
  constraints?: string;
}

export interface OriginalContentConcept {
  title: string;
  concept: string;
  hook: string;
  script: string;
  scenePlan: Scene[];
  caption: string;
  hashtags: string[];
  estimatedDuration: number;
  generationPrompt: string;
  negativePrompt: string;
  platform: string;
  objective: string;
  originalityNotes: string;
  borrowedElements: string[];
}

export function transformToOriginalConcept(input: TransformInput): OriginalContentConcept {
  const { contentDna, character, objective, platform, constraints } = input;

  const archetype = contentDna.archetype ?? 'lifestyle';
  const hookType = contentDna.hook?.hookType ?? 'curiosity';
  const duration = contentDna.pacing?.duration ?? 15;

  const borrowed: string[] = [];
  if (contentDna.hook?.hookType) borrowed.push(`Hook style: ${contentDna.hook.hookType}`);
  if (contentDna.pacing?.duration)
    borrowed.push(`Target duration: ~${contentDna.pacing.duration}s`);
  if (contentDna.narrative?.loopBehavior)
    borrowed.push(`Loop behavior: ${contentDna.narrative.loopBehavior}`);
  if (contentDna.archetype) borrowed.push(`Content archetype: ${contentDna.archetype}`);

  const title = `${character.name}: ${archetype} ${hookType} — ${platform}`;
  const concept =
    `A ${duration}-second ${archetype} piece featuring ${character.name} (${character.tagline}). ` +
    `Uses a ${hookType} opening adapted to ${character.name}'s personality and visual style. ` +
    (objective ? `Objective: ${objective}. ` : '') +
    (constraints ? `Constraints: ${constraints}. ` : '');

  const hook = `Open with ${character.name} in a ${hookType}-style hook that leverages their ${character.traits[0] ?? 'unique'} persona.`;

  const scenePlan: Scene[] = [
    {
      sceneNumber: 1,
      startTime: 0,
      endTime: Math.min(2, duration * 0.15),
      purpose: 'Hook',
      shotType: contentDna.cinematography?.shotTypes?.[0] ?? 'close-up',
      subjectAction: `${character.name} captures attention with ${hookType} opener`,
      generationPrompt: `${character.name}, ${hookType} opening, engaging, ${character.category} aesthetic`,
    },
    {
      sceneNumber: 2,
      startTime: Math.min(2, duration * 0.15),
      endTime: duration * 0.6,
      purpose: 'Development',
      shotType: 'medium',
      subjectAction: `${character.name} develops the core content aligned with ${objective}`,
      generationPrompt: `${character.name}, ${archetype} content, ${platform} optimized`,
    },
    {
      sceneNumber: 3,
      startTime: duration * 0.6,
      endTime: duration,
      purpose: 'Payoff / CTA',
      shotType: 'medium-close',
      subjectAction: `${character.name} delivers payoff and call-to-action`,
      generationPrompt: `${character.name}, satisfying conclusion, ${archetype}`,
    },
  ];

  const script = scenePlan
    .map(
      (s) =>
        `[Scene ${s.sceneNumber} | ${s.startTime.toFixed(1)}s–${s.endTime.toFixed(1)}s | ${s.purpose}]\n${s.subjectAction}`,
    )
    .join('\n\n');

  const caption = `${character.name} brings you something special ✨ ${objective ? `#${objective.replace(/\s+/g, '')}` : ''}`;

  const hashtags = [
    character.name.toLowerCase().replace(/\s+/g, ''),
    archetype,
    platform.replace('-', ''),
    'aphrodite',
  ];

  const generationPrompt =
    `Create a ${duration}-second ${archetype} video featuring ${character.name}. ` +
    `Style: ${character.category}. Personality: ${character.traits.join(', ')}. ` +
    `${hookType} hook opening. ${platform} optimized.`;

  const negativePrompt =
    "Do not reproduce copyrighted material, watermarks, logos, or another creator's identity. " +
    'Do not copy verbatim dialogue or distinctive protected creative elements.';

  const originalityNotes =
    `Structural elements adapted from reference analysis: ${borrowed.join('; ')}. ` +
    `Character-specific adaptations: persona traits (${character.traits.join(', ')}), ` +
    `${character.category} visual aesthetic, and ${character.name}'s communication style ` +
    `were applied to make the concept original.`;

  return {
    title,
    concept,
    hook,
    script,
    scenePlan,
    caption,
    hashtags,
    estimatedDuration: duration,
    generationPrompt,
    negativePrompt,
    platform,
    objective,
    originalityNotes,
    borrowedElements: borrowed,
  };
}
