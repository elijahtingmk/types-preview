const assert = require("assert");
const http = require("http");
const { ITEMS } = require("../js/items.js");
const { profile, answersFromPattern } = require("../js/score.js");
const { typeDetail } = require("../js/share.js");
const {
  TYPES_RESULT_URL,
  TYPES_RESULT_STORAGE_KEY,
  completionKey,
  resultRequestBody,
  readIssuedResultId,
  resetResultSaveInflight,
  saveCompletedType
} = require("../js/result-save.js");

const SERIAL = "58a70606a835c400c8b38e84";
const SERIAL_B = "abcdef0123456789abcdef01";

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
const enfjResult = profile(ITEMS, enfj);
const enfjRaw = JSON.stringify(enfj);
const istpRaw = JSON.stringify(istp);
const enfjDetail = typeDetail(enfjResult);

const realFetch = global.fetch;
let productionAttempts = 0;

function hostOf(url) {
  try {
    return new URL(String(url)).hostname.toLowerCase();
  } catch (e) {
    return "";
  }
}

function isProductionHost(hostname) {
  return hostname === "drelijah.org" || hostname.endsWith(".drelijah.org");
}

// Tests never open a socket to the practice. A drelijah.org URL throws here.
global.fetch = function (url, init) {
  const host = hostOf(url);
  if (isProductionHost(host)) {
    productionAttempts += 1;
    throw new Error("Blocked production request to " + host);
  }
  return realFetch(url, init);
};

function memoryStorage() {
  const data = {};
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
    },
    setItem(key, value) {
      data[key] = String(value);
    }
  };
}

function jsonResponse(status, payload) {
  return {
    ok: status >= 200 && status < 300,
    status: status,
    json: function () {
      return Promise.resolve(payload);
    }
  };
}

function assertBody(parsed) {
  assert.deepStrictEqual(Object.keys(parsed).sort(), ["type_code", "type_detail"]);
  assert.strictEqual(parsed.type_code, "ENFJ");
  assert.strictEqual(parsed.type_detail, enfjDetail);
  assert.ok(parsed.type_detail.length < 500);
  const serialised = JSON.stringify(parsed);
  assert.ok(!serialised.includes("elijah@"));
  assert.ok(!Object.prototype.hasOwnProperty.call(parsed, "name"));
  assert.ok(!Object.prototype.hasOwnProperty.call(parsed, "email"));
  assert.ok(!Object.prototype.hasOwnProperty.call(parsed, "answers"));
  assert.ok(!serialised.includes("Am the life of the party"));
}

function listen(server) {
  return new Promise(function (resolve) {
    server.listen(0, "127.0.0.1", function () {
      resolve(server.address().port);
    });
  });
}

function startStub(respond) {
  const requests = [];
  const server = http.createServer(function (req, res) {
    const chunks = [];
    req.on("data", function (chunk) {
      chunks.push(chunk);
    });
    req.on("end", function () {
      const raw = Buffer.concat(chunks).toString("utf8");
      let json = null;
      try {
        json = JSON.parse(raw);
      } catch (e) {
        json = null;
      }
      const record = {
        method: req.method,
        url: req.url,
        host: req.headers.host,
        contentType: req.headers["content-type"],
        json: json
      };
      requests.push(record);
      respond(record, res);
    });
  });
  return listen(server).then(function (port) {
    return {
      port: port,
      requests: requests,
      server: server,
      url: "http://127.0.0.1:" + port + "/api/types-result"
    };
  });
}

function close(server) {
  return new Promise(function (resolve) {
    server.close(resolve);
  });
}

