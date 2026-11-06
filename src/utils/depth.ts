/**
 * Depth & motion calculations for Maison Vell
 */

export const KX = [1.2, 0.744, 0.496, 0.346, 0.235, 0.15, 0.085];
export const KF = [1.14, 0.89, 0.777, 0.704, 0.651, 0.616, 0.59];
export const KH = [1.18, 0.832, 0.574, 0.436, 0.334, 0.258, 0.19];
export const KB = [0, 0, 1.5, 4, 8, 12, 17];
export const KO = [1, 1, 1, 1, 0.86, 0.5, 0];

export const wrap = (x: number, n: number): number => ((x % n) + n) % n;

export const clamp = (x: number, a: number, b: number): number =>
  Math.min(b, Math.max(a, x));

export interface DepthProperties {
  depth: number;
  heightRatio: number;
  centerXRatio: number;
  feetYRatio: number;
  blurPx: number;
  opacity: number;
  zIndex: number;
}

export function computeDepthProperties(
  modelIndex: number,
  p: number,
  totalModels: number = 6
): DepthProperties {
  let d = wrap(modelIndex - p, totalModels);
  if (d > totalModels - 1) d -= totalModels;

  const k = clamp(d + 1, 0, 6);
  const a = Math.floor(k);
  const b = Math.min(6, a + 1);
  const t = k - a;
  const mix = (A: readonly number[]) => A[a] + (A[b] - A[a]) * t;

  return {
    depth: d,
    centerXRatio: mix(KX),
    feetYRatio: mix(KF),
    heightRatio: mix(KH),
    blurPx: mix(KB),
    opacity: mix(KO),
    zIndex: 100 - Math.round(d * 10),
  };
}

export function computeCardPosition(
  cardIndex: number,
  p: number,
  cardSize: number,
  totalCards: number = 12
): number {
  const all = cardSize * totalCards;
  let y = wrap(cardIndex * cardSize - p * 2 * cardSize, all);
  if (y > all - cardSize) y -= all;
  return y;
}

export function computeRollOffset(
  p: number,
  lineHeight: number,
  totalLooks: number = 6
): number {
  const offset = -wrap(p, totalLooks) * lineHeight;
  return offset === 0 ? 0 : offset;
}
