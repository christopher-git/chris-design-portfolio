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
    filterRow.addEventListener("click", function (event) {
      var chip = event.target.closest(".filter-chip");
      if (!chip) return;

      chips.forEach(function (c) {
        c.classList.remove("is-active");
      });
      chip.classList.add("is-active");

      var tag = chip.getAttribute("data-filter");
      cards.forEach(function (card) {
        var tags = (card.getAttribute("data-tags") || "").toLowerCase();
        var show = tag === "all" || tags.indexOf(tag.toLowerCase()) !== -1;
        card.closest("[data-card-wrap]").style.display = show ? "" : "none";
      });
    });
  }
})();
