/* Chris Gnanadurai · Portfolio
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

  /* ---------- Nav link active-state highlighting ---------- */
  var navLists = document.querySelectorAll(".primary-nav, .mobile-nav");
  if (navLists.length) {
    var clearActive = function () {
      navLists.forEach(function (list) {
        list.querySelectorAll("a").forEach(function (a) {
          a.classList.remove("is-active");
        });
      });
    };

    var setActiveByHash = function (hash) {
      navLists.forEach(function (list) {
        list.querySelectorAll("a").forEach(function (link) {
          var linkHash = "#" + (link.href.split("#")[1] || "");
          link.classList.toggle("is-active", linkHash === hash);
        });
      });
    };

    /* Only sync from the URL hash when one is actually present, so the
       hardcoded "Work" highlight on case study pages (no hash) is left alone. */
    if (window.location.hash) {
      setActiveByHash(window.location.hash);
    }
    window.addEventListener("hashchange", function () {
      setActiveByHash(window.location.hash);
    });

    navLists.forEach(function (list) {
      list.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          var href = link.getAttribute("href");
          clearActive();
          document.querySelectorAll('.primary-nav a, .mobile-nav a').forEach(function (a) {
            if (a.getAttribute("href") === href) {
              a.classList.add("is-active");
            }
          });
        });
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

    /* Apply on load so the grid opens on the curated "Featured" set by default. */
    applyFilter("Featured");

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

  /* ---------- Photo lightbox ---------- */
  var triggers = document.querySelectorAll("[data-lightbox-src]");
  if (triggers.length) {
    var overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close">' +
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "</button>" +
      '<button type="button" class="lightbox-arrow lightbox-prev" aria-label="Previous image">' +
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "</button>" +
      '<img src="" alt="">' +
      '<button type="button" class="lightbox-arrow lightbox-next" aria-label="Next image">' +
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "</button>";
    document.body.appendChild(overlay);
    var overlayImg = overlay.querySelector("img");
    var closeBtn = overlay.querySelector(".lightbox-close");
    var prevBtn = overlay.querySelector(".lightbox-prev");
    var nextBtn = overlay.querySelector(".lightbox-next");

    var gallery = [];
    var galleryIndex = -1;

    var showIndex = function (index) {
      galleryIndex = (index + gallery.length) % gallery.length;
      var trigger = gallery[galleryIndex];
      overlayImg.src = trigger.getAttribute("data-lightbox-src");
      overlayImg.alt = trigger.getAttribute("data-lightbox-alt") || "";
    };
    var openLightbox = function (trigger) {
      var group = trigger.closest("[data-lightbox-group], .photo-grid") || document;
      gallery = Array.prototype.slice.call(group.querySelectorAll("[data-lightbox-src]"));
      var hasMultiple = gallery.length > 1;
      prevBtn.style.display = hasMultiple ? "" : "none";
      nextBtn.style.display = hasMultiple ? "" : "none";
      showIndex(gallery.indexOf(trigger));
      overlay.classList.add("is-open");
    };
    var closeLightbox = function () {
      overlay.classList.remove("is-open");
      overlayImg.src = "";
      gallery = [];
      galleryIndex = -1;
    };

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        openLightbox(trigger);
      });
    });
    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", function () {
      showIndex(galleryIndex - 1);
    });
    nextBtn.addEventListener("click", function () {
      showIndex(galleryIndex + 1);
    });
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) closeLightbox();
    });
    document.addEventListener("keydown", function (event) {
      if (!overlay.classList.contains("is-open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showIndex(galleryIndex - 1);
      if (event.key === "ArrowRight") showIndex(galleryIndex + 1);
    });
  }

  /* ---------- Off the clock tabs ---------- */
  var offclockTabs = document.querySelector("[data-offclock-tabs]");
  if (offclockTabs) {
    var offclockTabButtons = offclockTabs.querySelectorAll(".offclock-tab");
    var offclockPanels = document.querySelectorAll("[data-offclock-panel]");

    var showOffclockPanel = function (key) {
      offclockPanels.forEach(function (panel) {
        panel.classList.toggle("is-active", panel.getAttribute("data-offclock-panel") === key);
      });
      offclockTabButtons.forEach(function (btn) {
        btn.classList.toggle("is-active", btn.getAttribute("data-offclock-tab") === key);
      });
    };

    offclockTabs.addEventListener("click", function (event) {
      var btn = event.target.closest(".offclock-tab");
      if (!btn) return;
      showOffclockPanel(btn.getAttribute("data-offclock-tab"));
    });

    showOffclockPanel(offclockTabButtons[0].getAttribute("data-offclock-tab"));
  }
})();
