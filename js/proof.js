/* ============================================================
   PROOF.JS — Reviews & Results page only
   1. REVIEWS data (edit reviews HERE, in one place)
   2. Review carousel: slow auto-scroll, pauses on hover/touch,
      manually swipeable, disabled for reduced motion
   3. Review modal: open on card tap, close on Escape / button /
      backdrop, focus is managed for accessibility
   4. Results lightbox: tap-to-enlarge for real proof images
   ============================================================ */

(function () {
  "use strict";

  /* ----------------------------------------------------------
     1. REVIEWS — the single source of truth.
     To edit, add, or remove a review, change this array only.
     Every review renders with five stars and a Verified
     Customer label automatically.
     ---------------------------------------------------------- */
  var REVIEWS = [
    {
      name: "T. Patel",
      title: "Finally stopped checking manually",
      body: "Nova helped me stay ready for new openings without refreshing the page all day. The setup was straightforward and the support was helpful."
    },
    {
      name: "H. Singh",
      title: "Fast setup and real support",
      body: "I received my license quickly and was guided through the setup. Nova made the entire process much easier than checking manually."
    },
    {
      name: "R. Biju",
      title: "Helped me respond much faster",
      body: "The biggest difference was speed. I no longer had to constantly watch the jobs page and could focus on other things."
    },
    {
      name: "S. Kaur",
      title: "Simple to use after setup",
      body: "I expected the setup to be complicated, but it was explained clearly. Once it was running, Nova quietly handled the monitoring."
    },
    {
      name: "P. Kaur",
      title: "Worth it for the convenience",
      body: "Nova saved me a lot of time and stress from repeated refreshing. Everything from payment to receiving the license felt organized."
    },
    {
      name: "D. Singh",
      title: "A much better way to monitor",
      body: "The continuous monitoring was the main reason I chose Nova. It helped me react to opportunities without being on the website all day."
    },
    {
      name: "F. Aydin",
      title: "Professional and reliable experience",
      body: "The purchase, license delivery, and setup process were smooth. I also received direct help whenever I had a question."
    },
    {
      name: "A. Shah",
      title: "Made the process less stressful",
      body: "Instead of worrying about when an opening might appear, I could let Nova monitor while I continued with my day."
    }
  ];

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Five bronze stars as inline SVG (no images, no emojis). */
  function starsMarkup() {
    var star =
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95z"/></svg>';
    return star + star + star + star + star;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var track = document.getElementById("review-track");
    if (!track) return;

    /* ----------------------------------------------------------
       2. RENDER + CAROUSEL
       Cards render once from REVIEWS. When motion is allowed the
       set is duplicated so the loop wraps seamlessly; duplicates
       are hidden from assistive tech.
       ---------------------------------------------------------- */
    function buildCard(review, index, isClone) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "review-card";
      card.setAttribute("data-index", String(index));
      if (isClone) card.setAttribute("aria-hidden", "true");
      if (isClone) card.tabIndex = -1;
      card.innerHTML =
        '<span class="review-stars" aria-label="Rated 5 out of 5 stars">' + starsMarkup() + "</span>" +
        '<span class="review-title">' + review.title + "</span>" +
        '<span class="review-preview">' + review.body + "</span>" +
        '<span class="review-foot">' +
        '<span class="review-name">' + review.name + "</span>" +
        '<span class="verified-pill">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' +
        "Verified Customer</span></span>";
      card.addEventListener("click", function () {
        /* Ignore clicks that were really drags/swipes */
        if (dragDistance > 8) return;
        openModal(index, card);
      });
      return card;
    }

    REVIEWS.forEach(function (review, i) {
      track.appendChild(buildCard(review, i, false));
    });

    if (!prefersReduced) {
      /* Clone the set once for a seamless wrap-around loop */
      REVIEWS.forEach(function (review, i) {
        track.appendChild(buildCard(review, i, true));
      });
    }

    /* --- Auto-scroll (skipped entirely for reduced motion) --- */
    var paused = false;
    var dragDistance = 0;
    var pointerStartX = 0;
    var SPEED = 28; /* pixels per second — slow, readable drift */

    function halfWidth() {
      return track.scrollWidth / 2;
    }

    if (!prefersReduced) {
      var lastTime = null;

      function step(now) {
        if (lastTime === null) lastTime = now;
        var dt = (now - lastTime) / 1000;
        lastTime = now;

        if (!paused && !document.hidden) {
          track.scrollLeft += SPEED * dt;
          if (track.scrollLeft >= halfWidth()) {
            track.scrollLeft -= halfWidth();
          }
        }
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);

      /* Pause while hovered, touched, or focused */
      track.addEventListener("mouseenter", function () { paused = true; });
      track.addEventListener("mouseleave", function () { paused = false; });
      track.addEventListener("touchstart", function () { paused = true; }, { passive: true });
      track.addEventListener("touchend", function () {
        window.setTimeout(function () { paused = false; }, 1200);
      });
      track.addEventListener("focusin", function () { paused = true; });
      track.addEventListener("focusout", function () { paused = false; });
    }

    /* Track pointer movement so a swipe never triggers the modal */
    track.addEventListener("pointerdown", function (e) {
      pointerStartX = e.clientX;
      dragDistance = 0;
    });
    track.addEventListener("pointermove", function (e) {
      if (e.buttons || e.pointerType === "touch") {
        dragDistance = Math.max(dragDistance, Math.abs(e.clientX - pointerStartX));
      }
    });

    /* ----------------------------------------------------------
       3. REVIEW MODAL
       ---------------------------------------------------------- */
    var modal = document.getElementById("review-modal");
    var modalStars = document.getElementById("review-modal-stars");
    var modalTitle = document.getElementById("review-modal-title");
    var modalBody = document.getElementById("review-modal-body");
    var modalName = document.getElementById("review-modal-name");
    var lastFocused = null;

    modalStars.innerHTML = starsMarkup();

    function openModal(index, trigger) {
      var review = REVIEWS[index];
      if (!review || !modal) return;
      lastFocused = trigger || document.activeElement;
      modalTitle.textContent = review.title;
      modalBody.textContent = review.body;
      modalName.textContent = review.name;
      modal.hidden = false;
      document.body.classList.add("modal-open");
      paused = true;
      modal.querySelector(".modal-close").focus();
    }

    function closeModal() {
      if (!modal || modal.hidden) return;
      modal.hidden = true;
      document.body.classList.remove("modal-open");
      paused = false;
      if (lastFocused) lastFocused.focus();
    }

    modal.querySelectorAll("[data-close-modal]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });

    /* ----------------------------------------------------------
       4. RESULTS LIGHTBOX
       Only result cards that contain a real <img> become
       clickable. Placeholder cards stay inert until you swap
       your watermarked images in (see comments in proof.html).
       ---------------------------------------------------------- */
    var lightbox = document.getElementById("lightbox");
    var lightboxImg = document.getElementById("lightbox-img");
    var lightboxCaption = document.getElementById("lightbox-caption");
    var lastResultFocused = null;

    function openLightbox(img, captionText, trigger) {
      if (!lightbox) return;
      lastResultFocused = trigger || document.activeElement;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || "Enlarged result image";
      lightboxCaption.textContent = captionText || "";
      lightbox.hidden = false;
      document.body.classList.add("modal-open");
      lightbox.querySelector(".modal-close").focus();
    }

    function closeLightbox() {
      if (!lightbox || lightbox.hidden) return;
      lightbox.hidden = true;
      lightboxImg.src = "";
      document.body.classList.remove("modal-open");
      if (lastResultFocused) lastResultFocused.focus();
    }

    document.querySelectorAll(".result-card").forEach(function (card) {
      var img = card.querySelector("img");
      if (!img) return; /* placeholder — not clickable yet */

      var caption = card.querySelector(".result-caption");
      card.classList.add("has-image");
      card.setAttribute("role", "button");
      card.tabIndex = 0;

      function activate() {
        openLightbox(img, caption ? caption.textContent : "", card);
      }
      card.addEventListener("click", activate);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      });
    });

    if (lightbox) {
      lightbox.querySelectorAll("[data-close-lightbox]").forEach(function (el) {
        el.addEventListener("click", closeLightbox);
      });
    }

    /* Escape closes whichever overlay is open */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeModal();
        closeLightbox();
      }
    });
  });
})();
