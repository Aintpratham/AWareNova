/* ============================================================
   CHECKOUT PAGE LOGIC
   - Reads the selected plan from the URL (?plan=base|standard|premium)
   - Populates the purchase summary from a single PLANS config
   - Handles the form with a PLACEHOLDER submit (no backend yet)

   The "Proceed to Secure Payment" button is intentionally NOT wired
   to any backend. The commented block in handleSubmit() marks exactly
   where the Railway call will go once it's ready.
   ============================================================ */

(function () {
  "use strict";

  // Single source of truth for plan display. Change copy here only.
  // `id` is what will be POSTed to the backend; the backend maps it to the
  // real Stripe Price ID server-side (the site never sends a price).
  var PLANS = {
    base:     { id: "base",     name: "Base",     price: "$499 CAD", duration: "60 Days",  devices: "1" },
    standard: { id: "standard", name: "Standard", price: "$799 CAD", duration: "120 Days", devices: "2" },
    premium:  { id: "premium",  name: "Premium",  price: "$999 CAD", duration: "180 Days", devices: "4" }
  };
  var DEFAULT_PLAN = "standard";

  function getPlanKey() {
    var params = new URLSearchParams(window.location.search);
    var key = (params.get("plan") || "").toLowerCase();
    return PLANS[key] ? key : DEFAULT_PLAN;
  }

  var planKey = getPlanKey();
  var plan = PLANS[planKey];

  // ---- Populate the summary ----
  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  setText("s-plan-name", plan.name);
  setText("s-plan-tag", plan.name + " plan");
  setText("s-price", plan.price);
  setText("s-duration", plan.duration);
  setText("s-devices", plan.devices);

  // Keep the chosen plan on a hidden field so the future backend call has it.
  var planField = document.getElementById("selected-plan");
  if (planField) planField.value = plan.id;

  // ---- Form handling (placeholder only) ----
  var form = document.getElementById("checkout-form");
  var errorEl = document.getElementById("form-error");
  var statusEl = document.getElementById("pay-status");

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (errorEl) errorEl.textContent = "";
    if (statusEl) statusEl.textContent = "";

    var firstName = (document.getElementById("first-name") || {}).value || "";
    var lastName = (document.getElementById("last-name") || {}).value || "";
    var email = (document.getElementById("email") || {}).value || "";

    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();

    // Basic client-side validation before we'd ever call the backend.
    if (!firstName || !lastName) {
      if (errorEl) errorEl.textContent = "Please enter your first and last name.";
      return;
    }
    if (!isEmail(email)) {
      if (errorEl) errorEl.textContent = "Please enter a valid email address.";
      return;
    }

    // The data the backend will need. Assembled now so wiring is a one-liner later.
    var payload = {
      plan: plan.id,
      first_name: firstName,
      last_name: lastName,
      email: email
    };

    // ========================================================
    // TODO:
    // POST customer information to Railway backend
    //   fetch(RAILWAY_URL + "/create-checkout-session", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(payload)
    //   })
    // Railway creates Stripe Checkout Session
    // Receive checkout URL   ->  const { url } = await res.json();
    // Redirect customer to Stripe  ->  window.location.href = url;
    // ========================================================
    void payload; // referenced so linters don't flag it before wiring

    // Until the backend is connected, show a calm, professional status line.
    if (statusEl) {
      statusEl.textContent = "Secure payment is being connected. Please check back shortly.";
    }
  }

  if (form) form.addEventListener("submit", handleSubmit);
})();
