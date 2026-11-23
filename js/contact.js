// Enquiry form on the contact page. It is a plain HTML form that posts to
// big5.drelijah.org, which redirects back here with ?sent=1 or ?error=….
// A completed profile stays in sessionStorage until the visitor opts in.
// Only then are share_type, type_code and type_detail added to this submit.
// type_result_id is added in that same case, and only when this browser
// already holds a result number for this completion.
(function () {
  const form = document.getElementById("enquiry-form");
  if (!form) return;
  const params = new URLSearchParams(window.location.search);

  form.elements.from.value = window.location.pathname.slice(0, 200);
  form.elements.started.value = String(Date.now());

  const sent = document.getElementById("enquiry-sent");
  const error = document.getElementById("enquiry-error");
  if (params.get("sent") === "1") {
    sent.hidden = false;
    form.hidden = true;
  } else if (params.get("error")) {
    error.textContent =
      params.get("error") === "server"
        ? "Something went wrong on our side. Please email elijah@drelijah.org."
        : "Please check the form and try again.";
    error.hidden = false;
  }

  const sitekey = form.getAttribute("data-turnstile-sitekey");
  if (sitekey) {
    const widget = document.createElement("div");
    widget.className = "cf-turnstile";
    widget.setAttribute("data-sitekey", sitekey);
    form.querySelector("[data-turnstile-slot]").appendChild(widget);
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  const shareBox = document.getElementById("share-type");
  const optIn = document.getElementById("share-type-opt-in");
  const codeEl = document.getElementById("share-type-code");
  const detailEl = document.getElementById("share-type-detail");
  const noneEl = document.getElementById("share-type-none");

  function currentResult() {
    if (typeof storedProfile !== "function" || typeof ITEMS === "undefined") return null;
    try {
      return storedProfile(sessionStorage.getItem("types-answers"), ITEMS, profile);
    } catch (e) {
      return null;
    }
  }

  function showShare() {
    const result = currentResult();
    const detail = result ? typeDetail(result) : "";
    if (result && detail && shareBox) {
      if (codeEl) codeEl.textContent = result.type;
      if (detailEl) detailEl.textContent = detail;
      shareBox.hidden = false;
      if (noneEl) noneEl.hidden = true;
    } else {
      if (shareBox) shareBox.hidden = true;
      if (optIn) optIn.checked = false;
      if (noneEl) noneEl.hidden = false;
    }
  }

  // Hidden inputs exist only for a real opt-in. The checkbox itself has no
  // name, so an unticked or result-less form cannot submit share_type.
  function currentResultId() {
    if (typeof readIssuedResultId !== "function") return "";
    try {
      return readIssuedResultId(sessionStorage, sessionStorage.getItem("types-answers"));
    } catch (e) {
      return "";
    }
  }

  function applySharePayload() {
    form.querySelectorAll("[data-share-field]").forEach(function (input) {
      input.remove();
    });
    if (typeof shareFields !== "function") return;
    const fields = shareFields(
      Boolean(optIn && optIn.checked),
      currentResult(),
      currentResultId()
    );
    Object.keys(fields).forEach(function (name) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = fields[name];
      input.setAttribute("data-share-field", "");
      form.appendChild(input);
    });
  }

  showShare();
  if (optIn) optIn.addEventListener("change", applySharePayload);

  const button = form.querySelector('button[type="submit"]');
  form.addEventListener("submit", function () {
    applySharePayload();
    button.disabled = true;
    button.textContent = "Sending…";
  });
  // Re-enable the button if the visitor comes back via the Back button.
  window.addEventListener("pageshow", function (event) {
    button.disabled = false;
    button.textContent = "Send the enquiry";
    if (event.persisted) {
      showShare();
      applySharePayload();
    }
  });
})();
