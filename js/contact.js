// Enquiry form on the contact page. It is a plain HTML form that posts to
// big5.drelijah.org, which redirects back here with ?sent=1 or ?error=….
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

  const button = form.querySelector('button[type="submit"]');
  form.addEventListener("submit", function () {
    button.disabled = true;
    button.textContent = "Sending…";
  });
  // Re-enable the button if the visitor comes back via the Back button.
  window.addEventListener("pageshow", function () {
    button.disabled = false;
    button.textContent = "Send the enquiry";
  });
})();