async function main() {
  resetResultSaveInflight();
  assert.strictEqual(TYPES_RESULT_URL, "https://big5.drelijah.org/api/types-result");
  assert.strictEqual(isProductionHost(hostOf(TYPES_RESULT_URL)), true);
  assert.strictEqual(completionKey(enfjRaw), completionKey(JSON.stringify(enfj)));
  assert.notStrictEqual(completionKey(enfjRaw), completionKey(istpRaw));

  const body = resultRequestBody("ENFJ", enfjDetail);
  assertBody(body);
  assert.strictEqual(resultRequestBody("NOPE", enfjDetail), null);
  const codeOnly = resultRequestBody("ENFJ", "");
  assert.deepStrictEqual(codeOnly, { type_code: "ENFJ" });
  const longDetail = resultRequestBody("ENFJ", "x".repeat(501));
  assert.deepStrictEqual(longDetail, { type_code: "ENFJ" });

  const storage = memoryStorage();
  let posts = 0;
  const outcome = await saveCompletedType({
    answersRaw: enfjRaw,
    typeCode: enfjResult.type,
    detail: enfjDetail,
    storage: storage,
    fetch: function (url, init) {
      posts += 1;
      assert.strictEqual(String(url), TYPES_RESULT_URL);
      assert.strictEqual(init.method, "POST");
      assert.strictEqual(init.credentials, "omit");
      assert.strictEqual(init.headers["Content-Type"], "application/json");
      assertBody(JSON.parse(init.body));
      return Promise.resolve(jsonResponse(200, { id: "58A70606A835C400C8B38E84" }));
    }
  });
  assert.strictEqual(posts, 1);
  assert.strictEqual(outcome.id, SERIAL);
  assert.strictEqual(outcome.reused, false);
  assert.strictEqual(readIssuedResultId(storage, enfjRaw), SERIAL);
  assert.strictEqual(readIssuedResultId(storage, istpRaw), "");

  const again = await saveCompletedType({
    answersRaw: enfjRaw,
    typeCode: enfjResult.type,
    detail: enfjDetail,
    storage: storage,
    fetch: function () {
      posts += 1;
      throw new Error("A second serial must not be requested");
    }
  });
  assert.strictEqual(posts, 1);
  assert.strictEqual(again.id, SERIAL);
  assert.strictEqual(again.reused, true);

  const reordered = JSON.stringify(JSON.parse(enfjRaw));
  const sameCompletion = await saveCompletedType({
    answersRaw: reordered,
    typeCode: "ENFJ",
    detail: enfjDetail,
    storage: storage,
    fetch: function () {
      throw new Error("Reordered answers are the same completion");
    }
  });
  assert.strictEqual(sameCompletion.id, SERIAL);
  assert.strictEqual(sameCompletion.reused, true);

  let secondPosts = 0;
  const changed = await saveCompletedType({
    answersRaw: istpRaw,
    typeCode: "ISTP",
    detail: typeDetail(profile(ITEMS, istp)),
    storage: storage,
    fetch: function (url, init) {
      secondPosts += 1;
      const parsed = JSON.parse(init.body);
      assert.strictEqual(parsed.type_code, "ISTP");
      assert.deepStrictEqual(Object.keys(parsed).sort(), ["type_code", "type_detail"]);
      return Promise.resolve(jsonResponse(200, { id: SERIAL_B }));
    }
  });
  assert.strictEqual(secondPosts, 1);
  assert.strictEqual(changed.id, SERIAL_B);
  assert.strictEqual(readIssuedResultId(storage, enfjRaw), SERIAL);
  assert.strictEqual(readIssuedResultId(storage, istpRaw), SERIAL_B);
  const stored = JSON.parse(storage.getItem(TYPES_RESULT_STORAGE_KEY));
  assert.strictEqual(Object.keys(stored.ids).length, 2);

  const failedStorage = memoryStorage();
  const failed = await saveCompletedType({
    answersRaw: enfjRaw,
    typeCode: "ENFJ",
    detail: enfjDetail,
    storage: failedStorage,
    fetch: function () {
      return Promise.resolve(jsonResponse(503, { id: SERIAL }));
    }
  });
  assert.strictEqual(failed.id, "");
  assert.strictEqual(failed.failed, true);
  assert.strictEqual(failedStorage.getItem(TYPES_RESULT_STORAGE_KEY), null);

  const badId = await saveCompletedType({
    answersRaw: enfjRaw,
    typeCode: "ENFJ",
    detail: enfjDetail,
    storage: failedStorage,
    fetch: function () {
      return Promise.resolve(jsonResponse(200, { id: "not-24-hex" }));
    }
  });
  assert.strictEqual(badId.failed, true);
  assert.strictEqual(failedStorage.getItem(TYPES_RESULT_STORAGE_KEY), null);

  const thrown = await saveCompletedType({
    answersRaw: enfjRaw,
    typeCode: "ENFJ",
    detail: enfjDetail,
    storage: failedStorage,
    fetch: function () {
      return Promise.reject(new Error("offline"));
    }
  });
  assert.strictEqual(thrown.failed, true);
  assert.strictEqual(readIssuedResultId(failedStorage, enfjRaw), "");

  const noFetch = await saveCompletedType({
    answersRaw: enfjRaw,
    typeCode: "ENFJ",
    detail: enfjDetail,
    storage: failedStorage
  });
  assert.strictEqual(noFetch.failed, true);

  resetResultSaveInflight();
  let concurrentPosts = 0;
  let release;
  const gate = new Promise(function (resolve) {
    release = resolve;
  });
  const concurrentStorage = memoryStorage();
  const first = saveCompletedType({
    answersRaw: enfjRaw,
    typeCode: "ENFJ",
    detail: enfjDetail,
    storage: concurrentStorage,
    fetch: function () {
      concurrentPosts += 1;
      return gate.then(function () {
        return jsonResponse(200, { id: SERIAL });
      });
    }
  });
  const second = saveCompletedType({
    answersRaw: enfjRaw,
    typeCode: "ENFJ",
    detail: enfjDetail,
    storage: concurrentStorage,
    fetch: function () {
      concurrentPosts += 1;
      throw new Error("in-flight completion must not post twice");
    }
  });
  await Promise.resolve();
  assert.strictEqual(concurrentPosts, 1);
  release();
  const pair = await Promise.all([first, second]);
  assert.strictEqual(pair[0].id, SERIAL);
  assert.strictEqual(pair[1].id, SERIAL);
  assert.strictEqual(readIssuedResultId(concurrentStorage, enfjRaw), SERIAL);

  const stub = await startStub(function (record, res) {
    assert.strictEqual(record.url, "/api/types-result");
    assert.strictEqual(record.method, "POST");
    assert.ok(String(record.host).startsWith("127.0.0.1:"));
    assert.ok(String(record.contentType).includes("application/json"));
    assertBody(record.json);
    const payload = JSON.stringify({ id: SERIAL });
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload)
    });
    res.end(payload);
  });
  try {
    assert.strictEqual(isProductionHost(hostOf(stub.url)), false);
    const stubStorage = memoryStorage();
    const saved = await saveCompletedType({
      answersRaw: enfjRaw,
      typeCode: enfjResult.type,
      detail: enfjDetail,
      storage: stubStorage,
      endpoint: stub.url,
      fetch: global.fetch
    });
    assert.strictEqual(saved.id, SERIAL);
    assert.strictEqual(stub.requests.length, 1);
    const reused = await saveCompletedType({
      answersRaw: enfjRaw,
      typeCode: enfjResult.type,
      detail: enfjDetail,
      storage: stubStorage,
      endpoint: stub.url,
      fetch: global.fetch
    });
    assert.strictEqual(reused.reused, true);
    assert.strictEqual(stub.requests.length, 1);
  } finally {
    await close(stub.server);
  }

  const failingStub = await startStub(function (record, res) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end('{"error":"no"}');
  });
  try {
    const stubStorage = memoryStorage();
    const saved = await saveCompletedType({
      answersRaw: enfjRaw,
      typeCode: "ENFJ",
      detail: enfjDetail,
      storage: stubStorage,
      endpoint: failingStub.url,
      fetch: global.fetch
    });
    assert.strictEqual(saved.failed, true);
    assert.strictEqual(stubStorage.getItem(TYPES_RESULT_STORAGE_KEY), null);
    assert.strictEqual(failingStub.requests.length, 1);
  } finally {
    await close(failingStub.server);
  }

  let liveSockets = 0;
  const refused = await saveCompletedType({
    answersRaw: enfjRaw,
    typeCode: "ENFJ",
    detail: enfjDetail,
    storage: memoryStorage(),
    fetch: function (url) {
      assert.strictEqual(String(url), TYPES_RESULT_URL);
      assert.strictEqual(isProductionHost(hostOf(url)), true);
      throw new Error("mock refused before any socket");
    }
  });
  assert.strictEqual(refused.failed, true);
  assert.strictEqual(liveSockets, 0);
  assert.strictEqual(productionAttempts, 0);

  console.log("All result-save fixtures passed. Production requests: " + productionAttempts);
}

main()
  .then(function () {
    global.fetch = realFetch;
  })
  .catch(function (error) {
    global.fetch = realFetch;
    console.error(error);
    process.exit(1);
  });
