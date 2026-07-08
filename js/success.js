/* ============================================================
   SUCCESS PAGE LOGIC
   Where Stripe redirects after a successful payment. The license
   is created by the backend (webhook) moments after payment, so
   this page will look it up by the checkout session id in the URL
   (?session_id=...) and display the key once it's ready.

   Nothing is wired to the backend yet — the fetch is a commented
   placeholder. The page currently shows a pending state.
   ============================================================ */

(function () {
  "use strict";

  var keyEl = document.getElementById("license-key");
  var copyBtn = document.getElementById("copy-key");
  var downloadBtn = document.getElementById("download-btn");

  // The unguessable checkout session id Stripe appends to the success URL.
  var params = new URLSearchParams(window.location.search);
  var sessionId = params.get("session_id") || "";

  // ---- Copy-to-clipboard for the license key (works once a key is shown) ----
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = keyEl ? keyEl.textContent.trim() : "";
      if (!text || copyBtn.disabled) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          var prev = copyBtn.textContent;
          copyBtn.textContent = "Copied";
          setTimeout(function () { copyBtn.textContent = prev; }, 1600);
        });
      }
    });
  }

  // ---- Load the license (placeholder) ----
  function showPending() {
    if (keyEl) {
      keyEl.textContent = "Loading…";
      keyEl.classList.add("pending");
    }
    if (copyBtn) copyBtn.disabled = true;
    if (downloadBtn) downloadBtn.setAttribute("aria-disabled", "true");
  }

  // Called later once the backend returns the license details.
  // Left here so wiring is a small, obvious change.
  function showLicense(data) {
    if (keyEl && data && data.license_key) {
      keyEl.textContent = data.license_key;
      keyEl.classList.remove("pending");
    }
    if (copyBtn) copyBtn.disabled = false;
    if (downloadBtn && data && data.download_url) {
      downloadBtn.href = data.download_url;
      downloadBtn.classList.remove("is-disabled");
      downloadBtn.removeAttribute("aria-disabled");
    }
  }
  void showLicense; // referenced so linters don't flag it before wiring

  showPending();

  // ========================================================
  // TODO:
  // Fetch purchase details from backend
  //   if (sessionId) {
  //     const res = await fetch(RAILWAY_URL + "/order/" + encodeURIComponent(sessionId));
  //     const data = await res.json();
  //     if (data.ready) showLicense(data);
  //     else setTimeout(poll, 2000);   // webhook may land a moment after redirect
  //   }
  // Display generated license key   ->  showLicense(data)
  // Enable download button          ->  handled inside showLicense()
  // ========================================================
  void sessionId; // will be used by the fetch above once wired
})();
