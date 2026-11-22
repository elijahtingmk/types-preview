const MID = 30;
const RANGE_HALF = 20;

const LETTERS = {
  1: { high: "E", low: "I", highName: "Extraversion", lowName: "Introversion" },
  5: { high: "N", low: "S", highName: "Intuition", lowName: "Sensing" },
  2: { high: "F", low: "T", highName: "Feeling", lowName: "Thinking" },
  3: { high: "J", low: "P", highName: "Judging", lowName: "Perceiving" }
};

const SCALE_ORDER = [1, 5, 2, 3];

function itemScore(rating, key) {
  const n = Number(rating);
  if (!Number.isInteger(n) || n < 1 || n > 5) {
    throw new Error("Each answer must be an integer from 1 to 5");
  }
  return key === 1 ? n : 6 - n;
}

function scaleSum(items, answers, scale) {
  const rows = items.filter((item) => item.scale === scale);
  if (rows.length !== 10) {
    throw new Error("Each scale must have 10 items");
  }
  return rows.reduce((sum, item) => {
    const rating = answers[item.id];
    if (rating == null) throw new Error("Missing answer for item " + item.id);
    return sum + itemScore(rating, item.key);
  }, 0);
}

function pairFromScore(scale, score) {
  const letters = LETTERS[scale];
  const balanced = score === MID;
  const letter = score > MID ? letters.high : letters.low;
  const clarity = Math.min(100, Math.round((Math.abs(score - MID) / RANGE_HALF) * 100));
  const side = score > MID ? "high" : score < MID ? "low" : "mid";
  return {
    scale,
    score,
    letter,
    balanced,
    clarity,
    side,
    highLetter: letters.high,
    lowLetter: letters.low,
    highName: letters.highName,
    lowName: letters.lowName,
    label: balanced
      ? letters.lowName + " / " + letters.highName
      : score > MID
        ? letters.highName
        : letters.lowName
  };
}

function profile(items, answers) {
  const pairs = SCALE_ORDER.map((scale) =>
    pairFromScore(scale, scaleSum(items, answers, scale))
  );
  const type = pairs.map((p) => p.letter).join("");
  const balancedCount = pairs.filter((p) => p.balanced).length;
  return { type, pairs, balancedCount };
}

function answersFromPattern(items, pattern) {
  const answers = {};
  for (const item of items) {
    const p = pattern[item.scale];
    answers[item.id] = item.key === 1 ? p.plus : p.minus;
  }
  return answers;
}

function allRatings(items, rating) {
  const answers = {};
  for (const item of items) answers[item.id] = rating;
  return answers;
}

if (typeof module !== "undefined") {
  module.exports = {
    MID,
    LETTERS,
    SCALE_ORDER,
    itemScore,
    scaleSum,
    pairFromScore,
    profile,
    answersFromPattern,
    allRatings
  };
}
