// ============================================================
//  ARCADE — 10 small original browser games.
//  Each game lives in js/games/<id>.js and is only downloaded
//  when someone opens it, so the main page stays fast.
// ============================================================

const GAMES = [
  { id: "coin-hopper",   title: "Coin Hopper",   genre: "Platformer", icon: "🪙", desc: "Jump across floating platforms and grab coins. Double-jump to survive!", controls: "Space / ↑ / tap to jump" },
  { id: "block-breaker", title: "Block Breaker", genre: "Arcade",     icon: "🧱", desc: "Bounce the ball, smash every block, don't let it fall.", controls: "Mouse / drag / ← →" },
  { id: "rock-dodge",    title: "Rock Dodge",    genre: "Survival",   icon: "☄️", desc: "Steer your ship through a falling meteor shower. How long can you last?", controls: "Mouse / drag / ← →" },
  { id: "memory-match",  title: "Memory Match",  genre: "Puzzle",     icon: "🃏", desc: "Flip cards and find all 8 pairs in as few moves as possible.", controls: "Click / tap cards" },
  { id: "tile-shift",    title: "Tile Shift",    genre: "Puzzle",     icon: "🔢", desc: "Slide the tiles back into order 1–8. Classic brain teaser.", controls: "Click / tap a tile" },
  { id: "circuit-flip",  title: "Circuit Flip",  genre: "Logic",      icon: "💡", desc: "Each switch flips its neighbours. Power up the whole board.", controls: "Click / tap nodes" },
  { id: "bug-smash",     title: "Bug Smash",     genre: "Reflex",     icon: "🐞", desc: "Squash the bugs before they escape. Avoid the bombs! 30 seconds.", controls: "Click / tap bugs" },
  { id: "pattern-recall",title: "Pattern Recall",genre: "Memory",     icon: "🎵", desc: "Watch the light pattern, then repeat it. It grows every round.", controls: "Click / tap pads" },
  { id: "quick-draw",    title: "Quick Draw",    genre: "Reaction",   icon: "⚡", desc: "Wait for green, then tap as fast as you can. 5 rounds.", controls: "Click / tap / Space" },
  { id: "code-typer",    title: "Code Typer",    genre: "Typing",     icon: "⌨️", desc: "Type real C# Unity snippets against the clock. Devs only 😎", controls: "Keyboard" },
];

// Bump this when you change any game file, so visitors get the new version.
const GAMES_VERSION = 2;

const $ = (s, r = document) => r.querySelector(s);
const store = {
  get(k) { try { return +localStorage.getItem("arcade_" + k) || 0; } catch (_) { return 0; } },
  set(k, v) { try { localStorage.setItem("arcade_" + k, v); } catch (_) {} },
};

// ---------- Tiny sound helper ----------
let audio;
function beep(freq = 440, dur = 0.08, type = "square", vol = 0.05) {
  if (store.get("muted")) return;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const o = audio.createOscillator(), g = audio.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + dur);
    o.connect(g).connect(audio.destination);
    o.start(); o.stop(audio.currentTime + dur);
  } catch (_) {}
}

// ---------- Grid ----------
const grid = $("#arcadeGrid");
function renderGrid() {
  let total = 0;
  grid.innerHTML = GAMES.map((g, i) => {
    const best = store.get(g.id);
    total += best;
    return `
      <button class="arcade-card reveal visible" data-id="${g.id}" style="--i:${i}">
        <span class="ac-icon" aria-hidden="true">${g.icon}</span>
        <span class="ac-genre mono">${g.genre}</span>
        <span class="ac-title">${g.title}</span>
        <span class="ac-desc">${g.desc}</span>
        <span class="ac-foot mono"><span>${best ? "BEST " + best : "NEW"}</span><span class="ac-play">PLAY ▶</span></span>
      </button>`;
  }).join("");
  $("#arcadeTotal").textContent = total.toLocaleString();
}
renderGrid();

// ---------- Modal player ----------
const modal = $("#arcadeModal");
const stage = $("#amStage");
let cleanup = null, current = null, lastFocus = null;

function setScore(n) { $("#amScore").textContent = n; }
function gameOver(score, msg = "Game over") {
  const best = store.get(current.id);
  const isBest = score > best;
  if (isBest) store.set(current.id, score);
  $("#amOverTitle").textContent = msg;
  $("#amOverScore").textContent = score;
  $("#amOverBest").textContent = isBest ? "🏆 New best score!" : "Best: " + Math.max(best, score);
  $("#amOver").hidden = false;
  $("#amBest").textContent = Math.max(best, score);
  beep(isBest ? 880 : 220, 0.25, "triangle", 0.06);
  setTimeout(() => $("#amAgain").focus(), 50);
}

async function open(id) {
  current = GAMES.find((g) => g.id === id);
  if (!current) return;
  lastFocus = document.activeElement;
  $("#amTitle").textContent = current.title;
  $("#amControls").textContent = current.controls;
  $("#amBest").textContent = store.get(id);
  modal.hidden = false;
  document.body.classList.add("modal-open");
  $("#amClose").focus();
  await launch();
}

async function launch() {
  if (cleanup) { try { cleanup(); } catch (_) {} cleanup = null; }
  $("#amOver").hidden = true;
  setScore(0);
  stage.innerHTML = `<div class="am-loading mono">Loading ${current.title}…</div>`;
  try {
    const mod = await import(`./games/${current.id}.js?v=${GAMES_VERSION}`);
    stage.innerHTML = "";
    cleanup = mod.default({
      stage, setScore, gameOver, beep,
      reduceMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  } catch (e) {
    console.error(e);
    stage.innerHTML = `<div class="am-loading">Couldn't load this game. Check your connection and try again.</div>`;
  }
}

function close() {
  if (cleanup) { try { cleanup(); } catch (_) {} cleanup = null; }
  stage.innerHTML = "";
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  renderGrid();
  if (lastFocus) lastFocus.focus();
}

grid.addEventListener("click", (e) => { const c = e.target.closest(".arcade-card"); if (c) open(c.dataset.id); });
$("#amClose").addEventListener("click", close);
$("#amRestart").addEventListener("click", launch);
$("#amAgain").addEventListener("click", launch);
modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) close(); });

const muteBtn = $("#amMute");
const syncMute = () => (muteBtn.textContent = store.get("muted") ? "🔇" : "🔊");
muteBtn.addEventListener("click", () => { store.set("muted", store.get("muted") ? 0 : 1); syncMute(); });
syncMute();

// Deep link: #play-coin-hopper opens a game directly (shareable)
function fromHash() { const m = location.hash.match(/^#play-(.+)$/); if (m) open(m[1]); }
addEventListener("hashchange", fromHash);
fromHash();
