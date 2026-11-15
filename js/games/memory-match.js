// Memory Match — find all 8 pairs. Fewer moves + faster = higher score.
import { shuffle } from "./_kit.js";

export default function start({ stage, setScore, gameOver, beep }) {
  const icons = ["🎮", "🕹️", "👾", "🚀", "⭐", "💎", "🧩", "🏆"];
  const deck = shuffle([...icons, ...icons]);
  let open = [], matched = 0, moves = 0, lock = false, t0 = 0, timer;

  stage.innerHTML = `
    <div class="g-wrap">
      <div class="g-bar mono"><span>Moves: <b id="mmMoves">0</b></span><span>Time: <b id="mmTime">0</b>s</span></div>
      <div class="mm-grid">${deck.map((ic, i) => `
        <button class="mm-card" data-i="${i}" aria-label="Hidden card">
          <span class="mm-inner"><span class="mm-front">?</span><span class="mm-back">${ic}</span></span>
        </button>`).join("")}</div>
    </div>`;
  const grid = stage.querySelector(".mm-grid");
  const score = () => Math.max(0, 1200 - moves * 25 - Math.floor((performance.now() - t0) / 1000) * 5);

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".mm-card");
    if (!card || lock || card.classList.contains("flip")) return;
    if (!t0) { t0 = performance.now(); timer = setInterval(() => (stage.querySelector("#mmTime").textContent = Math.floor((performance.now() - t0) / 1000)), 250); }
    card.classList.add("flip");
    card.setAttribute("aria-label", deck[card.dataset.i]);
    open.push(card);
    beep(500, 0.04);
    if (open.length === 2) {
      moves++;
      stage.querySelector("#mmMoves").textContent = moves;
      const [a, b] = open;
      if (deck[a.dataset.i] === deck[b.dataset.i]) {
        a.classList.add("done"); b.classList.add("done");
        open = []; matched++;
        beep(880, 0.1, "triangle");
        setScore(score());
        if (matched === icons.length) { clearInterval(timer); const fin = score(); setScore(fin); setTimeout(() => gameOver(fin, `Solved in ${moves} moves!`), 500); }
      } else {
        lock = true;
        setTimeout(() => { a.classList.remove("flip"); b.classList.remove("flip"); a.setAttribute("aria-label", "Hidden card"); b.setAttribute("aria-label", "Hidden card"); open = []; lock = false; }, 750);
      }
    }
  });

  return () => clearInterval(timer);
}
