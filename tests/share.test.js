const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { ITEMS } = require("../js/items.js");
const { profile, answersFromPattern, allRatings } = require("../js/score.js");
const { storedProfile, typeDetail, shareFields } = require("../js/share.js");

function rawFrom(answers) {
  return JSON.stringify(answers);
}

const enfj = answersFromPattern(ITEMS, {
  1: { plus: 5, minus: 1 },
  5: { plus: 5, minus: 1 },
  2: { plus: 5, minus: 1 },
  3: { plus: 5, minus: 1 }
});
const istp = answersFromPattern(ITEMS, {
  1: { plus: 1, minus: 5 },
  5: { plus: 1, minus: 5 },
  2: { plus: 1, minus: 5 },
  3: { plus: 1, minus: 5 }
});
const estp = answersFromPattern(ITEMS, {
  1: { plus: 5, minus: 1 },
  5: { plus: 3, minus: 3 },
  2: { plus: 3, minus: 3 },
  3: { plus: 3, minus: 3 }
});
const mid = allRatings(ITEMS, 3);

const enfjResult = profile(ITEMS, enfj);
assert.strictEqual(enfjResult.type, "ENFJ");
assert.deepStrictEqual(storedProfile(rawFrom(enfj), ITEMS, profile), enfjResult);
assert.strictEqual(storedProfile(null, ITEMS, profile), null);
assert.strictEqual(storedProfile("", ITEMS, profile), null);
assert.strictEqual(storedProfile("not-json", ITEMS, profile), null);
assert.strictEqual(storedProfile("[]", ITEMS, profile), null);
assert.strictEqual(storedProfile("null", ITEMS, profile), null);
assert.strictEqual(storedProfile(rawFrom(enfj), ITEMS, null), null);

const partial = Object.assign({}, enfj);
delete partial[ITEMS[0].id];
assert.strictEqual(storedProfile(rawFrom(partial), ITEMS, profile), null);

const bad = Object.assign({}, enfj);
bad[ITEMS[0].id] = 9;
assert.strictEqual(storedProfile(rawFrom(bad), ITEMS, profile), null);

assert.strictEqual(
  typeDetail(enfjResult),
  "I/E 50 Extraversion, 100% from the midpoint; S/N 50 Intuition, 100% from the midpoint; T/F 50 Feeling, 100% from the midpoint; P/J 50 Judging, 100% from the midpoint"
);
assert.strictEqual(
  typeDetail(profile(ITEMS, istp)),
  "I/E 10 Introversion, 100% from the midpoint; S/N 10 Sensing, 100% from the midpoint; T/F 10 Thinking, 100% from the midpoint; P/J 10 Perceiving, 100% from the midpoint"
);
assert.strictEqual(
  typeDetail(profile(ITEMS, mid)),
  "I/E 30 evenly balanced; S/N 30 evenly balanced; T/F 30 evenly balanced; P/J 30 evenly balanced"
);
assert.strictEqual(
  typeDetail(profile(ITEMS, estp)),
  "I/E 50 Extraversion, 100% from the midpoint; S/N 30 evenly balanced; T/F 30 evenly balanced; P/J 30 evenly balanced"
);

function assertOmitted(fields) {
  assert.deepStrictEqual(fields, {});
  assert.ok(!Object.prototype.hasOwnProperty.call(fields, "share_type"));
  assert.ok(!Object.prototype.hasOwnProperty.call(fields, "type_code"));
  assert.ok(!Object.prototype.hasOwnProperty.call(fields, "type_detail"));
}

assertOmitted(shareFields(false, enfjResult));
assertOmitted(shareFields(true, null));
assertOmitted(shareFields(true, storedProfile(rawFrom(partial), ITEMS, profile)));
assertOmitted(shareFields(true, { type: "NOPE", pairs: enfjResult.pairs }));
assertOmitted(shareFields(true, { type: "ENFJ", pairs: [] }));

const shared = shareFields(true, enfjResult);
assert.strictEqual(shared.share_type, "1");
assert.strictEqual(shared.type_code, "ENFJ");
assert.strictEqual(shared.type_detail, typeDetail(enfjResult));
assert.ok(shared.type_detail.length < 500);
assert.deepStrictEqual(Object.keys(shared).sort(), ["share_type", "type_code", "type_detail"]);
assert.ok(!shared.type_detail.includes("Am the life of the party"));
assert.ok(!JSON.stringify(shared).includes(JSON.stringify(enfj)));

const sharedMid = shareFields(true, storedProfile(rawFrom(mid), ITEMS, profile));
assert.strictEqual(sharedMid.type_code, "ISTP");
assert.ok(sharedMid.type_detail.includes("evenly balanced"));
assert.ok(sharedMid.type_detail.length < 500);

const root = path.join(__dirname, "..");
const contactHtml = fs.readFileSync(path.join(root, "contact.html"), "utf8");
const contactJs = fs.readFileSync(path.join(root, "js/contact.js"), "utf8");
const privacy = fs.readFileSync(path.join(root, "privacy.html"), "utf8");
const shareJs = fs.readFileSync(path.join(root, "js/share.js"), "utf8");
const bundle = [contactHtml, contactJs, privacy, shareJs].join("\n");

assert.ok(contactHtml.includes('action="https://big5.drelijah.org/api/enquiry"'));
assert.ok(contactHtml.includes('name="website"'));
assert.ok(contactHtml.includes('name="from"'));
assert.ok(contactHtml.includes('name="started"'));
assert.ok(contactHtml.includes("privacy.html"));
assert.ok(contactHtml.includes('id="enquiry-consent"'));
assert.ok(contactHtml.includes("Your contact details are used only to reply to you."));
assert.ok(contactHtml.includes("Your type result is stored only if you opt in to share it."));
assert.ok(!/mbti|myers-briggs/i.test(bundle));
assert.ok(!/fetch\s*\(|sendBeacon|XMLHttpRequest|navigator\.sendBeacon/.test(contactJs + shareJs));
assert.ok(contactJs.includes("shareFields"));
assert.ok(contactJs.includes("data-share-field"));
assert.ok(privacy.includes("second inbox used for practice administration"));
assert.ok(privacy.includes("Malaysia’s Personal Data Protection Act"));
assert.ok(privacy.includes("only if you tick that option"));
assert.strictEqual(fs.readFileSync(path.join(root, "CNAME"), "utf8").trim(), "types.drelijah.org");

console.log("All share fixtures passed.");
