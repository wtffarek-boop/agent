/* Agent — landing page interactions */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Sticky nav shading ───────────────────────────────── */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── Mobile menu ──────────────────────────────────────── */
  const toggle = $("#menuToggle");
  const menu = $("#mobileMenu");

  function closeMenu() {
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    if (open) return closeMenu();
    menu.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  });

  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      toggle.focus();
    }
  });

  /* ── Scroll reveal ────────────────────────────────────── */
  const revealEls = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = Number(el.dataset.delay || Math.min(i * 70, 240));
          setTimeout(() => el.classList.add("is-in"), delay);
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ── Card spotlight follows cursor ────────────────────── */
  $$(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* ── Billing toggle ───────────────────────────────────── */
  const toggleBtns = $$(".toggle-btn");
  const amounts = $$(".amount[data-monthly]");

  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });

      const period = btn.dataset.billing; // "monthly" | "yearly"
      amounts.forEach((el) => {
        const target = Number(el.dataset[period] || 0);
        animateNumber(el, target, el.textContent);
      });
    });
  });

  function animateNumber(el, to, fromRaw) {
    const from = Number(String(fromRaw).replace(/[^0-9.]/g, "")) || 0;
    if (reduceMotion || from === to) {
      el.textContent = `$${to}`;
      return;
    }
    const start = performance.now();
    const dur = 380;
    function frame(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = `$${Math.round(from + (to - from) * eased)}`;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ── Mock chat prompt: playful, canned responses ──────── */
  const mockForm = $("#mockForm");
  const mockPrompt = $("#mockPrompt");
  const canned = [
    "On it — scoping the change across 3 files.",
    "Pushed a branch and opened a PR with tests.",
    "Indexing the repo… found 2 matching call sites.",
    "Plan ready for review above.",
  ];
  let cannedIndex = 0;

  mockForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = mockPrompt.value.trim();
    if (!value) {
      mockPrompt.focus();
      return;
    }
    mockPrompt.value = "";
    mockPrompt.placeholder = canned[cannedIndex % canned.length];
    cannedIndex += 1;
    mockPrompt.blur();
  });

  /* ── Email capture ────────────────────────────────────── */
  const ctaForm = $("#ctaForm");
  const email = $("#email");
  const note = $("#formNote");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  ctaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = email.value.trim();

    if (!emailRe.test(value)) {
      email.classList.add("is-error");
      email.setAttribute("aria-invalid", "true");
      note.className = "form-note err";
      note.textContent = "Please enter a valid work email.";
      email.focus();
      return;
    }

    email.classList.remove("is-error");
    email.removeAttribute("aria-invalid");
    note.className = "form-note ok";
    note.textContent = `Thanks — we'll send your invite to ${value}.`;
    ctaForm.reset();
  });

  email.addEventListener("input", () => {
    if (!email.classList.contains("is-error")) return;
    email.classList.remove("is-error");
    email.removeAttribute("aria-invalid");
    note.className = "form-note";
    note.textContent = "";
  });

  /* ── FAQ: only one open at a time ─────────────────────── */
  const faqs = $$(".faq");
  faqs.forEach((d) => {
    d.addEventListener("toggle", () => {
      if (!d.open) return;
      faqs.forEach((other) => {
        if (other !== d) other.open = false;
      });
    });
  });

  /* ── Footer year ──────────────────────────────────────── */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
