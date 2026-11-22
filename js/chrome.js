(function () {
  const year = new Date().getFullYear();
  const path = (location.pathname.split("/").pop() || "index.html");

  const banner = document.getElementById("preview-banner");
  if (banner) {
    banner.className = "preview-banner";
    banner.innerHTML =
      "<strong>Preview</strong> — this is not the live site. Nothing here has been published to types.drelijah.org yet.";
  }

  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML =
      '<div class="wrap header-inner">' +
      '<a class="brand" href="index.html">' +
      '<span class="brand-name">16-type personality profile</span>' +
      '<span class="brand-by">Dr Elijah Ting, ED – L&amp;D</span>' +
      "</a>" +
      '<nav class="nav" aria-label="Primary">' +
      '<a href="index.html" data-nav="index.html">Home</a>' +
      '<a href="about.html" data-nav="about.html">How it is read</a>' +
      '<a href="privacy.html" data-nav="privacy.html">Privacy</a>' +
      "</nav></div>";
    header.querySelectorAll("[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === path) a.setAttribute("aria-current", "page");
    });
  }

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.innerHTML =
      '<div class="wrap">' +
      '<div class="footer-grid">' +
      "<div><h2>Dr Elijah Ting, ED – L&amp;D</h2>" +
      '<p><a href="mailto:elijah@drelijah.org">elijah@drelijah.org</a> · ' +
      '<a href="https://www.linkedin.com/in/drelijah/" rel="noopener me" target="_blank">LinkedIn</a></p></div>' +
      "<div><h2>This profile</h2><ul>" +
      '<li><a href="index.html">Home</a></li>' +
      '<li><a href="test.html">Start the profile</a></li>' +
      '<li><a href="about.html">How it is read</a></li>' +
      '<li><a href="privacy.html">Privacy</a></li>' +
      '<li><a href="contact.html">Book a scoping call</a></li>' +
      "</ul></div>" +
      "<div><h2>The practice</h2><ul>" +
      '<li><a href="https://big5.drelijah.org">Big Five assessment</a></li>' +
      '<li><a href="https://drelijah.org">drelijah.org</a></li>' +
      "</ul></div></div>" +
      '<div class="copyright">© ' + year + " Dr Elijah Ting, ED – L&amp;D</div>" +
      '<p class="credential">Dr Elijah Ting holds an Executive Doctorate in Learning and Development (ED – L&amp;D), a professional doctorate from East Bridge University, a private university in Paris.</p>' +
      "</div>";
  }
})();
