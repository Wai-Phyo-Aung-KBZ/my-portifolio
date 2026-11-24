"use strict";

(() => {
  const translations = window.PORTFOLIO_TRANSLATIONS || {};
  const languageButtons = document.querySelectorAll("[data-language]");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const pageTitle = document.querySelector("title");
  const metaDescription = document.querySelector('meta[name="description"]');
  const year = document.getElementById("year");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function textFor(key, language) {
    return translations[language]?.[key] ?? translations.en?.[key] ?? "";
  }

  function updateMenuAccessibility(isOpen) {
    if (!menuToggle) return;
    const language = document.documentElement.lang === "my" ? "my" : "en";
    const key = menuToggle.getAttribute(isOpen ? "data-menu-close-key" : "data-menu-open-key");
    menuToggle.setAttribute("aria-label", textFor(key, language) || (isOpen ? "Close navigation" : "Open navigation"));
  }

  function applyTranslations(language) {
    const selected = language === "my" ? "my" : "en";
    document.documentElement.lang = selected;
    document.body.classList.toggle("lang-my", selected === "my");

    document.querySelectorAll("[data-i18n-key]").forEach((element) => {
      const key = element.dataset.i18nKey;
      if (Object.prototype.hasOwnProperty.call(translations[selected] || {}, key)) {
        element.textContent = textFor(key, selected);
      }
    });
    document.querySelectorAll("[data-i18n-alt-key]").forEach((element) => {
      const key = element.dataset.i18nAltKey;
      if (Object.prototype.hasOwnProperty.call(translations[selected] || {}, key)) {
        element.setAttribute("alt", textFor(key, selected));
      }
    });
    document.querySelectorAll("[data-i18n-aria-key]").forEach((element) => {
      const key = element.dataset.i18nAriaKey;
      if (Object.prototype.hasOwnProperty.call(translations[selected] || {}, key)) {
        element.setAttribute("aria-label", textFor(key, selected));
      }
    });
    if (pageTitle?.dataset.i18nTitleKey) {
      const value = textFor(pageTitle.dataset.i18nTitleKey, selected);
      if (value) document.title = value;
    }
    if (metaDescription?.dataset.i18nContentKey) {
      const value = textFor(metaDescription.dataset.i18nContentKey, selected);
      if (value) metaDescription.content = value;
    }

    languageButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.language === selected));
    });
    updateMenuAccessibility(Boolean(navLinks?.classList.contains("open")));
    try { localStorage.setItem("wai-phyo-aung-portfolio-language", selected); } catch (_) { /* Optional preference only. */ }
  }

  languageButtons.forEach((button) => button.addEventListener("click", () => applyTranslations(button.dataset.language)));
  let initialLanguage = "en";
  try { initialLanguage = localStorage.getItem("wai-phyo-aung-portfolio-language") || "en"; } catch (_) { /* Default to English. */ }
  applyTranslations(initialLanguage);

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      updateMenuAccessibility(isOpen);
    });
    navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      updateMenuAccessibility(false);
    }));
  }
  if (year) year.textContent = String(new Date().getFullYear());

  // Cinematic, repeatable scroll motion. Every item resets out of view and
  // animates again in either scroll direction. Different elements receive different entrances.
  const revealGroups = [
    [".section-heading", "reveal-clip", false],
    [".about-story p", "reveal-up", true],
    [".fact", "reveal-right", true],
    [".skill-card", "reveal-zoom", true],
    [".tech-logo-item", "reveal-pop", true],
    [".timeline-item", "reveal-left", true],
    [".experience-photo", "reveal-zoom", true],
    [".ambassador-note", "reveal-right", false],
    [".project-visual", "reveal-flip", false],
    [".project-details > *", "reveal-right", true],
    [".education-feature-card", "reveal-left", false],
    [".training-feature-card", "reveal-right", false],
    [".education-photo", "reveal-zoom", true],
    [".organisation-logo", "reveal-pop", true],
    [".contact-wrap > *", "reveal-up", true],
    [".contact-links a", "reveal-right", true],
    [".strip-inner > *", "reveal-up", true],
  ];

  if (!reducedMotion && "IntersectionObserver" in window) {
    revealGroups.forEach(([selector, effect, stagger]) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        element.classList.add("scroll-reveal", effect);
        if (stagger) element.style.setProperty("--reveal-delay", `${Math.min(index % 8, 6) * 80}ms`);
      });
    });
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: "-7% 0px -8% 0px" });
    document.querySelectorAll(".scroll-reveal").forEach((element) => revealObserver.observe(element));

    window.addEventListener("load", () => {
      document.querySelector(".hero-copy")?.classList.add("hero-enter-left");
      document.querySelector(".hero-portrait")?.classList.add("hero-enter-right");
      document.querySelector(".hero-focus")?.classList.add("hero-focus-enter");
    }, { once: true });
  } else {
    document.querySelectorAll(".scroll-reveal").forEach((element) => element.classList.add("is-visible"));
  }

  // Desktop pointer aurora + card tilt + magnetic CTA. Touch devices stay calm and fast.
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const pointerAurora = document.querySelector(".pointer-aurora");
  if (finePointer && pointerAurora && !reducedMotion) {
    window.addEventListener("pointermove", (event) => {
      pointerAurora.style.setProperty("--pointer-x", `${event.clientX}px`);
      pointerAurora.style.setProperty("--pointer-y", `${event.clientY}px`);
      pointerAurora.classList.add("pointer-active");
    }, { passive: true });
    document.addEventListener("pointerleave", () => pointerAurora.classList.remove("pointer-active"));

    document.querySelectorAll(".skill-card, .education-feature-card, .training-feature-card, .organisation-logo, .project-visual").forEach((card) => {
      card.classList.add("tilt-card");
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        card.style.setProperty("--tilt-x", `${(0.5 - py) * 5}deg`);
        card.style.setProperty("--tilt-y", `${(px - 0.5) * 6}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });

    document.querySelectorAll(".button, .nav-contact").forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        const rect = button.getBoundingClientRect();
        const dx = (event.clientX - rect.left - rect.width / 2) / rect.width;
        const dy = (event.clientY - rect.top - rect.height / 2) / rect.height;
        button.style.setProperty("--magnetic-x", `${dx * 7}px`);
        button.style.setProperty("--magnetic-y", `${dy * 7}px`);
      });
      button.addEventListener("pointerleave", () => {
        button.style.setProperty("--magnetic-x", "0px");
        button.style.setProperty("--magnetic-y", "0px");
      });
    });
  }

  // Scroll-parallax gives the hero portrait, decorative orbs and project visual a little depth.
  if (!reducedMotion) {
    const parallaxItems = [
      { element: document.querySelector(".hero-portrait"), speed: 0.12 },
      { element: document.querySelector(".orbit-one"), speed: -0.18 },
      { element: document.querySelector(".orbit-two"), speed: 0.22 },
      { element: document.querySelector(".motion-orb-a"), speed: -0.08 },
      { element: document.querySelector(".motion-orb-b"), speed: 0.1 },
    ].filter((item) => item.element);
    let parallaxTicking = false;
    const updateParallax = () => {
      const scrollY = window.scrollY;
      parallaxItems.forEach(({ element, speed }) => {
        element.style.setProperty("--parallax-y", `${scrollY * speed}px`);
      });
      parallaxTicking = false;
    };
    window.addEventListener("scroll", () => {
      if (!parallaxTicking) { requestAnimationFrame(updateParallax); parallaxTicking = true; }
    }, { passive: true });
    updateParallax();
  }

  // Canvas particle effects. The canvas ignores pointer input and is removed from
  // accessibility trees; photo buttons remain keyboard accessible.
  let particleCanvas = null;
  let context = null;
  let particles = [];
  let animationFrame = 0;
  const palette = {
    fireworks: ["#f7d77b", "#d7e7b7", "#ffffff", "#91b89e", "#e8a98c"],
    sparkles: ["#f7d77b", "#ffffff", "#c6d9a6", "#b3c9e9"],
    team: ["#f2c46d", "#8cb6a0", "#e9a9a0", "#a9bde2", "#f5f1d7"],
    celebrate: ["#f2c46d", "#8cb6a0", "#e9a9a0", "#ffffff"],
  };

  function ensureCanvas() {
    if (particleCanvas) return;
    particleCanvas = document.createElement("canvas");
    particleCanvas.className = "firework-canvas";
    particleCanvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(particleCanvas);
    context = particleCanvas.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });
  }

  function resizeCanvas() {
    if (!particleCanvas || !context) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    particleCanvas.width = Math.floor(window.innerWidth * ratio);
    particleCanvas.height = Math.floor(window.innerHeight * ratio);
    particleCanvas.style.width = `${window.innerWidth}px`;
    particleCanvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function burst(x, y, type = "fireworks", scale = 1) {
    if (reducedMotion) return;
    ensureCanvas();
    const colors = palette[type] || palette.fireworks;
    const count = Math.round((type === "sparkles" ? 44 : type === "fireworks" ? 82 : 64) * scale);
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count + Math.random() * 0.12;
      const speed = (type === "sparkles" ? 1.1 : 1.8) + Math.random() * (type === "fireworks" ? 4.3 : 3.3);
      particles.push({
        x, y, prevX: x, prevY: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - (type === "fireworks" ? 1.3 : .4),
        life: 1.0 + Math.random() * .55, decay: .007 + Math.random() * .006,
        size: type === "sparkles" ? 1.2 + Math.random() * 2.4 : 2 + Math.random() * 3.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: type === "team" || type === "celebrate" ? "confetti" : type === "sparkles" ? "star" : "dot",
        rotation: Math.random() * Math.PI, spin: (Math.random() - .5) * .18,
        gravity: type === "fireworks" ? .045 : .07,
      });
    }
    if (!animationFrame) animationFrame = requestAnimationFrame(drawParticles);
  }

  function drawStar(ctx, x, y, radius) {
    ctx.beginPath();
    for (let point = 0; point < 10; point += 1) {
      const r = point % 2 === 0 ? radius : radius * .42;
      const angle = -Math.PI / 2 + point * Math.PI / 5;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      if (point === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  function drawParticles() {
    if (!context || !particleCanvas) { animationFrame = 0; return; }
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles = particles.filter((particle) => particle.life > 0);
    particles.forEach((p) => {
      p.prevX = p.x; p.prevY = p.y;
      p.x += p.vx; p.y += p.vy; p.vx *= .986; p.vy = p.vy * .988 + p.gravity;
      p.rotation += p.spin; p.life -= p.decay;
      context.save();
      context.globalAlpha = Math.max(0, Math.min(1, p.life));
      context.fillStyle = p.color;
      if (p.shape === "dot" && p.life > .18) {
        context.strokeStyle = p.color;
        context.globalAlpha = Math.max(0, Math.min(.6, p.life * .55));
        context.lineWidth = Math.max(1, p.size * .7);
        context.beginPath(); context.moveTo(p.prevX, p.prevY); context.lineTo(p.x, p.y); context.stroke();
        context.globalAlpha = Math.max(0, Math.min(1, p.life));
      }
      if (p.shape === "confetti") {
        context.translate(p.x, p.y); context.rotate(p.rotation);
        context.fillRect(-p.size, -p.size * .55, p.size * 2.1, p.size * 1.1);
      } else if (p.shape === "star") {
        drawStar(context, p.x, p.y, p.size * 1.8);
      } else {
        context.beginPath(); context.arc(p.x, p.y, p.size, 0, Math.PI * 2); context.fill();
      }
      context.restore();
    });
    if (particles.length) animationFrame = requestAnimationFrame(drawParticles);
    else { context.clearRect(0, 0, window.innerWidth, window.innerHeight); animationFrame = 0; }
  }

  function celebratePhoto(button, fromScroll = false) {
    if (reducedMotion || !button) return;
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width * (.25 + Math.random() * .5);
    const y = rect.top + rect.height * (.2 + Math.random() * .35);
    const type = button.dataset.photoEffect || "fireworks";
    button.classList.remove("is-celebrating");
    // Restart the micro-animation even when the user clicks repeatedly.
    void button.offsetWidth;
    button.classList.add("is-celebrating");
    window.setTimeout(() => button.classList.remove("is-celebrating"), 950);

    if (type === "fireworks") {
      // A multi-point celebration deliberately uses the whole viewport, not just the photo.
      const scale = fromScroll ? .72 : 1.08;
      const points = [
        [x, y],
        [window.innerWidth * .16, window.innerHeight * .22],
        [window.innerWidth * .84, window.innerHeight * .2],
        [window.innerWidth * .22, window.innerHeight * .74],
        [window.innerWidth * .79, window.innerHeight * .72],
      ];
      points.forEach(([bx, by], index) => {
        window.setTimeout(() => burst(bx, by, "fireworks", scale * (index === 0 ? 1 : .78)), index * 115);
      });
    } else if (type === "sparkles") {
      burst(x, y, "sparkles", fromScroll ? .9 : 1.45);
      if (!fromScroll) {
        window.setTimeout(() => burst(window.innerWidth * .22, window.innerHeight * .25, "sparkles", .9), 90);
        window.setTimeout(() => burst(window.innerWidth * .78, window.innerHeight * .68, "sparkles", .9), 180);
      }
    } else if (type === "team") {
      const scale = fromScroll ? .9 : 1.35;
      burst(x, y, "team", scale);
      window.setTimeout(() => burst(window.innerWidth * .18, window.innerHeight * .22, "team", .75), 110);
      window.setTimeout(() => burst(window.innerWidth * .82, window.innerHeight * .74, "team", .75), 230);
      if (!fromScroll) window.setTimeout(() => burst(x + 40, y - 18, "sparkles", 1), 130);
    } else {
      burst(x, y, "celebrate", fromScroll ? 1 : 1.5);
      window.setTimeout(() => burst(window.innerWidth * .5, window.innerHeight * .18, "sparkles", .85), 140);
    }
  }

  document.querySelectorAll(".photo-trigger[data-photo-effect]").forEach((button) => {
    button.addEventListener("click", () => celebratePhoto(button, false));
  });

  // Fireworks and other small effects replay when the corresponding photo re-enters view.
  if (!reducedMotion && "IntersectionObserver" in window) {
    const photoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.effectVisible) {
          entry.target.dataset.effectVisible = "true";
          celebratePhoto(entry.target, true);
        } else if (!entry.isIntersecting) {
          delete entry.target.dataset.effectVisible;
        }
      });
    }, { threshold: .24, rootMargin: "0px 0px -4% 0px" });
    document.querySelectorAll(".photo-trigger[data-photo-effect]").forEach((button) => photoObserver.observe(button));
  }

  // Bootstrap modal uses the same photo button; update its content at launch time.
  const photoModal = document.getElementById("photoModal");
  if (photoModal) {
    photoModal.addEventListener("show.bs.modal", (event) => {
      const trigger = event.relatedTarget;
      if (!trigger) return;
      const image = trigger.querySelector("img");
      const modalImage = document.getElementById("photoModalImage");
      const modalCaption = document.getElementById("photoModalCaption");
      if (image && modalImage) {
        modalImage.src = image.currentSrc || image.src;
        modalImage.alt = image.alt || "Portfolio photograph";
      }
      const figureCaption = trigger.closest("figure")?.querySelector("figcaption");
      if (modalCaption) {
        // Clone the authored caption markup so person and organisation links
        // remain clickable in the enlarged photo view. Cloning also preserves
        // the currently selected language's translated text and attributes.
        modalCaption.replaceChildren();
        if (figureCaption) {
          Array.from(figureCaption.childNodes).forEach((node) => {
            modalCaption.appendChild(node.cloneNode(true));
          });
        } else {
          modalCaption.textContent = image?.alt || "";
        }
      }
    });
    photoModal.addEventListener("hidden.bs.modal", () => {
      const modalImage = document.getElementById("photoModalImage");
      if (modalImage) { modalImage.removeAttribute("src"); modalImage.alt = ""; }
    });
  }

  // Reading progress line.
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);
  let ticking = false;
  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, amount))})`;
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
  }, { passive: true });
  updateProgress();
})();
