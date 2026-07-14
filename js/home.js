/* ============================================================
   HOME.JS — Home page only
   1. Pricing signal: fills [data-plan-price] / [data-plan-duration]
      from HOME_PLANS so the homepage never shows a stale price.
      HOME_PLANS mirrors the PLANS config in js/checkout.js —
      if a price or duration changes there, change it here too.
   2. Sticky mobile "Get Started" button: appears after the
      visitor scrolls past the hero, disappears once the final
      CTA is on screen. Desktop is unaffected (hidden in CSS).
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
     Two observers:
       - hero: while the hero is visible, the button stays hidden
       - final CTA: while it's visible, the button hides again
     If IntersectionObserver is unavailable, the button simply
     never shows — the page works exactly as before.
     ---------------------------------------------------------- */
  function initStickyCta() {
    var sticky = document.getElementById("sticky-cta");
    var hero = document.getElementById("hero");
    var finalCta = document.getElementById("final-cta");

    if (!sticky || !hero || !finalCta) return;
    if (!("IntersectionObserver" in window)) return;

    var pastHero = false;
    var finalVisible = false;
    var link = sticky.querySelector("a");

    function update() {
      var show = pastHero && !finalVisible;
      sticky.classList.toggle("show", show);
      sticky.setAttribute("aria-hidden", String(!show));
      if (link) link.setAttribute("tabindex", show ? "0" : "-1");
    }

    new IntersectionObserver(function (entries) {
      pastHero = !entries[0].isIntersecting;
      update();
    }, { threshold: 0 }).observe(hero);

    new IntersectionObserver(function (entries) {
      finalVisible = entries[0].isIntersecting;
      update();
    }, { threshold: 0.15 }).observe(finalCta);
  }

  document.addEventListener("DOMContentLoaded", function () {
    fillPlanFacts();
    initStickyCta();
  });
})();
