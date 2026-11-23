(function () {
  const raw = sessionStorage.getItem("types-answers");
  let answers = null;
  try {
    answers = raw ? JSON.parse(raw) : null;
  } catch (e) {
    answers = null;
  }
  if (!answers || ITEMS.some(function (item) { return !answers[item.id]; })) {
    location.replace("test.html");
    return;
  }

  const result = profile(ITEMS, answers);
  document.getElementById("type-letters").textContent = result.type;
  document.title = result.type + " · 16-type personality profile | Dr Elijah Ting, ED – L&D";

  const note = document.getElementById("balance-note");
  if (result.balancedCount > 0) note.hidden = false;

  const pairsEl = document.getElementById("pairs");
  pairsEl.innerHTML = result.pairs
    .map(function (p) {
      // Map score 10–50 onto 0–100% of the track. Midpoint (30) is 50%.
      const left = ((p.score - 10) / 40) * 100;
      const meta = p.balanced
        ? "Evenly balanced · score " + p.score
        : p.label + " · score " + p.score + " · " + p.clarity + "% from the midpoint";
      return (
        '<div class="pair">' +
        '<div class="pair-top"><span class="name">' +
        p.lowLetter +
        " / " +
        p.highLetter +
        (p.balanced ? " · evenly balanced" : "") +
        '</span><span class="meta">' +
        meta +
        "</span></div>" +
        '<div class="track"><span class="marker" style="left:' +
        left +
        '%"></span></div>' +
        '<div class="ends"><span>' +
        p.lowLetter +
        " · " +
        p.lowName +
        "</span><span>" +
        p.highLetter +
        " · " +
        p.highName +
        "</span></div></div>"
      );
    })
    .join("");

  const paras = BLURBS[result.type] || [];
  document.getElementById("blurb").innerHTML = paras.map(function (p) {
    return "<p>" + p + "</p>";
  }).join("");

  const serial = document.getElementById("result-serial");
  const serialId = document.getElementById("result-serial-id");
  const serialNote = document.getElementById("result-serial-note");

  function showSerial(kind, id) {
    if (!serial || !serialNote) return;
    serial.hidden = false;
    if (serialId) {
      serialId.hidden = kind !== "ready";
      serialId.textContent = kind === "ready" ? id : "";
    }
    serialNote.textContent =
      kind === "ready"
        ? "If you contact Dr Elijah Ting, you can quote this number."
        : kind === "pending"
          ? "Issuing a result number."
          : "A result number could not be issued. The type above is still your result.";
  }

  try {
    const detail = typeof typeDetail === "function" ? typeDetail(result) : "";
    const issued =
      typeof readIssuedResultId === "function"
        ? readIssuedResultId(sessionStorage, raw)
        : "";
    if (issued) {
      showSerial("ready", issued);
    } else if (typeof saveCompletedType !== "function" || typeof window.fetch !== "function") {
      showSerial("failed");
    } else {
      showSerial("pending");
      saveCompletedType({
        answersRaw: raw,
        typeCode: result.type,
        detail: detail,
        storage: sessionStorage,
        fetch: window.fetch.bind(window)
      }).then(
        function (outcome) {
          if (outcome && outcome.id) showSerial("ready", outcome.id);
          else showSerial("failed");
        },
        function () {
          showSerial("failed");
        }
      );
    }
  } catch (e) {
    showSerial("failed");
  }
})();
