// Bug Smash — bugs pop out of 9 holes. Tap bugs (+10), avoid bombs (−30). 30 seconds.

export default function start({ stage, setScore, gameOver, beep }) {
  const HOLES = 9, DURATION = 30;
  let score = 0, left = DURATION, running = true;
  const timers = [];

  stage.innerHTML = `<div class="g-wrap"><div class="g-bar mono"><span>Time: <b id="bsTime">${DURATION}</b>s</span><span>🐞 +10 · 💣 −30</span></div>
    <div class="bs-grid">${Array.from({ length: HOLES }, (_, i) => `<button class="bs-hole" data-i="${i}" aria-label="Hole ${i + 1}"><span class="bs-item"></span></button>`).join("")}</div></div>`;
  const holes = [...stage.querySelectorAll(".bs-hole")];

  function pop() {
    if (!running) return;
    const free = holes.filter((h) => !h.classList.contains("up"));
    if (free.length) {
      const h = free[(Math.random() * free.length) | 0];
      const bomb = Math.random() < 0.18;
      const gold = !bomb && Math.random() < 0.1;
      h.dataset.kind = bomb ? "bomb" : gold ? "gold" : "bug";
      h.querySelector(".bs-item").textContent = bomb ? "💣" : gold ? "🪲" : "🐞";
      h.classList.add("up");
      const stay = Math.max(450, 1100 - (DURATION - left) * 20);
      timers.push(setTimeout(() => h.classList.remove("up", "hit"), stay));
    }
    const next = Math.max(250, 700 - (DURATION - left) * 14);
    timers.push(setTimeout(pop, next));
  }

  stage.querySelector(".bs-grid").addEventListener("pointerdown", (e) => {
    const h = e.target.closest(".bs-hole");
    if (!h || !running || !h.classList.contains("up") || h.classList.contains("hit")) return;
    h.classList.add("hit");
    const k = h.dataset.kind;
    if (k === "bomb") { score = Math.max(0, score - 30); beep(140, 0.2, "sawtooth"); stage.querySelector(".g-wrap").classList.add("shake"); setTimeout(() => stage.querySelector(".g-wrap")?.classList.remove("shake"), 300); }
    else { score += k === "gold" ? 30 : 10; beep(k === "gold" ? 1100 : 760, 0.05, "triangle"); }
    setScore(score);
    timers.push(setTimeout(() => h.classList.remove("up", "hit"), 160));
  });

  const clock = setInterval(() => {
    left--;
    const t = stage.querySelector("#bsTime"); if (t) t.textContent = left;
    if (left <= 0) { running = false; clearInterval(clock); gameOver(score, "Time's up!"); }
  }, 1000);
  timers.push(setTimeout(pop, 400));

  return () => { running = false; clearInterval(clock); timers.forEach(clearTimeout); };
}
