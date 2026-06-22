/* ============================================================
   NAVIGATION.JS
   Mobile hamburger menu: open/close, accessibility, and
   close-on-interaction. Desktop nav needs no JS.
   ============================================================ */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");

    if (!toggle || !links) return;

    function setOpen(isOpen) {
      links.classList.toggle("open", isOpen);
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    }

    /* Toggle on hamburger click */
    toggle.addEventListener("click", function () {
      var willOpen = !links.classList.contains("open");
      setOpen(willOpen);
    });

    /* Close when a link is tapped (single-page-feel on mobile) */
    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    /* Close on Escape key */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    /* Reset menu state if the viewport grows back to desktop */
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) setOpen(false);
    });
  });
})();
