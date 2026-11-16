// Builds /games/<slug>.html landing pages and /games/index.html from games/_games.js.
// Called by tools/build-blog.js (which provides the shared HTML helpers).
const fs = require("fs");
const path = require("path");

module.exports = function buildGames({ ROOT, SITE, DATE, esc, inline, plain, head, nav, footer, personRef }) {
  const games = require(path.join(ROOT, "games", "_games.js"));
  const GAMES = SITE + "games/";
  const navG = nav.replace('<a href="./">Blog</a>', '<a href="../blog/">Blog</a>').replace('<a href="../#arcade">Arcade</a>', '<a href="./">Games</a>');
  const playUrl = (g, src) => `${g.play}&referrer=utm_source%3Dsachinkorde.online%26utm_medium%3D${src}%26utm_campaign%3D${g.slug}`;
  const img = (g, n) => `../assets/games/${g.slug}-${n}.webp`;
  const abs = (g, n) => `${SITE}assets/games/${g.slug}-${n}.webp`;
  const playBtn = (g, src, cls = "") => `<a class="g-play ${cls}" href="${playUrl(g, src)}" rel="noopener" aria-label="Get ${esc(g.name)} on Google Play"><svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22"><path fill="currentColor" d="M3.6 2.3 13.4 12l-9.8 9.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1Zm11.2 11.1 2.4 2.4-11 6.3 8.6-8.7Zm4.2-2.6c.6.3.9.8.9 1.2s-.3.9-.9 1.2l-2.6 1.5-2.6-2.7 2.6-2.6 2.6 1.4ZM6.2 1.9l11 6.3-2.4 2.4-8.6-8.7Z"/></svg><span><small>GET IT ON</small>Google Play</span></a>`;

  const urls = [];
  games.forEach((g, i) => {
    const url = GAMES + g.slug + ".html";
    const others = games.filter((x) => x !== g);
    const jsonld = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["VideoGame", "MobileApplication"],
          name: g.name,
          ...(g.altName ? { alternateName: g.altName } : {}),
          description: g.description,
          url,
          image: abs(g, "icon"),
          screenshot: [1, 2, 3].map((n) => abs(g, "shot" + n)),
          genre: g.genre,
          gamePlatform: "Android",
          operatingSystem: "Android",
          applicationCategory: "GameApplication",
          contentRating: g.facts.rating,
          installUrl: g.play,
          downloadUrl: g.play,
          offers: { "@type": "Offer", price: "0", priceCurrency: "INR", availability: "https://schema.org/InStock" },
          author: { "@type": "Organization", name: g.studio },
          publisher: { "@type": "Organization", name: g.studio },
          inLanguage: "en",
          keywords: g.keywords.join(", "),
        },
        { "@type": "FAQPage", mainEntity: g.faq.map(([q, a]) => ({ "@type": "Question", name: plain(q), acceptedAnswer: { "@type": "Answer", text: plain(a) } })) },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE },
            { "@type": "ListItem", position: 2, name: "Games", item: GAMES },
            { "@type": "ListItem", position: 3, name: g.name, item: url },
          ],
        },
      ],
    };
    const html = `${head({
      title: g.seoTitle, description: g.description, keywords: g.keywords.join(", "), url, image: abs(g, "icon"), type: "website", jsonld,
      extra: `\n  <link rel="preload" as="image" href="${img(g, "icon")}" fetchpriority="high" />\n  <meta name="google-play-app" content="app-id=${g.packageId}" />`,
    })}
<body>${navG}
  <main class="b-wrap g-page">
    <nav class="b-crumbs mono" aria-label="Breadcrumb"><a href="../">Home</a> / <a href="./">Games</a> / <span>${esc(g.name)}</span></nav>

    <header class="g-hero">
      <img class="g-icon" src="${img(g, "icon")}" alt="${esc(g.name)} game icon" width="128" height="128" fetchpriority="high" />
      <div class="g-hero-text">
        <p class="b-kicker mono">${esc(g.genre.toUpperCase())} GAME · ANDROID · ${esc(g.studio.toUpperCase())}</p>
        <h1>${esc(g.name)}: ${esc(g.tagline)}</h1>
        <p class="b-lead">${esc(g.description)}</p>
        <div class="g-cta">${playBtn(g, "hero")}</div>
        <ul class="g-facts mono">
          <li>💰 ${esc(g.facts.price)}</li>
          ${g.facts.offline ? "<li>📶 Plays offline</li>" : ""}
          <li>👪 ${esc(g.facts.rating)}</li>
          <li>📱 Android</li>
        </ul>
        <p class="g-small">${esc(g.facts.extras)}</p>
      </div>
    </header>

    <section class="g-shots" aria-label="${esc(g.name)} screenshots">
      ${[1, 2, 3].map((n) => `<figure><img src="${img(g, "shot" + n)}" alt="${esc(g.name)} gameplay screenshot ${n}" width="295" height="640" loading="lazy" decoding="async" /></figure>`).join("\n      ")}
    </section>

    <div class="b-body g-body">
      <h2 id="about">About ${esc(g.name)}</h2>
      ${g.intro.map((p) => `<p>${inline(p)}</p>`).join("\n      ")}

      <h2 id="how-to-play">How to play ${esc(g.name)}</h2>
      <ol class="g-steps">${g.howTo.map((s) => `<li>${inline(s)}</li>`).join("")}</ol>

      <h2 id="features">Features</h2>
      <ul>${g.features.map((s) => `<li>${inline(s)}</li>`).join("")}</ul>

      <h2 id="tips">Tips to beat more levels</h2>
      <ul>${g.tips.map((s) => `<li>${inline(s)}</li>`).join("")}</ul>

      <h2 id="why-play">Why you'll enjoy it</h2>
      <p>${inline(g.whyPlay)}</p>

      <div class="g-cta-box">
        <p><strong>Ready to play?</strong> ${esc(g.name)} is free on Google Play.</p>
        ${playBtn(g, "middle")}
      </div>

      <h2 id="faq">Frequently asked questions</h2>
      <div class="b-faq">${g.faq.map(([q, a]) => `<details><summary><h3>${inline(q)}</h3></summary><p>${inline(a)}</p></details>`).join("")}</div>
    </div>

    <section class="b-related">
      <h2>More games from ${esc(g.studio)}</h2>
      <div class="g-more">${others.map((o) => `
        <a class="g-mcard" href="${o.slug}.html"><img src="${img(o, "icon")}" alt="${esc(o.name)} game icon" width="72" height="72" loading="lazy" /><span><strong>${esc(o.name)}</strong><small>${esc(o.tagline)}</small></span></a>`).join("")}
      </div>
    </section>
  </main>
  <div class="g-sticky">${playBtn(g, "sticky", "small")}</div>${footer}
</body>
</html>
`;
    fs.writeFileSync(path.join(ROOT, "games", g.slug + ".html"), html);
    urls.push({ loc: url, pr: "0.8", imgs: [{ src: abs(g, "icon") }, ...[1, 2, 3].map((n) => ({ src: abs(g, "shot" + n) }))] });
  });

  // ---------- /games/ index ----------
  const idxLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Mobile games by GameFusion Studio",
    url: GAMES,
    hasPart: games.map((g) => ({ "@type": "VideoGame", name: g.name, url: GAMES + g.slug + ".html", image: abs(g, "icon"), genre: g.genre, gamePlatform: "Android" })),
  };
  fs.writeFileSync(path.join(ROOT, "games", "index.html"), `${head({
    title: "Free Puzzle Games for Android: Block Puzzle, Match 3 & Screw Puzzle | GameFusion Studio",
    description: "Free puzzle games for Android from GameFusion Studio: Block Puzzle, Sweet Swirl Saga (match 3) and Screw Puzzle. Relaxing brain games for all ages.",
    keywords: "free puzzle games android, block puzzle, match 3 game, screw puzzle, brain games, GameFusion Studio",
    url: GAMES, image: abs(games[0], "icon"), type: "website", jsonld: idxLd,
  })}
<body>${navG}
  <main class="b-wrap">
    <header class="b-head b-index-head">
      <p class="b-kicker mono">GAMES · GAMEFUSION STUDIO</p>
      <h1>Free puzzle games for Android</h1>
      <p class="b-lead">Relaxing, brain-training puzzle games for all ages. Pick a game to learn how to play, see screenshots and get it free on Google Play.</p>
    </header>
    <div class="g-list">${games.map((g) => `
      <article class="g-lcard">
        <img src="${img(g, "icon")}" alt="${esc(g.name)} game icon" width="96" height="96" />
        <div>
          <h2><a href="${g.slug}.html">${esc(g.name)}</a></h2>
          <p>${esc(g.description)}</p>
          <p class="g-lmeta mono">${esc(g.genre)} · ${esc(g.facts.price)}${g.facts.offline ? " · Offline" : ""} · ${esc(g.facts.rating)}</p>
          <div class="g-lcta"><a class="b-btn ghost" href="${g.slug}.html">About ${esc(g.name)}</a>${playBtn(g, "list", "small")}</div>
        </div>
      </article>`).join("")}
    </div>
  </main>${footer}
</body>
</html>
`);
  urls.unshift({ loc: GAMES, pr: "0.8", imgs: [] });
  return { games, urls };
};
