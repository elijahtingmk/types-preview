const assert = require("assert");
const { ITEMS } = require("../js/items.js");
const {
  profile,
  scaleSum,
  answersFromPattern,
  allRatings
} = require("../js/score.js");

assert.strictEqual(ITEMS.length, 40);
assert.ok(ITEMS.every((item) => item.scale !== 4));
assert.deepStrictEqual(
  ITEMS.map((item) => item.id),
  [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 25, 26, 27, 28, 30, 31, 32, 33, 35, 36, 37, 38, 40, 41, 42, 43, 45, 46, 47, 48, 50]
);

// Fixture A: all-max on the four scales → ENFJ, scores 50, not balanced
const a = answersFromPattern(ITEMS, {
  1: { plus: 5, minus: 1 },
  5: { plus: 5, minus: 1 },
  2: { plus: 5, minus: 1 },
  3: { plus: 5, minus: 1 }
});
const pa = profile(ITEMS, a);
assert.strictEqual(pa.type, "ENFJ");
assert.strictEqual(pa.balancedCount, 0);
pa.pairs.forEach((p) => {
  assert.strictEqual(p.score, 50);
  assert.strictEqual(p.clarity, 100);
  assert.strictEqual(p.balanced, false);
});

// Fixture B: all-min → ISTP, scores 10
const b = answersFromPattern(ITEMS, {
  1: { plus: 1, minus: 5 },
  5: { plus: 1, minus: 5 },
  2: { plus: 1, minus: 5 },
  3: { plus: 1, minus: 5 }
});
const pb = profile(ITEMS, b);
assert.strictEqual(pb.type, "ISTP");
assert.strictEqual(pb.balancedCount, 0);
pb.pairs.forEach((p) => {
  assert.strictEqual(p.score, 10);
  assert.strictEqual(p.clarity, 100);
});

// Fixture C: all midpoints → ISTP letters, all balanced
const c = allRatings(ITEMS, 3);
const pc = profile(ITEMS, c);
assert.strictEqual(pc.type, "ISTP");
assert.strictEqual(pc.balancedCount, 4);
pc.pairs.forEach((p) => {
  assert.strictEqual(p.score, 30);
  assert.strictEqual(p.balanced, true);
  assert.strictEqual(p.clarity, 0);
});

// Fixture D: Extraversion max, other scales at midpoint → ESTP, S/T/P balanced
const d = answersFromPattern(ITEMS, {
  1: { plus: 5, minus: 1 },
  5: { plus: 3, minus: 3 },
  2: { plus: 3, minus: 3 },
  3: { plus: 3, minus: 3 }
});
const pd = profile(ITEMS, d);
assert.strictEqual(scaleSum(ITEMS, d, 1), 50);
assert.strictEqual(pd.type, "ESTP");
assert.strictEqual(pd.balancedCount, 3);
assert.strictEqual(pd.pairs[0].letter, "E");
assert.strictEqual(pd.pairs[0].balanced, false);
assert.ok(pd.pairs.slice(1).every((p) => p.balanced));

console.log("All scoring fixtures passed.");
