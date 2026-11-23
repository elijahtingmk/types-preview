// Optional type-result fields for the enquiry form. Nothing here is sent on
// its own: contact.js adds the fields only when the visitor opts in and a
// completed profile is already in this browser.

function storedProfile(raw, items, scoreProfile) {
  if (!raw || !items || typeof scoreProfile !== "function") return null;
  let answers;
  try {
    answers = JSON.parse(raw);
  } catch (e) {
    return null;
  }
  if (!answers || typeof answers !== "object") return null;
  try {
    if (items.some(function (item) { return !answers[item.id]; })) return null;
    return scoreProfile(items, answers);
  } catch (e) {
    return null;
  }
}

function typeDetail(result) {
  if (!result || !Array.isArray(result.pairs) || result.pairs.length !== 4) return "";
  const text = result.pairs
    .map(function (p) {
      const pair = p.lowLetter + "/" + p.highLetter;
      if (p.balanced) return pair + " " + p.score + " evenly balanced";
      return (
        pair +
        " " +
        p.score +
        " " +
        p.label +
        ", " +
        p.clarity +
        "% from the midpoint"
      );
    })
    .join("; ");
  return text.length > 480 ? text.slice(0, 480) : text;
}

function shareResultId(id) {
  if (typeof id !== "string") return "";
  const value = id.trim().toLowerCase();
  return /^[0-9a-f]{24}$/.test(value) ? value : "";
}

function shareFields(optedIn, result, resultId) {
  if (!optedIn || !result || typeof result.type !== "string") return {};
  if (!/^[EI][NS][TF][JP]$/.test(result.type)) return {};
  const detail = typeDetail(result);
  if (!detail || detail.length > 500) return {};
  const fields = {
    share_type: "1",
    type_code: result.type,
    type_detail: detail
  };
  // Only an opt-in reaches this point. A result number from this browser is
  // attached then, and only then, so an unticked box cannot link the person.
  const serial = shareResultId(resultId);
  if (serial) fields.type_result_id = serial;
  return fields;
}

if (typeof module !== "undefined") {
  module.exports = { storedProfile, typeDetail, shareFields, shareResultId };
}
