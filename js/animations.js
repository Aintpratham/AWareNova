/* ============================================================
   ANIMATIONS.JS
   Scroll-reveal effects using IntersectionObserver.
   Add the class "reveal" to any element you want to fade up.

   MOBILE POLICY: on phones (<720px) the reveal is switched off
   entirely — every .reveal element is marked visible right away
   and no observer is created, so page content is rendered and
   readable on first paint without any scrolling. global.css
   neutralises the .reveal opacity/transform at the same
   breakpoint, so content is visible even if this file never
   runs. On larger screens the reveal is a subtle, non-blocking
   enhancement, and reduced-motion users always see everything
   immediately.
   ============================================================ */

(function () {
  "use strict";

  var MOBILE_MAX = 719; /* keep in sync with global.css */

  document.addEventListener("DOMContentLoaded", function () {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    function showAll() {
      items.forEach(function (el) {
        el.style.transitionDelay = "";
        el.classList.add("visible");
      });
    }

    var isMobile = window.matchMedia(
      "(max-width: " + MOBILE_MAX + "px)"
    ).matches;

    var prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* Mobile, reduced motion, or no IntersectionObserver support:
       show everything immediately and do no further work. */
    if (isMobile || prefersReduced || !("IntersectionObserver" in window)) {
      showAll();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target); /* reveal once, then stop */
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    /* Optional stagger: elements with data-delay get a small delay */
    items.forEach(function (el) {
      var delay = el.getAttribute("data-delay");
      if (delay) el.style.transitionDelay = delay + "ms";
      observer.observe(el);
    });

    /* Safety net: if anything above the fold never fires (odd
       viewport, restored scroll position), reveal the lot. */
    window.setTimeout(function () {
      var hidden = document.querySelectorAll(".reveal:not(.visible)");
      if (hidden.length === items.length) showAll();
    }, 1500);
  });
})();
