/* Chris Gnanadurai — Portfolio
   Plain vanilla JS. No build step, no dependencies. */

(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Sticky header background on scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Work grid tag filter ---------- */
  var filterRow = document.querySelector("[data-filter-row]");
  if (filterRow) {
    var cards = document.querySelectorAll("[data-tags]");
    var chips = filterRow.querySelectorAll(".filter-chip");

    var applyFilter = function (tag) {
      cards.forEach(function (card) {
        var tags = (card.getAttribute("data-tags") || "").toLowerCase();
        var isArchived = tags.indexOf("archive") !== -1;
        var show;
        if (tag === "all") {
          /* Archived case studies are hidden from the default "All work" view. */
          show = !isArchived;
        } else {
          show = tags.indexOf(tag.toLowerCase()) !== -1;
        }
        card.closest("[data-card-wrap]").style.display = show ? "" : "none";
      });
    };

    /* Apply on load so archived cards stay hidden under the default "All work" chip. */
    applyFilter("all");

    filterRow.addEventListener("click", function (event) {
      var chip = event.target.closest(".filter-chip");
      if (!chip) return;

      chips.forEach(function (c) {
        c.classList.remove("is-active");
      });
      chip.classList.add("is-active");

      applyFilter(chip.getAttribute("data-filter"));
    });
  }

  /* ---------- Before/after compare sliders ---------- */
  document.querySelectorAll(".compare-slider").forEach(function (slider) {
    var frame = slider.querySelector(".compare-slider-frame");
    var range = slider.querySelector(".compare-slider-range");
    if (!frame || !range) return;

    var setPos = function (pct) {
      pct = Math.max(0, Math.min(100, pct));
      frame.style.setProperty("--pos", pct + "%");
      range.value = pct;
    };

    var setPosFromClientX = function (clientX) {
      var rect = frame.getBoundingClientRect();
      setPos(((clientX - rect.left) / rect.width) * 100);
    };

    /* The range input stays pointer-events:none (see CSS) so it only
       handles keyboard input; the frame itself drives mouse/touch
       dragging via pointer capture, which tracks reliably even when
       the cursor moves faster than the resulting layout update. */
    var dragging = false;
    frame.addEventListener("pointerdown", function (event) {
      dragging = true;
      setPosFromClientX(event.clientX);
      try {
        frame.setPointerCapture(event.pointerId);
      } catch (err) {
        /* Capture is a nice-to-have for tracking fast drags outside the
           frame; if it's unavailable, plain pointermove still works. */
      }
      event.preventDefault();
    });
    frame.addEventListener("pointermove", function (event) {
      if (!dragging) return;
      setPosFromClientX(event.clientX);
      event.preventDefault();
    });
    frame.addEventListener("pointerup", function () {
      dragging = false;
    });
    frame.addEventListener("pointercancel", function () {
      dragging = false;
    });

    range.addEventListener("input", function () {
      frame.style.setProperty("--pos", range.value + "%");
    });
  });
})();
