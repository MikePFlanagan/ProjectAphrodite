import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { transformToOriginalConcept } from './originality-transformer';
import type { ContentCharacterContext, ContentDNA } from './types';

const character: ContentCharacterContext = {
  id: 'test-char-id',
  name: 'Ava',
  tagline: 'A bold content creator',
  description: 'Charismatic and creative.',
  avatarUrl: 'from-pink-300 to-violet-500',
  category: 'LIFESTYLE',
  traits: ['confident', 'creative', 'bold'],
  personality: { warmth: 80, humor: 65, confidence: 90 },
  personalityPrompt: 'Confident and creative.',
};

describe('transformToOriginalConcept', () => {
  it('produces a concept with required fields', () => {
    const dna: ContentDNA = {
      hook: { hookType: 'curiosity' },
      pacing: { duration: 12 },
      archetype: 'reveal',
    };
    const result = transformToOriginalConcept({
      contentDna: dna,
      character,
      objective: 'grow engagement',
      platform: 'tiktok',
    });

    assert.ok(result.title.includes('Ava'));
    assert.ok(result.concept.length > 0);
    assert.ok(result.hook.length > 0);
    assert.ok(result.script.length > 0);
    assert.ok(result.scenePlan.length >= 2);
    assert.ok(result.generationPrompt.length > 0);
    assert.equal(result.platform, 'tiktok');
    assert.equal(result.objective, 'grow engagement');
    assert.equal(result.estimatedDuration, 12);
  });

  it('includes borrowed elements from content DNA', () => {
    const dna: ContentDNA = {
      hook: { hookType: 'curiosity' },
      pacing: { duration: 15 },
      archetype: 'transformation',
    };
    const result = transformToOriginalConcept({
      contentDna: dna,
      character,
      objective: 'grow followers',
      platform: 'instagram-reels',
    });

    assert.ok(result.borrowedElements.length > 0);
    assert.ok(result.originalityNotes.length > 0);
    assert.ok(result.originalityNotes.includes('Structural elements'));
  });

  it('does not copy verbatim content in generation prompts', () => {
    const result = transformToOriginalConcept({
      contentDna: {},
      character,
      objective: 'test',
      platform: 'tiktok',
    });

    assert.ok(result.negativePrompt.includes('Do not reproduce copyrighted'));
    assert.ok(result.negativePrompt.includes('watermarks'));
  });

  it('generates valid scene plan with timeline', () => {
    const result = transformToOriginalConcept({
      contentDna: { pacing: { duration: 20 } },
      character,
      objective: 'engagement',
      platform: 'youtube-shorts',
    });

    for (const scene of result.scenePlan) {
      assert.ok(scene.sceneNumber > 0);
      assert.ok(scene.startTime >= 0);
      assert.ok(scene.endTime > scene.startTime);
      assert.ok(scene.purpose.length > 0);
    }

    assert.equal(result.scenePlan[0]!.purpose, 'Hook');
    assert.equal(result.scenePlan[result.scenePlan.length - 1]!.purpose, 'Payoff / CTA');
  });

  it('handles empty content DNA gracefully', () => {
    const result = transformToOriginalConcept({
      contentDna: {},
      character,
      objective: 'test',
      platform: 'tiktok',
    });

    assert.ok(result.title.length > 0);
    assert.ok(result.scenePlan.length >= 2);
    assert.equal(result.estimatedDuration, 15);
  });
});
