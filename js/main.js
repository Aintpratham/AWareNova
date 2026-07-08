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

  /* Light brand signature for anyone who opens the console. */
  console.log("%cNova Phase5", "color:#C58B5C;font-weight:bold;font-size:14px;");
  console.log("%cBuilt for Amazon warehouse applicants.", "color:#8A8A8A;");
})();
