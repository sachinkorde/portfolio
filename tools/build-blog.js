// ============================================================
//  Blog builder — turns blog/_posts.js into static, SEO-ready pages.
//  Run from the project folder:   node tools/build-blog.js
//  Generates: blog/<slug>.html, blog/index.html, sitemap.xml,
//  and the "Case studies" cards on the homepage (index.html).
// ============================================================
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://sachinkorde.github.io/portfolio/";
const BLOG = SITE + "blog/";
const DATE = "2026-11-15";
const AUTHOR = { name: "Sachin Korde", url: SITE, linkedin: "https://www.linkedin.com/in/sachinkorde/" };
const posts = require(path.join(ROOT, "blog", "_posts.js"));

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function inline(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, (_, t, u) => {
      const ext = /^https?:/.test(u) && !u.startsWith(SITE);
      return `<a href="${u}"${ext ? ' target="_blank" rel="noopener"' : ""}>${t}</a>`;
    });
}
const plain = (s) => s.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/\[(.+?)\]\((.+?)\)/g, "$1");
function renderBody(blocks) {
  return blocks.map(([t, v]) => {
    if (t === "h2") return `<h2 id="${v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}">${inline(v)}</h2>`;
    if (t === "p") return `<p>${inline(v)}</p>`;
    if (t === "ul") return `<ul>${v.map((li) => `<li>${inline(li)}</li>`).join("")}</ul>`;
    if (t === "quote") return `<blockquote>${inline(v)}</blockquote>`;
    return "";
  }).join("\n      ");
}
const words = (p) => p.body.map(([, v]) => (Array.isArray(v) ? v.join(" ") : v)).join(" ").split(/\s+/).length;
const readMins = (p) => Math.max(2, Math.round(words(p) / 200));

