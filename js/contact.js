(function () {
  const form = document.getElementById("enquiry-form");
  const ok = document.getElementById("enquiry-ok");
  if (!form) return;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    // Preview stub: do not send Telegram or email.
    ok.hidden = false;
    form.querySelectorAll("input, select, textarea, button").forEach(function (el) {
      if (el.type !== "hidden") el.disabled = true;
    });
  });
})();
