/* =========================================================================
   JO ZGRF — Portfolio Interactions
   Cursor · Preloader · Scroll reveals (GSAP/ScrollTrigger) · Magnetic UI ·
   Tilt cards · Text split reveal · Nav behavior · Mobile menu
   ========================================================================= */
(function () {
  "use strict";

  var html = document.documentElement;
  var hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var gsapReady = typeof window.gsap !== "undefined";

  if (gsapReady) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* -----------------------------------------------------------------------
     SAFETY NET — if GSAP fails to load (e.g. offline), reveal everything
     ----------------------------------------------------------------------- */
  if (!gsapReady) {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.style.opacity = 1;
      el.style.transform = "none";
      el.style.clipPath = "none";
    });
    document.querySelectorAll("[data-count]").forEach(function (el) {
      el.textContent = el.getAttribute("data-count");
    });
  }

  /* -----------------------------------------------------------------------
     TEXT SPLIT — wraps characters for the hero title reveal
     ----------------------------------------------------------------------- */
  function splitChars(el) {
    var text = el.textContent;
    el.textContent = "";
    var frag = document.createDocumentFragment();
    text.split("").forEach(function (ch) {
      var span = document.createElement("span");
      span.className = "char";
      span.textContent = ch === " " ? "\u00A0" : ch;
      frag.appendChild(span);
    });
    el.appendChild(frag);
    return el.querySelectorAll(".char");
  }

  var splitTargets = document.querySelectorAll("[data-reveal-chars]");
  var allChars = [];
  splitTargets.forEach(function (el) {
    var chars = splitChars(el);
    allChars = allChars.concat(Array.prototype.slice.call(chars));
  });

  /* -----------------------------------------------------------------------
     PRELOADER
     ----------------------------------------------------------------------- */
  var preloader = document.getElementById("preloader");
  var preloaderFill = document.getElementById("preloaderFill");
  var preloaderCount = document.getElementById("preloaderCount");

  function runIntro() {
    if (gsapReady) {
      var tl = gsap.timeline({ defaults: { ease: "cubic-bezier(0.4,0,0.2,1)" } });
      tl.to(".hero__eyebrow", { opacity: 1, y: 0, duration: 0.5 }, 0)
        .to(allChars, { y: 0, duration: 0.7, stagger: 0.02, ease: "cubic-bezier(0.19,1,0.22,1)" }, 0.05)
        .to(".hero__desc", { opacity: 1, y: 0, duration: 0.5 }, 0.35)
        .to(".hero__actions", { opacity: 1, y: 0, duration: 0.5 }, 0.45)
        .to(".hero__scroll", { opacity: 1, duration: 0.6 }, 0.6)
        .from(".hero__bg img", { scale: 1.22, duration: 1.6, ease: "cubic-bezier(0.19,1,0.22,1)" }, 0);
    } else {
      document.querySelectorAll(".hero__eyebrow, .hero__desc, .hero__actions").forEach(function (el) {
        el.style.opacity = 1; el.style.transform = "none";
      });
      allChars.forEach(function (c) { c.style.transform = "none"; });
    }
  }

  var loadPct = 0;
  var loadTimer = setInterval(function () {
    loadPct += Math.random() * 18 + 6;
    if (loadPct >= 100) {
      loadPct = 100;
      clearInterval(loadTimer);
      finishPreload();
    }
    if (preloaderFill) preloaderFill.style.width = loadPct + "%";
    if (preloaderCount) preloaderCount.textContent = String(Math.floor(loadPct)).padStart(2, "0");
  }, 130);

  var preloadDone = false;
  function finishPreload() {
    if (preloadDone) return;
    preloadDone = true;
    if (preloader) {
      preloader.classList.add("is-done");
      setTimeout(function () { preloader.style.display = "none"; }, 700);
    }
    runIntro();
  }
  // hard safety cap so the site never stays hidden behind the preloader
  setTimeout(finishPreload, 2600);

  /* -----------------------------------------------------------------------
     CUSTOM CURSOR
     ----------------------------------------------------------------------- */
  if (hasFinePointer) {
    html.classList.add("has-cursor");
    var cursorEl = document.querySelector(".cursor");
    var dot = document.querySelector(".cursor__dot");
    var ring = document.querySelector(".cursor__ring");
    var label = document.querySelector(".cursor__label");

    var mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    var dotX = mouseX, dotY = mouseY;
    var ringX = mouseX, ringY = mouseY;

    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX; mouseY = e.clientY;
    });

    function raf() {
      dotX += (mouseX - dotX) * 0.55;
      dotY += (mouseY - dotY) * 0.55;
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      dot.style.transform = "translate3d(" + dotX + "px," + dotY + "px,0)";
      ring.style.transform = "translate3d(" + ringX + "px," + ringY + "px,0)";
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    document.querySelectorAll("[data-cursor]").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        var type = el.getAttribute("data-cursor");
        html.classList.add(type === "drag" ? "cursor-drag" : "cursor-hover");
        var txt = el.getAttribute("data-cursor-text");
        if (txt && label) label.textContent = txt;
        else if (label) label.textContent = type === "link" ? "" : "";
      });
      el.addEventListener("mouseleave", function () {
        html.classList.remove("cursor-hover", "cursor-drag");
        if (label) label.textContent = "";
      });
    });

    document.addEventListener("mousedown", function () { cursorEl.style.opacity = "0.7"; });
    document.addEventListener("mouseup", function () { cursorEl.style.opacity = "1"; });
  }

  /* -----------------------------------------------------------------------
     MAGNETIC ELEMENTS
     ----------------------------------------------------------------------- */
  if (hasFinePointer && !reduceMotion) {
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      var strength = 0.35;
      var xTo, yTo;
      if (gsapReady) {
        xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "elastic.out(1,0.4)" });
        yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "elastic.out(1,0.4)" });
      }
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var relX = (e.clientX - r.left - r.width / 2) * strength;
        var relY = (e.clientY - r.top - r.height / 2) * strength;
        if (gsapReady) { xTo(relX); yTo(relY); }
        else { el.style.transform = "translate(" + relX + "px," + relY + "px)"; }
      });
      el.addEventListener("mouseleave", function () {
        if (gsapReady) { xTo(0); yTo(0); }
        else { el.style.transform = "translate(0,0)"; }
      });
    });

    // softer magnetic pull for service cards (smaller, whole-card drift)
    document.querySelectorAll("[data-magnetic-soft]").forEach(function (el) {
      var xTo, yTo;
      if (gsapReady) {
        xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
        yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
      }
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var relX = (e.clientX - r.left - r.width / 2) * 0.06;
        var relY = (e.clientY - r.top - r.height / 2) * 0.06;
        if (gsapReady) { xTo(relX); yTo(relY); }
      });
      el.addEventListener("mouseleave", function () {
        if (gsapReady) { xTo(0); yTo(0); }
      });
    });
  }

  /* -----------------------------------------------------------------------
     TILT CARDS
     ----------------------------------------------------------------------- */
  if (hasFinePointer && !reduceMotion) {
    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      var rxTo, ryTo, tyTo;
      if (gsapReady) {
        rxTo = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
        ryTo = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
        tyTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
      }
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        if (gsapReady) {
          rxTo(py * -6);
          ryTo(px * 8);
          tyTo(-4);
        }
      });
      el.addEventListener("mouseleave", function () {
        if (gsapReady) { rxTo(0); ryTo(0); tyTo(0); }
      });
    });
  }

  /* -----------------------------------------------------------------------
     SCROLL REVEALS
     ----------------------------------------------------------------------- */
  if (gsapReady) {
    document.querySelectorAll('[data-reveal="fade-up"]').forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" }
      });
    });

    document.querySelectorAll('[data-reveal="mask"]').forEach(function (el) {
      gsap.to(el, {
        clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" }
      });
      var img = el.querySelector("img");
      if (img) {
        gsap.fromTo(img, { scale: 1.28 }, {
          scale: 1.12, duration: 1.4, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" }
        });
      }
    });

    // stagger children on tags / grids
    ["about__tags", "contact__grid"].forEach(function (cls) {
      document.querySelectorAll("." + cls).forEach(function (el) {
        gsap.from(el.children, {
          opacity: 0, y: 14, duration: 0.5, stagger: 0.06, ease: "power1.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" }
        });
      });
    });

    gsap.from(".services__list .service", {
      opacity: 0, y: 24, duration: 0.6, stagger: 0.08, ease: "power2.out",
      scrollTrigger: { trigger: ".services__list", start: "top 85%", toggleActions: "play none none none" }
    });

    // parallax hero background
    document.querySelectorAll("[data-parallax]").forEach(function (el) {
      var amt = parseFloat(el.getAttribute("data-parallax")) || 0.2;
      gsap.to(el.querySelector("img"), {
        yPercent: amt * 40, ease: "none",
        scrollTrigger: { trigger: el.closest("section") || el, start: "top top", end: "bottom top", scrub: 0.6 }
      });
    });

    // counter for about stat
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      var obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 1.2, ease: "power1.out",
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
        onUpdate: function () { el.textContent = Math.round(obj.val); }
      });
    });
  }

  /* -----------------------------------------------------------------------
     NAV — scrolled state + hide on scroll down
     ----------------------------------------------------------------------- */
  var nav = document.querySelector(".nav");
  var scrollProgressFill = document.getElementById("scrollProgressFill");
  var lastY = window.scrollY;

  function onScroll() {
    var y = window.scrollY;
    if (nav) {
      nav.classList.toggle("is-scrolled", y > 40);
      if (y > lastY && y > 160) nav.classList.add("nav--hidden");
      else nav.classList.remove("nav--hidden");
    }
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docH > 0 ? (y / docH) * 100 : 0;
    if (scrollProgressFill) scrollProgressFill.style.width = pct + "%";
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* -----------------------------------------------------------------------
     MOBILE MENU
     ----------------------------------------------------------------------- */
  var burger = document.getElementById("navBurger");
  var mobileMenu = document.getElementById("mobileMenu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* -----------------------------------------------------------------------
     BACK TO TOP + FOOTER YEAR
     ----------------------------------------------------------------------- */
  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