function head({ title, description, keywords, url, image, type, jsonld, extra = "" }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="keywords" content="${esc(keywords)}" />
  <meta name="author" content="Sachin Korde" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="geo.region" content="IN-MH" />
  <meta name="geo.placename" content="Pune" />
  <link rel="canonical" href="${url}" />
  <meta name="theme-color" content="#070a14" />
  <link rel="icon" href="../favicon.svg" type="image/svg+xml" />
  <meta property="og:type" content="${type}" />
  <meta property="og:site_name" content="Sachin Korde — Unity Game Developer" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:locale" content="en_IN" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${image}" />${extra}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../css/blog.css?v=2" />
  <script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>`;
}

const nav = `
  <header class="b-nav">
    <div class="b-wrap b-nav-in">
      <a class="b-logo" href="../"><span class="b-mark">SK</span><span>Sachin.Korde</span></a>
      <nav class="b-links">
        <a href="../#levels">Projects</a>
        <a href="../#arcade">Arcade</a>
        <a href="./">Blog</a>
        <a class="b-hire" href="../#contact">Hire Me</a>
      </nav>
    </div>
  </header>`;

const footer = `
  <footer class="b-foot">
    <div class="b-wrap">
      <p><strong>Sachin Korde</strong> · Unity Game Developer in Pune, Maharashtra, India · Available for full-time &amp; freelance work</p>
      <p><a href="${SITE}">Portfolio</a> · <a href="./">Blog</a> · <a href="${SITE}#arcade">Play 10 mini-games</a> · <a href="${AUTHOR.linkedin}" target="_blank" rel="noopener">LinkedIn</a> · <a href="mailto:sachinkorde1993@gmail.com">Email</a></p>
    </div>
  </footer>`;

const personRef = { "@type": "Person", "@id": SITE + "#person", name: AUTHOR.name, url: SITE, jobTitle: "Unity 3D Game Developer", sameAs: [AUTHOR.linkedin, "https://github.com/sachinkorde"], address: { "@type": "PostalAddress", addressLocality: "Pune", addressRegion: "Maharashtra", addressCountry: "IN" } };

// ---------- Image alt text + featured images (SEO) ----------
const IMG = {
  "tmkoc-playschool-unity-kids-learning-app-case-study": { alt: "TMKOC Playschool Kids Learning app icon, a Unity e-learning game for children based on the TMKOC TV serial" },
  "tmkoc-games-unity-performance-optimization": { alt: "Run Jetha Run TMKOC endless runner game icon featuring Jethalal, optimized in Unity" },
  "kiddopia-k-man-flying-pathpuzzle-unity-2d-spine": { alt: "Kiddopia kids learning app icon, home of K-Man Flying and PathPuzzle Unity 2D games" },
  "digital-pressure-testing-unity-3d-oil-gas-digital-twin": { alt: "Digital Pressure Testing (DPT) software on a tablet at an oil and gas drilling rig at night" },
  "cadaviz-virtual-dissection-table-unity-developer": { alt: "Cadaviz virtual human dissection table used by medical colleges for 3D anatomy learning" },
  "diwali-liveops-event-unity-cooking-super-star-world-of-carrom": { alt: "Cooking Super Star Tasty City game icon, an AppOn mobile cooking game with a Diwali event" },
  "augment-works-web-developer-to-unity-ar-vr-developer": { alt: "Magic Joey logo, an augmented reality learning cards app for kids built in Unity" },
  "real-time-multiplayer-card-casino-games-unity": { src: SITE + "assets/projects/rummy-card-games.svg", alt: "Illustration of a multiplayer Rummy card game: playing cards on a green table with four players" },
  "hire-unity-game-developer-pune": { alt: "Sachin Korde, Unity game developer in Pune, available for hire: full-time and freelance" },
};
const imgOf = (p, small) => ({ src: ((IMG[p.slug] && IMG[p.slug].src) || p.image).replace(/=s512$/, small ? "=s256-rw" : "=s512-rw"), alt: (IMG[p.slug] && IMG[p.slug].alt) || `${p.title} - case study by Sachin Korde` });

// ---------- Post pages ----------
posts.forEach((p, i) => {
  const url = BLOG + p.slug + ".html";
  const hero = imgOf(p);
  const nextPosts = [posts[(i + 1) % posts.length], posts[(i + 2) % posts.length], posts[(i + 3) % posts.length]].filter((q) => q !== p);
  const toc = p.body.filter(([t]) => t === "h2").map(([, v]) => `<li><a href="#${v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}">${inline(v)}</a></li>`).join("");
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: p.title,
        description: p.description,
        image: { "@type": "ImageObject", url: hero.src, caption: hero.alt },
        datePublished: DATE,
        dateModified: DATE,
        author: personRef,
        publisher: personRef,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        keywords: p.keywords.join(", "),
        articleSection: "Case Studies",
        inLanguage: "en-IN",
        wordCount: words(p),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Portfolio", item: SITE },
          { "@type": "ListItem", position: 2, name: "Blog", item: BLOG },
          { "@type": "ListItem", position: 3, name: p.title, item: url },
        ],
      },
    ],
  };
  const html = `${head({
    title: p.seoTitle, description: p.description, keywords: p.keywords.join(", "), url, image: p.image, type: "article", jsonld,
    extra: `\n  <meta property="article:published_time" content="${DATE}" />\n  <meta property="article:author" content="${SITE}" />${p.tags.map((t) => `\n  <meta property="article:tag" content="${esc(t)}" />`).join("")}`,
  })}
<body>${nav}
  <main class="b-wrap b-post">
    <nav class="b-crumbs mono" aria-label="Breadcrumb"><a href="../">Portfolio</a> / <a href="./">Blog</a> / <span>Case study</span></nav>
    <article>
      <header class="b-head">
        <p class="b-kicker mono">CASE STUDY · ${esc(p.company)}${p.period ? " · " + esc(p.period) : ""}</p>
        <h1>${esc(p.title)}</h1>
        <p class="b-lead">${esc(p.description)}</p>
        <div class="b-meta mono">
          <span>By <a href="${SITE}">Sachin Korde</a>, Unity Developer, Pune</span>
          <span>${readMins(p)} min read</span>
          <time datetime="${DATE}">15 Nov 2026</time>
        </div>
        <div class="b-tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      </header>
      <figure class="b-hero">
        <img src="${hero.src}" alt="${esc(hero.alt)}" width="640" height="360" fetchpriority="high" decoding="async" referrerpolicy="no-referrer" />
        <figcaption class="mono">${esc(hero.alt)}</figcaption>
      </figure>
      <div class="b-grid">
        <div class="b-body">
      ${renderBody(p.body)}
      ${p.links.length ? `<div class="b-links-box"><strong>Links</strong><ul>${p.links.map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener">${esc(l.label)} ↗</a></li>`).join("")}</ul></div>` : ""}
        </div>
        <aside class="b-side">
          ${toc ? `<div class="b-card"><p class="mono b-side-t">ON THIS PAGE</p><ul class="b-toc">${toc}</ul></div>` : ""}
          <div class="b-card b-cta">
            <p class="mono b-side-t">🟢 AVAILABLE FOR HIRE</p>
            <p>Need a Unity developer for your game? Full-time, freelance or remote, based in Pune.</p>
            <a class="b-btn" href="${SITE}#contact">Hire Sachin</a>
            <a class="b-btn ghost" href="${SITE}assets/Sachin_Korde_Resume.pdf">Resume (PDF)</a>
          </div>
        </aside>
      </div>
    </article>

    <section class="b-author">
      <div class="b-avatar">SK</div>
      <div>
        <p class="mono b-side-t">ABOUT THE AUTHOR</p>
        <p><strong>Sachin Korde</strong> is a Unity 3D game developer in Pune, India with 5+ years of experience in mobile games, AR/VR and real-time multiplayer. He has worked on official TMKOC games, Kiddopia, Cadaviz and Aquila's Digital Pressure Testing platform. <a href="${SITE}">See the portfolio →</a></p>
      </div>
    </section>

    <section class="b-related">
      <h2>More case studies</h2>
      <div class="b-cards">${nextPosts.map((q) => card(q, "")).join("")}</div>
    </section>
  </main>${footer}
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, "blog", p.slug + ".html"), html);
});

function card(q, prefix) {
  return `
        <a class="b-pcard" href="${prefix}${q.slug}.html">
          <span class="b-pimg"><img src="${imgOf(q, true).src.replace(SITE, prefix ? "" : "../")}" alt="${esc(imgOf(q).alt)}" width="640" height="360" loading="lazy" decoding="async" referrerpolicy="no-referrer" /></span>
          <span class="b-pbody">
            <span class="mono b-pk">${esc(q.company)}</span>
            <span class="b-pt">${esc(q.title)}</span>
            <span class="b-pd">${esc(q.description)}</span>
            <span class="mono b-pr">${readMins(q)} min read →</span>
          </span>
        </a>`;
}

// ---------- Blog index ----------
const indexJsonld = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": BLOG + "#blog",
  name: "Sachin Korde — Unity Game Development Blog & Case Studies",
  url: BLOG,
  description: "Case studies and articles by Sachin Korde, a Unity game developer in Pune: TMKOC games, Kiddopia, AR/VR, industrial 3D and multiplayer games.",
  author: personRef,
  inLanguage: "en-IN",
  blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: BLOG + p.slug + ".html", datePublished: DATE, image: p.image, author: { "@id": SITE + "#person" } })),
};
fs.writeFileSync(path.join(ROOT, "blog", "index.html"), `${head({
  title: "Unity Game Development Blog & Case Studies | Sachin Korde, Pune",
  description: "Case studies from a Unity game developer in Pune: building TMKOC Playschool, optimizing TMKOC games, Kiddopia kids games, AR/VR apps, industrial 3D digital twins and multiplayer card games.",
  keywords: "Unity game development blog, Unity case study, Unity developer Pune, game developer portfolio India, TMKOC games, Kiddopia, AR VR developer Pune",
  url: BLOG, image: SITE + "og-image.png", type: "website", jsonld: indexJsonld,
})}
<body>${nav}
  <main class="b-wrap">
    <header class="b-head b-index-head">
      <p class="b-kicker mono">BLOG · CASE STUDIES</p>
      <h1>Unity game development case studies</h1>
      <p class="b-lead">Real projects I've worked on as a Unity developer in Pune: what the project was, what I built, the problems I solved and what I learned. From official TMKOC games and Kiddopia to AR/VR, industrial 3D and multiplayer card games.</p>
    </header>
    <div class="b-cards b-cards-index">${posts.map((p) => card(p, "")).join("")}
    </div>
  </main>${footer}
