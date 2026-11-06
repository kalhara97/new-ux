import test from 'node:test';
import assert from 'node:assert/strict';
import {
  wrap,
  clamp,
  computeDepthProperties,
  computeCardPosition,
  computeRollOffset,
  KX,
  KF,
  KH,
  KB,
  KO,
} from './depth';

test('wrap function handles positive, zero, and negative values', () => {
  assert.equal(wrap(0, 6), 0);
  assert.equal(wrap(5, 6), 5);
  assert.equal(wrap(6, 6), 0);
  assert.equal(wrap(7, 6), 1);
  assert.equal(wrap(-1, 6), 5);
  assert.equal(wrap(-6, 6), 0);
  assert.equal(wrap(-7, 6), 5);
});

test('clamp function restricts values within bounds', () => {
  assert.equal(clamp(5, 0, 6), 5);
  assert.equal(clamp(-1, 0, 6), 0);
  assert.equal(clamp(10, 0, 6), 6);
  assert.equal(clamp(0, 0, 6), 0);
  assert.equal(clamp(6, 0, 6), 6);
});

test('depth properties at integer depths match lookup tables exactly', () => {
  // Test depth 0 (front model when p = 0 and index = 0)
  const front = computeDepthProperties(0, 0);
  assert.equal(front.depth, 0);
  assert.equal(front.centerXRatio, KX[1]);
  assert.equal(front.feetYRatio, KF[1]);
  assert.equal(front.heightRatio, KH[1]);
  assert.equal(front.blurPx, KB[1]);
  assert.equal(front.opacity, KO[1]);
  assert.equal(front.zIndex, 100);

  // Test depth 1 (second model)
  const second = computeDepthProperties(1, 0);
  assert.equal(second.depth, 1);
  assert.equal(second.centerXRatio, KX[2]);
  assert.equal(second.feetYRatio, KF[2]);
  assert.equal(second.heightRatio, KH[2]);
  assert.equal(second.blurPx, KB[2]);
  assert.equal(second.opacity, KO[2]);
  assert.equal(second.zIndex, 90);

  // Test depth 5 (furthest model)
  const furthest = computeDepthProperties(5, 0);
  assert.equal(furthest.depth, 5);
  assert.equal(furthest.centerXRatio, KX[6]);
  assert.equal(furthest.feetYRatio, KF[6]);
  assert.equal(furthest.heightRatio, KH[6]);
  assert.equal(furthest.blurPx, KB[6]);
  assert.equal(furthest.opacity, KO[6]);
  assert.equal(furthest.zIndex, 50);
});

test('card positions align with 2 pieces per look', () => {
  const cardS = 200;
  // When p = 0, first card of look 0 (index 0) is at 0
  assert.equal(computeCardPosition(0, 0, cardS), 0);
  // Second card of look 0 (index 1) is at 200
  assert.equal(computeCardPosition(1, 0, cardS), cardS);

  // When p moves to 1 (one full look forward), look 1 moves to the front (0 and cardS)
  assert.equal(computeCardPosition(2, 1, cardS), 0);
  assert.equal(computeCardPosition(3, 1, cardS), cardS);
});

test('roll offset slides numbers smoothly', () => {
  const lineHeight = 38;
  assert.equal(computeRollOffset(0, lineHeight), 0);
  assert.equal(computeRollOffset(1, lineHeight), -38);
  assert.equal(computeRollOffset(5.5, lineHeight), -5.5 * 38);
});
