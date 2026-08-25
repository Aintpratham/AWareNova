/* ============================================================
   ACCENT.JS — dynamic curated accent selector
   ------------------------------------------------------------
   Picks ONE accent from a hand-curated palette on every fresh
   page load and writes it into the CSS custom properties that
   the whole design system already reads from:

       --accent        base        (buttons, marks, links)
       --accent-hover  darker      (hover / pressed)
       --accent-wash   very pale   (focus rings, faint tints)
       --accent-line   pale rule   (underlines, hairlines)

   WHY IT LOADS IN <head>:
   This file is included as a plain (non-deferred) script in the
   <head> of every page, so it runs before first paint. The
   properties are set on documentElement.style, which outranks
   the :root block in css/global.css — so nothing ever paints in
   the fallback colour first. If JavaScript is unavailable the
   :root cobalt values in global.css simply stand.

   CONSTRAINTS THIS RESPECTS:
   - No random RGB/HSL generation. Every value below is a fixed,
     curated constant: base, hover, wash and line are chosen to
     coordinate with each other, not derived at runtime.
   - Client-side only. No cookies, no storage, no network, no
     account state. A full reload may land on a different accent;
     within a single loaded page every component stays in sync
     because they all read the same four variables.
   - Every base clears 5.2:1 against white, so white button text
     stays readable on all 30 entries.

   TESTING:
   Append ?accent=<name> to force a palette entry, e.g.
   index.html?accent=emerald — matching is case/space insensitive.
   ============================================================ */

(function () {
  "use strict";

  /* 30 curated accents. Contrast of base against white shown in
     the trailing comment; all are comfortably above WCAG AA. */
  var PALETTE = [
    { name: "Cobalt",          base: "#1F3FD1", hover: "#1A35B0", wash: "#EFF2FD", line: "#BFC8F5" }, /* 7.81 */
    { name: "Royal Blue",      base: "#1A3AA8", hover: "#152F87", wash: "#F0F2FD", line: "#BFCBF5" }, /* 9.48 */
    { name: "Indigo",          base: "#3730A3", hover: "#2D2785", wash: "#F2F1FB", line: "#C8C6EE" }, /* 9.93 */
    { name: "Periwinkle Blue", base: "#3F4BC0", hover: "#3640A3", wash: "#F1F2FB", line: "#C7CBED" }, /* 7.05 */
    { name: "Violet",          base: "#5B21B6", hover: "#4B1B96", wash: "#F5F0FC", line: "#D4C0F4" }, /* 8.98 */
    { name: "Deep Purple",     base: "#4C1D95", hover: "#3C1775", wash: "#F5F0FC", line: "#D5C1F3" }, /* 10.95 */
    { name: "Orchid",          base: "#8B2AA5", hover: "#712287", wash: "#F9F1FB", line: "#E7C4F0" }, /* 7.07 */
    { name: "Plum",            base: "#7A2F6B", hover: "#5E2453", wash: "#FBF1F9", line: "#EBC9E4" }, /* 8.58 */
    { name: "Aubergine",       base: "#5C2A52", hover: "#421E3B", wash: "#FBF1F9", line: "#EBC9E4" }, /* 11.01 */
    { name: "Mulberry",        base: "#8C2F52", hover: "#6F2541", wash: "#FBF1F5", line: "#ECC8D5" }, /* 7.94 */
    { name: "Raspberry",       base: "#A81E4C", hover: "#88183D", wash: "#FCF0F4", line: "#F4C0D1" }, /* 7.11 */
    { name: "Rose",            base: "#AF2A5C", hover: "#90234C", wash: "#FCF1F5", line: "#F1C3D4" }, /* 6.35 */
    { name: "Crimson",         base: "#B01739", hover: "#8E132E", wash: "#FDEFF2", line: "#F6BECA" }, /* 6.94 */
    { name: "Coral Red",       base: "#BE3A2B", hover: "#9F3024", wash: "#FCF2F0", line: "#F1C7C3" }, /* 5.48 */
    { name: "Terracotta",      base: "#A64230", hover: "#883627", wash: "#FBF3F1", line: "#EECCC6" }, /* 6.10 */
    { name: "Burnt Orange",    base: "#AC5117", hover: "#8A4112", wash: "#FDF5EF", line: "#F6D4BE" }, /* 5.33 */
    { name: "Deep Amber",      base: "#95610A", hover: "#714A08", wash: "#FEF8EE", line: "#FAE2BA" }, /* 5.26 */
    { name: "Ochre",           base: "#836612", hover: "#614C0D", wash: "#FDF9EF", line: "#F6E8BE" }, /* 5.42 */
    { name: "Olive",           base: "#5C6820", hover: "#424B17", wash: "#F9FBF1", line: "#E7EEC6" }, /* 6.08 */
    { name: "Forest Green",    base: "#1E5130", hover: "#14351F", wash: "#F1FBF5", line: "#C9EBD5" }, /* 9.23 */
    { name: "Emerald",         base: "#0B6E45", hover: "#084B2F", wash: "#EFFDF7", line: "#BCF8DF" }, /* 6.31 */
    { name: "Jade",            base: "#12705B", hover: "#0D4F40", wash: "#F0FDFA", line: "#BFF5E9" }, /* 6.01 */
    { name: "Teal",            base: "#0E6A70", hover: "#0A4A4E", wash: "#EFFCFD", line: "#BDF3F7" }, /* 6.34 */
    { name: "Deep Cyan",       base: "#0D6379", hover: "#094756", wash: "#EFFAFD", line: "#BCECF8" }, /* 6.82 */
    { name: "Turquoise",       base: "#0A6E85", hover: "#075161", wash: "#EEFBFE", line: "#BAEEFA" }, /* 5.86 */
    { name: "Cerulean",        base: "#14618F", hover: "#0F4A6D", wash: "#EFF8FD", line: "#BEE1F6" }, /* 6.70 */
    { name: "Steel Blue",      base: "#2A5C88", hover: "#21486B", wash: "#F1F6FB", line: "#C6DBEE" }, /* 7.04 */
    { name: "Slate Blue",      base: "#4A52A0", hover: "#3E4586", wash: "#F1F2FB", line: "#C9CCEB" }, /* 6.99 */
    { name: "Wine",            base: "#7B1F35", hover: "#5C1728", wash: "#FBF1F3", line: "#F0C4CF" }, /* 10.05 */
    { name: "Fuchsia Deep",    base: "#9C1E7B", hover: "#7C1862", wash: "#FCF0F9", line: "#F3C1E6" }  /* 7.28 */
  ];

  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z]/g, "");
  }

  function forced() {
    var m = /[?&]accent=([^&#]+)/.exec(window.location.search);
    if (!m) return null;
    var want = slug(decodeURIComponent(m[1]));
    for (var i = 0; i < PALETTE.length; i++) {
      if (slug(PALETTE[i].name) === want) return PALETTE[i];
    }
    return null;
  }

  var pick = forced() || PALETTE[Math.floor(Math.random() * PALETTE.length)];

  var root = document.documentElement;
  root.style.setProperty("--accent", pick.base);
  root.style.setProperty("--accent-hover", pick.hover);
  root.style.setProperty("--accent-wash", pick.wash);
  root.style.setProperty("--accent-line", pick.line);

  /* Other scripts (and anyone in the console) can read the
     current choice without re-parsing computed styles. */
  window.NOVA_ACCENT = pick;
})();
