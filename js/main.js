/* ============================================================
   MAIN.JS
   General site setup. Loaded on every page.
   Keep page-wide, lightweight logic here.
   ============================================================ */

(function () {
  "use strict";

  /* Auto-fill the current year in the footer so the copyright
     never goes stale. Add <span data-year></span> in the markup. */
  function setYear() {
    var nodes = document.querySelectorAll("[data-year]");
    var year = new Date().getFullYear();
    nodes.forEach(function (node) {
      node.textContent = year;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setYear();
  });

  /* Light brand signature for anyone who opens the console.
     Uses whichever accent js/accent.js picked for this page load
     so the console matches the interface. */
  var brand = (window.NOVA_ACCENT && window.NOVA_ACCENT.base) || "#1F3FD1";
  console.log("%cNova Phase5", "color:" + brand + ";font-weight:bold;font-size:14px;");
  console.log("%cBuilt for Amazon warehouse applicants.", "color:#687181;");
})();
