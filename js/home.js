/* ============================================================
   HOME.JS — Home page only
   1. Pricing signal: fills [data-plan-price] / [data-plan-duration]
      from HOME_PLANS so the homepage never shows a stale price.
      HOME_PLANS mirrors the PLANS config in js/checkout.js —
      if a price or duration changes there, change it here too.
   2. Sticky mobile "Get Started" button: visible from the first
      paint (CSS shows it by default on phones, so it is there
      even before this script runs). This file only hides it
      again while the final CTA is on screen, so the same action
      is never offered twice. Desktop is unaffected (hidden in CSS).
   ============================================================ */

(function () {
  "use strict";

  /* ----------------------------------------------------------
     1. PRICING SIGNAL
     Keep in sync with js/checkout.js -> PLANS.
     ---------------------------------------------------------- */
  var HOME_PLANS = {
    base: { price: "$499 CAD", duration: "60 Days" },
    standard: { price: "$799 CAD", duration: "120 Days" },
    premium: { price: "$999 CAD", duration: "180 Days" }
  };

  function fillPlanFacts() {
    document.querySelectorAll("[data-plan-price]").forEach(function (el) {
      var plan = HOME_PLANS[el.getAttribute("data-plan-price")];
      if (plan) el.textContent = plan.price;
    });
    document.querySelectorAll("[data-plan-duration]").forEach(function (el) {
      var plan = HOME_PLANS[el.getAttribute("data-plan-duration")];
      if (plan) el.textContent = plan.duration;
    });
  }

  /* ----------------------------------------------------------
     2. STICKY MOBILE CTA
     Shown from load. One observer on the final CTA: while that
     section is on screen the bar slides away (.is-hidden) so it
     doesn't duplicate the same button. If IntersectionObserver
     is unavailable, the bar simply stays visible — which is the
     safe default.
     ---------------------------------------------------------- */
  function initStickyCta() {
    var sticky = document.getElementById("sticky-cta");
    if (!sticky) return;

    var link = sticky.querySelector("a");

    function setVisible(show) {
      sticky.classList.toggle("is-hidden", !show);
      sticky.setAttribute("aria-hidden", String(!show));
      if (link) link.setAttribute("tabindex", show ? "0" : "-1");
    }

    /* Available immediately — no scrolling required. */
    setVisible(true);

    var finalCta = document.getElementById("final-cta");
    if (!finalCta || !("IntersectionObserver" in window)) return;

    new IntersectionObserver(function (entries) {
      setVisible(!entries[0].isIntersecting);
    }, { threshold: 0.15 }).observe(finalCta);
  }

  document.addEventListener("DOMContentLoaded", function () {
    fillPlanFacts();
    initStickyCta();
  });
})();
