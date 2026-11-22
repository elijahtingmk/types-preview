(function () {
  const PAGE_SIZE = 5;
  const OPTIONS = [
    { value: 1, label: "Very inaccurate" },
    { value: 2, label: "Moderately inaccurate" },
    { value: 3, label: "Neither" },
    { value: 4, label: "Moderately accurate" },
    { value: 5, label: "Very accurate" }
  ];

  const answers = {};
  const stored = sessionStorage.getItem("types-answers");
  if (stored) {
    try {
      Object.assign(answers, JSON.parse(stored));
    } catch (e) {}
  }

  let page = 0;
  const pages = Math.ceil(ITEMS.length / PAGE_SIZE);
  const itemsEl = document.getElementById("items");
  const backBtn = document.getElementById("back-btn");
  const nextBtn = document.getElementById("next-btn");

  function answeredCount() {
    return ITEMS.filter((item) => answers[item.id] >= 1 && answers[item.id] <= 5).length;
  }

  function pageComplete() {
    const start = page * PAGE_SIZE;
    return ITEMS.slice(start, start + PAGE_SIZE).every((item) => answers[item.id]);
  }

  function save() {
    sessionStorage.setItem("types-answers", JSON.stringify(answers));
  }

  function render() {
    const start = page * PAGE_SIZE;
    const slice = ITEMS.slice(start, start + PAGE_SIZE);
    const done = answeredCount();
    document.getElementById("progress-label").textContent =
      "Statements " + (start + 1) + "–" + (start + slice.length) + " of " + ITEMS.length;
    document.getElementById("progress-count").textContent = done + " answered";
    document.getElementById("progress-bar").style.width = (done / ITEMS.length) * 100 + "%";

    itemsEl.innerHTML = slice
      .map(function (item) {
        const name = "item-" + item.id;
        const options = OPTIONS.map(function (opt) {
          const checked = Number(answers[item.id]) === opt.value ? " checked" : "";
          return (
            '<label><input type="radio" name="' +
            name +
            '" value="' +
            opt.value +
            '"' +
            checked +
            "><span>" +
            opt.label +
            "</span></label>"
          );
        }).join("");
        return (
          '<fieldset class="item"><legend class="item-n">Statement ' +
          (ITEMS.indexOf(item) + 1) +
          " of " +
          ITEMS.length +
          "</legend><p class=\"item-text\">" +
          item.text +
          '</p><div class="scale">' +
          options +
          "</div></fieldset>"
        );
      })
      .join("");

    backBtn.disabled = page === 0;
    const last = page === pages - 1;
    nextBtn.textContent = last ? "See my profile" : "Next";
    nextBtn.disabled = last ? done < ITEMS.length : !pageComplete();
  }

  itemsEl.addEventListener("change", function (event) {
    const input = event.target;
    if (input.name && input.name.indexOf("item-") === 0) {
      answers[Number(input.name.slice(5))] = Number(input.value);
      save();
      const start = page * PAGE_SIZE;
      const last = page === pages - 1;
      const done = answeredCount();
      document.getElementById("progress-count").textContent = done + " answered";
      document.getElementById("progress-bar").style.width = (done / ITEMS.length) * 100 + "%";
      nextBtn.disabled = last ? done < ITEMS.length : !pageComplete();
    }
  });

  backBtn.addEventListener("click", function () {
    if (page > 0) {
      page -= 1;
      render();
      window.scrollTo(0, 0);
    }
  });

  nextBtn.addEventListener("click", function () {
    if (page < pages - 1) {
      if (!pageComplete()) return;
      page += 1;
      render();
      window.scrollTo(0, 0);
      return;
    }
    if (answeredCount() < ITEMS.length) return;
    save();
    location.href = "results.html";
  });

  render();
})();
