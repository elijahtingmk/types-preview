// Stores a completed 16-type profile under a result number.
// POST { type_code, type_detail? } to TYPES_RESULT_URL. The response is
// { id } with 24 hex characters. This request carries no name, email, or
// statement answers. The same completion in this browser session reuses the
// id already held in sessionStorage, so a refresh does not ask for another.

var TYPES_RESULT_URL = "https://big5.drelijah.org/api/types-result";
var TYPES_RESULT_STORAGE_KEY = "types-result";

function normaliseResultId(id) {
  if (typeof id !== "string") return "";
  var value = id.trim().toLowerCase();
  return /^[0-9a-f]{24}$/.test(value) ? value : "";
}

function completionKey(raw) {
  if (typeof raw !== "string" || !raw) return "";
  var answers;
  try {
    answers = JSON.parse(raw);
  } catch (e) {
    return "";
  }
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) return "";
  var keys = Object.keys(answers).sort(function (a, b) {
    return Number(a) - Number(b);
  });
  var ordered = {};
  for (var i = 0; i < keys.length; i++) ordered[keys[i]] = answers[keys[i]];
  return JSON.stringify(ordered);
}

function resultRequestBody(typeCode, detail) {
  if (typeof typeCode !== "string" || !/^[EI][NS][TF][JP]$/.test(typeCode)) return null;
  var body = { type_code: typeCode };
  if (typeof detail === "string") {
    var text = detail.trim();
    if (text && text.length <= 500) body.type_detail = text;
  }
  return body;
}

function readIdMap(storage) {
  if (!storage || typeof storage.getItem !== "function") return {};
  var raw;
  try {
    raw = storage.getItem(TYPES_RESULT_STORAGE_KEY);
  } catch (e) {
    return {};
  }
  if (!raw) return {};
  try {
    var parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.ids !== "object" || !parsed.ids || Array.isArray(parsed.ids)) {
      return {};
    }
    return parsed.ids;
  } catch (e) {
    return {};
  }
}

function readIssuedResultId(storage, answersRaw) {
  var key = completionKey(answersRaw);
  if (!key) return "";
  return normaliseResultId(readIdMap(storage)[key]);
}

function rememberResultId(storage, answersRaw, id) {
  var key = completionKey(answersRaw);
  var serial = normaliseResultId(id);
  if (!key || !serial || !storage || typeof storage.setItem !== "function") return false;
  var ids = readIdMap(storage);
  ids[key] = serial;
  try {
    storage.setItem(TYPES_RESULT_STORAGE_KEY, JSON.stringify({ ids: ids }));
    return true;
  } catch (e) {
    return false;
  }
}

function typesResultInflightMap() {
  if (!typesResultInflightMap.map) typesResultInflightMap.map = Object.create(null);
  return typesResultInflightMap.map;
}

function resetResultSaveInflight() {
  typesResultInflightMap.map = Object.create(null);
}

function issueResult(options) {
  var body = resultRequestBody(options.typeCode, options.detail);
  if (!body) return Promise.resolve({ id: "", failed: true });
  var endpoint = options.endpoint || TYPES_RESULT_URL;
  var fetchImpl = options.fetch;
  if (typeof fetchImpl !== "function") return Promise.resolve({ id: "", failed: true });

  return Promise.resolve()
    .then(function () {
      return fetchImpl(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(body),
        credentials: "omit",
        cache: "no-store"
      });
    })
    .then(
      function (response) {
        if (!response || !response.ok || typeof response.json !== "function") {
          return { id: "", failed: true };
        }
        return response.json().then(
          function (data) {
            var id = normaliseResultId(data && data.id);
            if (!id) return { id: "", failed: true };
            rememberResultId(options.storage, options.answersRaw, id);
            return { id: id, reused: false };
          },
          function () {
            return { id: "", failed: true };
          }
        );
      },
      function () {
        return { id: "", failed: true };
      }
    );
}

function saveCompletedType(options) {
  options = options || {};
  var answersRaw = options.answersRaw;
  var key = completionKey(answersRaw);
  var existing = readIssuedResultId(options.storage, answersRaw);
  if (existing) return Promise.resolve({ id: existing, reused: true });

  var inflight = typesResultInflightMap();
  if (key && Object.prototype.hasOwnProperty.call(inflight, key)) return inflight[key];

  var promise = issueResult(options).then(
    function (outcome) {
      return outcome;
    },
    function () {
      return { id: "", failed: true };
    }
  );

  if (key) {
    inflight[key] = promise;
    var clear = function () {
      delete inflight[key];
    };
    promise.then(clear, clear);
  }
  return promise;
}

if (typeof module !== "undefined") {
  module.exports = {
    TYPES_RESULT_URL: TYPES_RESULT_URL,
    TYPES_RESULT_STORAGE_KEY: TYPES_RESULT_STORAGE_KEY,
    normaliseResultId: normaliseResultId,
    completionKey: completionKey,
    resultRequestBody: resultRequestBody,
    readIssuedResultId: readIssuedResultId,
    rememberResultId: rememberResultId,
    resetResultSaveInflight: resetResultSaveInflight,
    saveCompletedType: saveCompletedType
  };
}
