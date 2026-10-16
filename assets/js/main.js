/* =========================================================
   Origins Africa — interactions
   ========================================================= */
(function () {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------
     CONFIG — paste your free Formspree form ID here to make
     the enquiry form send automatically (https://formspree.io).
     While it stays as the placeholder, the form falls back to
     opening the visitor's email app (mailto).
     -------------------------------------------------------- */
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_ID";
  const CONTACT_EMAIL = "m@mathewmakoni.co.za";

  /* ---- Year ---- */
  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Nav scrolled + progress ---- */
  const nav = $("#nav"), progress = $("#scrollProgress");
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("nav--scrolled", y > 24);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  const toggle = $("#navToggle"), links = $("#navLinks");
  const closeMenu = () => { links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); };
  toggle.addEventListener("click", () => toggle.setAttribute("aria-expanded", String(links.classList.toggle("open"))));
  $$("#navLinks a").forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

  /* ---- Reveal ---- */
  const revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((ents) => ents.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.transitionDelay = (en.target.getAttribute("data-reveal-delay") || 0) + "ms";
        en.target.classList.add("is-in"); io.unobserve(en.target);
      }
    }), { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(el => io.observe(el));
  } else revealEls.forEach(el => el.classList.add("is-in"));

  /* ---- Stat counters ---- */
  const counters = $$("[data-count]");
  const runCount = (el) => {
    const target = parseFloat(el.getAttribute("data-count")), suffix = el.getAttribute("data-suffix") || "";
    if (reduce) { el.textContent = target + suffix; return; }
    const dur = 1500, start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver((ents) => ents.forEach(en => { if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); } }), { threshold: 0.6 });
    counters.forEach(c => cio.observe(c));
  } else counters.forEach(runCount);

  /* ---- Testimonials slider ---- */
  const track = $("#sliderTrack");
  if (track) {
    const slides = $$(".quote", track), dotsWrap = $("#sliderDots");
    let idx = 0, timer;
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Testimonial " + (i + 1));
      b.addEventListener("click", () => { go(i); restart(); });
      dotsWrap.appendChild(b);
    });
    const dots = $$("button", dotsWrap);
    const go = (i) => { idx = (i + slides.length) % slides.length; track.style.transform = `translateX(-${idx * 100}%)`; dots.forEach((d, n) => d.classList.toggle("is-active", n === idx)); };
    const next = () => go(idx + 1), prev = () => go(idx - 1);
    const restart = () => { if (reduce) return; clearInterval(timer); timer = setInterval(next, 6000); };
    $("#nextQuote").addEventListener("click", () => { next(); restart(); });
    $("#prevQuote").addEventListener("click", () => { prev(); restart(); });
    let x0 = null; const vp = $("#sliderViewport");
    vp.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
    vp.addEventListener("touchend", e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); restart(); } x0 = null; }, { passive: true });
    go(0); restart();
  }

  /* ---- Showreel modal ---- */
  const modal = $("#reelModal"), reelVideo = $("#reelVideo"), heroVideo = $("#heroVideo");
  const openReel = () => {
    if (!modal) return;
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (heroVideo) try { heroVideo.pause(); } catch (e) {}
    try { reelVideo.currentTime = 0; reelVideo.play(); } catch (e) {}
  };
  const closeReel = () => {
    if (!modal) return;
    modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    try { reelVideo.pause(); } catch (e) {}
    if (heroVideo && !reduce) try { heroVideo.play(); } catch (e) {}
  };
  ["#openReel", "#openReel2"].forEach(sel => { const b = $(sel); if (b) b.addEventListener("click", openReel); });
  if (modal) $$("[data-close]", modal).forEach(el => el.addEventListener("click", closeReel));

  /* ---- Gallery lightbox ---- */
  const lb = $("#lightbox"), lbImg = $("#lbImg");
  const items = $$(".gallery__item");
  if (lb && items.length) {
    const srcs = items.map(it => it.getAttribute("data-src"));
    let cur = 0;
    const show = (i) => { cur = (i + srcs.length) % srcs.length; lbImg.src = srcs[cur]; };
    const openLb = (i) => { show(i); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; };
    const closeLb = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; lbImg.src = ""; };
    items.forEach((it, i) => it.addEventListener("click", () => openLb(i)));
    $("[data-lbclose]").addEventListener("click", closeLb);
    $("#lbNext").addEventListener("click", () => show(cur + 1));
    $("#lbPrev").addEventListener("click", () => show(cur - 1));
    lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", e => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") show(cur + 1);
      if (e.key === "ArrowLeft") show(cur - 1);
    });
  }
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeReel(); });

  /* ---- Contact form: Formspree AJAX, mailto fallback ---- */
  const form = $("#enquiryForm");
  if (form) {
    const note = $("#formNote"), btn = $("#submitBtn");
    const setErr = (name, msg) => {
      const input = form.querySelector(`[name="${name}"]`);
      const field = input.closest(".field");
      const err = form.querySelector(`.field__error[data-for="${name}"]`);
      if (field) field.classList.toggle("field--invalid", !!msg);
      if (err) err.textContent = msg || "";
    };
    const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    const validate = (data) => {
      let ok = true;
      [["name", "Please tell me your name."], ["email", "A valid email, please."],
       ["service", "Pick what you need."], ["message", "A line or two about your event."]].forEach(([f, m]) => {
        const v = (data[f] || "").trim(), bad = !v || (f === "email" && !emailOk(v));
        setErr(f, bad ? m : ""); if (bad) ok = false;
      });
      return ok;
    };

    const mailtoFallback = (data) => {
      const subject = `Event enquiry — ${data.service} (${data.name})`;
      const body =
`Hi Mathew,

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "-"}
Service: ${data.service}

${data.message}

— Sent from the Origins Africa website`;
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (!validate(data)) { note.className = "form__note err"; note.textContent = "Please check the highlighted fields."; return; }

      // No endpoint configured yet → mailto
      if (FORMSPREE_ENDPOINT.includes("REPLACE_WITH")) {
        note.className = "form__note ok";
        note.textContent = "Opening your email app… if nothing happens, email " + CONTACT_EMAIL + " directly.";
        mailtoFallback(data);
        return;
      }

      // Formspree AJAX
      btn.disabled = true; const label = btn.textContent; btn.textContent = "Sending…";
      note.className = "form__note"; note.textContent = "";
      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST", headers: { "Accept": "application/json" }, body: new FormData(form)
        });
        if (res.ok) {
          form.reset();
          note.className = "form__note ok";
          note.textContent = "Thank you — your enquiry is on its way. Mathew will be in touch shortly. 🎉";
        } else {
          throw new Error("bad response");
        }
      } catch (err) {
        note.className = "form__note err";
        note.textContent = "Something went wrong — opening your email app instead.";
        mailtoFallback(data);
      } finally {
        btn.disabled = false; btn.textContent = label;
      }
    });

    form.addEventListener("input", e => { if (e.target.name) setErr(e.target.name, ""); });
  }

  /* ---- Floating chat widget ---- */
  const chat = $("#chat");
  if (chat) {
    const fab = $("#chatFab"), close = $("#chatClose"), body = $("#chatBody"),
          quick = $("#chatQuick"), cForm = $("#chatForm"), cInput = $("#chatInput");
    let answered = false;
    const openC = () => { chat.classList.add("open"); fab.setAttribute("aria-expanded", "true"); $("#chatPanel").setAttribute("aria-hidden", "false"); setTimeout(() => cInput.focus(), 300); };
    const shutC = () => { chat.classList.remove("open"); fab.setAttribute("aria-expanded", "false"); $("#chatPanel").setAttribute("aria-hidden", "true"); };
    fab.addEventListener("click", () => chat.classList.contains("open") ? shutC() : openC());
    close.addEventListener("click", shutC);
    const addBubble = (text, dir) => { const b = document.createElement("div"); b.className = "bubble bubble--" + dir; b.textContent = text; body.appendChild(b); body.scrollTop = body.scrollHeight; };
    const reply = () => {
      if (answered) { setTimeout(() => addBubble("Got it — tap below to send the full details and I'll get back to you personally.", "in"), 650); return; }
      answered = true;
      setTimeout(() => {
        addBubble("Great — the quickest way is the enquiry form. Taking you there now. 👇", "in");
        setTimeout(() => { shutC(); document.getElementById("contact").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); const nm = document.getElementById("name"); if (nm) setTimeout(() => nm.focus(), 700); }, 1100);
      }, 650);
    };
    $$("button", quick).forEach(b => b.addEventListener("click", () => { addBubble(b.getAttribute("data-q"), "out"); quick.style.display = "none"; reply(); }));
    cForm.addEventListener("submit", e => { e.preventDefault(); const v = cInput.value.trim(); if (!v) return; addBubble(v, "out"); cInput.value = ""; quick.style.display = "none"; reply(); });
    if (!reduce) setTimeout(() => { if (!chat.classList.contains("open")) fab.animate([{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }], { duration: 600, iterations: 2 }); }, 6000);
  }
})();