</body>
</html>
`);

// ---------- Portfolio projects (read from js/data.js) ----------
const vm = require("vm");
const ctx = {};
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "js", "data.js"), "utf8") + ";this.PORTFOLIO=PORTFOLIO;", ctx);
const projects = ctx.PORTFOLIO.projects;
const abs = (u) => (/^https?:/.test(u) ? u : SITE + u);
const projImg = (p) => (p.image || p.icon ? { src: abs(p.image || p.icon), alt: p.alt || p.title } : null);

// ---------- Sitemap (with image entries for Google Images) ----------
const imgTag = (im) => `\n    <image:image>\n      <image:loc>${esc(im.src)}</image:loc>\n    </image:image>`;
const seenImg = new Set();
const homeImgs = [{ src: SITE + "og-image.png" }, ...projects.map(projImg).filter(Boolean)].filter((im) => !seenImg.has(im.src) && seenImg.add(im.src));
const urls = [
  { loc: SITE, pr: "1.0", imgs: homeImgs },
  { loc: BLOG, pr: "0.9", imgs: [] },
  ...posts.map((p) => ({ loc: BLOG + p.slug + ".html", pr: "0.8", imgs: [imgOf(p)] })),
  { loc: SITE + "assets/Sachin_Korde_Resume.pdf", pr: "0.6", imgs: [] },
];
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${DATE}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${u.pr}</priority>${u.imgs.map(imgTag).join("")}\n  </url>`).join("\n")}
</urlset>
`);

// ---------- Projects as structured data (ItemList of CreativeWork) ----------
const projectsLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Unity game development projects by Sachin Korde",
  itemListElement: projects.map((p, i) => {
    const im = projImg(p);
    const item = {
      "@type": p.link && /play\.google/.test(p.link) ? "SoftwareApplication" : "CreativeWork",
      name: p.title,
      description: p.description,
      creator: { "@id": SITE + "#person" },
      keywords: (p.tags || []).join(", "),
    };
    if (item["@type"] === "SoftwareApplication") { item.applicationCategory = "GameApplication"; item.operatingSystem = "Android"; }
    if (im) item.image = { "@type": "ImageObject", url: im.src, caption: im.alt };
    if (p.link) item.url = p.link;
    return { "@type": "ListItem", position: i + 1, item };
  }),
};

// ---------- Plain-HTML project list for no-JS visitors and crawlers ----------
const noscript = `<noscript>
          <ul class="noscript-projects">${projects.map((p) => {
            const im = projImg(p);
            return `
            <li>${im ? `<img src="${esc(im.src.replace(SITE, ""))}" alt="${esc(im.alt)}" width="96" height="54" loading="lazy" />` : ""}<strong>${esc(p.title)}</strong>${p.org ? ` (${esc(p.org)})` : ""}: ${esc(p.description)}${p.link ? ` <a href="${esc(p.link)}">${esc(p.linkLabel || "View")}</a>` : ""}</li>`;
          }).join("")}
          </ul>
        </noscript>`;

// ---------- Homepage cards (static HTML so Google can read them) ----------
const indexPath = path.join(ROOT, "index.html");
let home = fs.readFileSync(indexPath, "utf8");
const START = "<!-- BLOG:START -->", END = "<!-- BLOG:END -->";
if (home.includes(START)) {
  const cards = posts.slice(0, 6).map((p) => card(p, "blog/")).join("");
  home = home.replace(new RegExp(`${START}[\\s\\S]*?${END}`), `${START}${cards}\n        ${END}`);
}
const swap = (a, b, content) => {
  const s = home.indexOf(a), e = home.indexOf(b);
  if (s >= 0 && e > s) home = home.slice(0, s + a.length) + content + home.slice(e);
};
swap("<!-- PROJECTS-LD:START -->", "<!-- PROJECTS-LD:END -->", `\n  <script type="application/ld+json">${JSON.stringify(projectsLd)}</script>\n  `);
swap("<!-- PROJECTS-NOSCRIPT:START -->", "<!-- PROJECTS-NOSCRIPT:END -->", `\n        ${noscript}\n        `);
fs.writeFileSync(indexPath, home);

console.log(`Built ${posts.length} posts + blog index + sitemap (${urls.length} URLs).`);
