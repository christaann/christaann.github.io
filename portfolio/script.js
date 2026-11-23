(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");

  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (menu.classList.contains("is-open") && !header.contains(e.target)) setMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) setMenu(false);
  });

  /* ---------- Header border after scrolling ---------- */
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Highlight the current section in the nav ---------- */
  const navLinks = Array.from(menu.querySelectorAll("a"));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((a) => {
              const active = a.getAttribute("href") === "#" + entry.target.id;
              a.classList.toggle("is-active", active);
              if (active) a.setAttribute("aria-current", "true");
              else a.removeAttribute("aria-current");
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* ---------- Copy email ---------- */
  const status = document.getElementById("copy-status");
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    const original = btn.textContent;
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy;
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch (err) {
        // Fallback for browsers or file:// pages without clipboard access
        const field = document.createElement("textarea");
        field.value = text;
        field.setAttribute("readonly", "");
        field.style.position = "absolute";
        field.style.left = "-9999px";
        document.body.appendChild(field);
        field.select();
        try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
        document.body.removeChild(field);
      }
      btn.textContent = ok ? "Copied" : "Copy failed";
      if (status) status.textContent = ok ? "Email address copied." : "Could not copy the email address.";
      setTimeout(() => { btn.textContent = original; }, 2000);
    });
  });

  /* ---------- Back to top ---------- */
  document.querySelectorAll('a[href="#top"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  });

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
