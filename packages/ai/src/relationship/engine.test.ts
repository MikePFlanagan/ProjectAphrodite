import assert from 'node:assert/strict';
import test from 'node:test';

import { evaluateRelationship, relationshipLabel, updateRelationship } from './engine';

const baseline = {
  trust: 50,
  comfort: 50,
  curiosity: 50,
  playfulness: 50,
  affection: 50,
  respect: 50,
};

test('positive interactions improve trust and respect', () => {
  const result = updateRelationship(baseline, evaluateRelationship('Thank you, that was helpful.'));
  assert.equal(result.trust, 52);
  assert.equal(result.respect, 52);
});

test('neutral questions increase curiosity without reducing trust', () => {
  const result = updateRelationship(baseline, evaluateRelationship('How does this work?'));
  assert.equal(result.curiosity, 52);
  assert.equal(result.trust, 50);
});

test('hostile interactions reduce scores and scores remain bounded', () => {
  const result = updateRelationship(
    { ...baseline, trust: 1, respect: 2 },
    evaluateRelationship('Shut up, idiot.'),
  );
  assert.equal(result.trust, 0);
  assert.equal(result.respect, 0);
});

test('relationship labels use stable score bands', () => {
  assert.equal(relationshipLabel(baseline), 'Acquainted');
  assert.equal(
    relationshipLabel({
      ...baseline,
      trust: 90,
      comfort: 90,
      curiosity: 90,
      playfulness: 90,
      affection: 90,
      respect: 90,
    }),
    'Close',
  );
});
