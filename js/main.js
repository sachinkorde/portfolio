(function () {
  const d = PORTFOLIO;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = matchMedia("(hover: hover)").matches;

  // ---------- Loader ----------
  document.body.classList.add("loading");
  (function boot() {
    const msgs = ["Loading assets", "Compiling shaders", "Spawning player", "Ready"];
    let p = 0;
    const step = () => {
      p = Math.min(100, p + 6 + Math.random() * 14);
      $("loaderFill").style.width = p + "%";
      $("loaderPct").textContent = Math.round(p) + "%";
      $("loaderMsg").textContent = msgs[Math.min(msgs.length - 1, Math.floor(p / 34))];
      if (p < 100) setTimeout(step, reduceMotion ? 20 : 70);
      else setTimeout(() => { $("loader").classList.add("done"); document.body.classList.remove("loading"); introAnim(); }, 250);
    };
    step();
  })();

  // ---------- Basic info ----------
  const initials = d.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  $("heroName").textContent = d.name;
  $("heroName").dataset.text = d.name;
  $("heroTagline").textContent = d.tagline;
  $("loaderLogo").textContent = initials;
  $("avatarInitials").textContent = initials;
  $("profileName").textContent = d.name;
  $("profileRole").textContent = d.role;
  $("profileLoc").textContent = "📍 " + d.location;
  $("hudXp").textContent = (d.yearsExp || "") + " YRS";
  $("footerName").textContent = d.name;
  $("year").textContent = new Date().getFullYear();
  document.querySelectorAll(".resume-link").forEach((a) => (a.href = d.resumeFile));
  $("emailBtn").href = `mailto:${d.email}`;
  $("socials").innerHTML = [
    `<a href="mailto:${esc(d.email)}">${esc(d.email)}</a>`,
    ...d.socials.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)} ↗</a>`),
  ].join("");

  // ---------- Typed roles ----------
  (function typed() {
    const el = $("typed");
    const roles = d.roles && d.roles.length ? d.roles : [d.role];
    if (reduceMotion) { el.textContent = roles[0]; return; }
    let r = 0, i = 0, del = false;
    (function loop() {
      const word = roles[r];
      el.textContent = word.slice(0, i);
      if (!del && i < word.length) i++;
      else if (!del) { del = true; return setTimeout(loop, 1600); }
      else if (i > 0) i--;
      else { del = false; r = (r + 1) % roles.length; }
      setTimeout(loop, del ? 35 : 75);
    })();
  })();

  // ---------- Glitch title ----------
  if (!reduceMotion) {
    const h = $("heroName");
    setInterval(() => { h.classList.add("glitching"); setTimeout(() => h.classList.remove("glitching"), 180); }, 3800);
  }

  // ---------- Company helpers ----------
  const companies = [];
  d.projects.forEach((p) => { const c = p.company || "Other"; if (!companies.includes(c)) companies.push(c); });
  const expCompany = (e) => {
    if (/freelance/i.test(e.title)) return "Freelance";
    return companies.find((c) => c !== "Other" && e.org.toLowerCase().includes(c.toLowerCase().split(" ")[0])) || null;
  };
  const isEdu = (e) => !e.points || !e.points.length || /B\.E\.|degree|bachelor/i.test(e.title);

  // ---------- Marquee (unique app icons) ----------
  const seen = new Set();
  const shipped = d.projects.filter((p) => p.icon && /play\.google/.test(p.link || "") && !seen.has(p.link) && seen.add(p.link));
  const mq = shipped.map((p) => `<a class="mq-item" href="${esc(p.link)}" target="_blank" rel="noopener"><img src="${esc(p.icon)}" alt="" loading="lazy" referrerpolicy="no-referrer" />${esc(p.title.split("|")[0].split(":")[0].trim())}</a>`).join("");
  $("marquee").innerHTML = mq + mq;

  // ---------- Stats ----------
  const jobCount = d.experience.filter((e) => !isEdu(e) && !/freelance/i.test(e.title)).length;
  $("stats").innerHTML = [
    [d.yearsExp || "", "Years XP"],
    [d.projects.length + "+", "Projects"],
    [jobCount, "Studios"],
  ].map(([v, l]) => `<div class="stat"><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join("");

  // ---------- About + skills ----------
  $("aboutText").innerHTML = d.about.map((p) => `<p>${esc(p)}</p>`).join("");
  $("skills").innerHTML = Object.entries(d.skills).map(([g, items]) => `
    <div class="skill-group"><h5>${esc(g)}</h5>
      <div class="slots">${items.map((s) => `<span class="slot">${esc(s)}</span>`).join("")}</div>
    </div>`).join("");

  // ---------- Level select ----------
  let activeTab = "All";
  function renderTabs() {
    const tabs = ["All", ...companies];
    $("tabs").innerHTML = tabs.map((t) => {
      const n = t === "All" ? d.projects.length : d.projects.filter((p) => (p.company || "Other") === t).length;
      return `<button class="tab ${t === activeTab ? "active" : ""}" role="tab" aria-selected="${t === activeTab}" data-tab="${esc(t)}">${esc(t === "Other" ? "Other Projects" : t)}<span class="count">${n}</span></button>`;
    }).join("");
  }
  function cardHTML(p, i) {
    const thumb = p.image
      ? `<img class="cover" src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" referrerpolicy="no-referrer" />`
      : p.icon
      ? `<img class="app-icon" src="${esc(p.icon)}" alt="${esc(p.title)} icon" loading="lazy" referrerpolicy="no-referrer" />`
      : `<span class="glyph">${esc(p.title.charAt(0))}</span>`;
    const isPlay = /play\.google\.com/.test(p.link || "");
    const label = p.linkLabel || (isPlay ? "▶ Google Play" : "Live");
    const links = [
      p.link && `<a class="${isPlay ? "play" : ""}" href="${esc(p.link)}" target="_blank" rel="noopener">${esc(label)} ↗</a>`,
      p.repo && `<a href="${esc(p.repo)}" target="_blank" rel="noopener">Code ↗</a>`,
    ].filter(Boolean).join("");
    const long = (p.description || "").length > 200;
    return `
      <article class="card" style="animation-delay:${Math.min(i, 6) * 60}ms">
        <div class="card-thumb">${thumb}<span class="lvl-badge">LVL ${String(i + 1).padStart(2, "0")}</span></div>
        <div class="card-body">
          ${p.org ? `<span class="card-org">${esc(p.org)}</span>` : ""}
          <h4>${esc(p.title)}</h4>
          <p>${esc(p.description)}</p>
          ${long ? `<button class="more" type="button">+ read more</button>` : ""}
          <div class="chips">${(p.tags || []).map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
          ${links ? `<div class="card-links">${links}</div>` : ""}
        </div>
      </article>`;
  }
  const car = $("carousel");
  function renderCards() {
    const list = activeTab === "All" ? d.projects : d.projects.filter((p) => (p.company || "Other") === activeTab);
    car.innerHTML = list.map(cardHTML).join("");
    car.scrollLeft = 0;
    bindTilt();
    updateCar();
  }
  function selectTab(t) {
    activeTab = t;
    renderTabs();
    renderCards();
    const btn = $("tabs").querySelector(".tab.active");
    if (btn) btn.scrollIntoView({ block: "nearest", inline: "center", behavior: reduceMotion ? "auto" : "smooth" });
  }
  $("tabs").addEventListener("click", (e) => { const b = e.target.closest(".tab"); if (b) selectTab(b.dataset.tab); });
  car.addEventListener("click", (e) => {
    const m = e.target.closest(".more");
    if (!m) return;
    const c = m.closest(".card");
    c.classList.toggle("expanded");
    m.textContent = c.classList.contains("expanded") ? "– show less" : "+ read more";
  });

  function updateCar() {
    const max = car.scrollWidth - car.clientWidth;
    $("carPrev").disabled = car.scrollLeft <= 4;
    $("carNext").disabled = car.scrollLeft >= max - 4;
    const vis = car.scrollWidth ? car.clientWidth / car.scrollWidth : 1;
    const bar = $("carProgress");
    bar.style.width = Math.max(8, vis * 100) + "%";
    bar.style.marginLeft = (max > 0 ? (car.scrollLeft / max) * (100 - vis * 100) : 0) + "%";
  }
  car.addEventListener("scroll", updateCar, { passive: true });
  addEventListener("resize", updateCar);
  const page = (dir) => car.scrollBy({ left: dir * car.clientWidth * 0.85, behavior: reduceMotion ? "auto" : "smooth" });
  $("carPrev").addEventListener("click", () => page(-1));
  $("carNext").addEventListener("click", () => page(1));

  // drag-to-scroll with mouse
  let drag = null;
  car.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse" || e.target.closest("a,button")) return; drag = { x: e.clientX, s: car.scrollLeft, moved: false }; car.style.scrollSnapType = "none"; car.style.scrollBehavior = "auto"; });
  addEventListener("pointermove", (e) => { if (!drag) return; const dx = e.clientX - drag.x; if (Math.abs(dx) > 4) drag.moved = true; car.scrollLeft = drag.s - dx; });
  addEventListener("pointerup", () => { if (!drag) return; drag = null; car.style.scrollSnapType = ""; car.style.scrollBehavior = ""; });

  // 3D tilt on cards
  function bindTilt() {
    if (!canHover || reduceMotion) return;
    car.querySelectorAll(".card").forEach((c) => {
      c.addEventListener("pointermove", (e) => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 10}deg) rotateX(${(0.5 - y) * 8}deg) translateY(-4px)`;
        c.style.setProperty("--mx", x * 100 + "%");
        c.style.setProperty("--my", y * 100 + "%");
      });
      c.addEventListener("pointerleave", () => (c.style.transform = ""));
    });
  }
  renderTabs();
  renderCards();

  // ---------- Quest log ----------
  const jobs = d.experience.filter((e) => !isEdu(e));
  let lvl = jobs.length;
  $("questList").innerHTML = d.experience.map((e, i) => {
    const edu = isEdu(e);
    const badge = edu ? "EDU" : String(lvl--).padStart(2, "0");
    const comp = edu ? null : expCompany(e);
    const games = comp ? d.projects.filter((p) => p.company === comp) : [];
    return `
      <div class="q-item ${edu ? "edu" : ""} ${i === 0 ? "open" : ""} reveal">
        <button class="q-head" type="button" aria-expanded="${i === 0}">
          <span class="q-lvl">${badge}</span>
          <span><span class="q-title">${esc(e.title)}</span><br /><span class="q-org">${esc(e.org)}</span></span>
          <span class="q-date">${esc(e.period)}</span>
          <span class="q-toggle">+</span>
        </button>
        <div class="q-body"><div>
          ${e.points && e.points.length ? `<ul>${e.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>` : ""}
          ${games.length ? `<div class="q-games">${games.map((g) => `<button type="button" data-tab="${esc(comp)}">🎮 ${esc(g.title.split("|")[0].split("—")[0].trim())}</button>`).join("")}</div>` : ""}
        </div></div>
      </div>`;
  }).join("");
  $("questList").addEventListener("click", (e) => {
    const g = e.target.closest(".q-games button");
    if (g) { selectTab(g.dataset.tab); $("levels").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); return; }
    const h = e.target.closest(".q-head");
    if (!h) return;
    const item = h.parentElement;
    const open = !item.classList.contains("open");
    item.classList.toggle("open", open);
    h.setAttribute("aria-expanded", open);
  });

  // ---------- Nav ----------
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 30);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const links = [...document.querySelectorAll(".nav-links a")];
  const secObs = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  ["profile", "levels", "arcade", "quest", "contact"].forEach((id) => secObs.observe($(id)));
  const navLinks = $("navLinks"), menuBtn = $("menuBtn");
  menuBtn.addEventListener("click", () => { navLinks.classList.toggle("open"); menuBtn.classList.toggle("open"); });
  navLinks.addEventListener("click", (e) => { if (e.target.tagName === "A") { navLinks.classList.remove("open"); menuBtn.classList.remove("open"); } });

  // ---------- Reveal ----------
  const revealIO = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("visible"); revealIO.unobserve(en.target); }
  }), { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach((el) => revealIO.observe(el));

  // ---------- Intro + scroll motion (GSAP if loaded) ----------
  function introAnim() {
    if (!window.gsap || reduceMotion) return;
    gsap.from(".hero-content > *", { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" });
    gsap.from(".hud, .hero-hint", { opacity: 0, duration: 1, delay: 0.5 });
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray(".section-head").forEach((el) =>
        gsap.from(el.children, { scrollTrigger: { trigger: el, start: "top 85%" }, y: 26, opacity: 0, duration: 0.7, stagger: 0.08, ease: "power2.out" })
      );
      gsap.to(".hero-content", { scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }, y: -120, opacity: 0 });
    }
  }
})();
