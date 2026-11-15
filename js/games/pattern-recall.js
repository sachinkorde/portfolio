// Pattern Recall — watch the sequence of lit pads, repeat it. One step longer each round.

export default function start({ stage, setScore, gameOver, beep }) {
  const pads = [
    { c: "#22d3ee", f: 330 }, { c: "#a855f7", f: 392 },
    { c: "#f472b6", f: 494 }, { c: "#fbbf24", f: 587 },
  ];
  let seq = [], idx = 0, accepting = false, alive = true;
  const timers = [];

  stage.innerHTML = `<div class="g-wrap"><div class="g-bar mono"><span>Round <b id="prRound">0</b></span><span id="prMsg">Watch…</span></div>
    <div class="pr-grid">${pads.map((p, i) => `<button class="pr-pad" data-i="${i}" style="--c:${p.c}" aria-label="Pad ${i + 1}"></button>`).join("")}</div></div>`;
  const els = [...stage.querySelectorAll(".pr-pad")];
  const msg = (t) => (stage.querySelector("#prMsg").textContent = t);

  function flash(i, ms = 380) {
    els[i].classList.add("lit");
    beep(pads[i].f, ms / 1000 * 0.9, "sine", 0.08);
    timers.push(setTimeout(() => els[i].classList.remove("lit"), ms));
  }
  function nextRound() {
    if (!alive) return;
    seq.push((Math.random() * 4) | 0);
    idx = 0; accepting = false;
    stage.querySelector("#prRound").textContent = seq.length;
    msg("Watch…");
    const gap = Math.max(260, 600 - seq.length * 25);
    seq.forEach((p, k) => timers.push(setTimeout(() => flash(p, gap * 0.7), 600 + k * gap)));
    timers.push(setTimeout(() => { accepting = true; msg("Your turn!"); }, 600 + seq.length * gap));
  }

  stage.querySelector(".pr-grid").addEventListener("pointerdown", (e) => {
    const b = e.target.closest(".pr-pad");
    if (!b || !accepting) return;
    const i = +b.dataset.i;
    flash(i, 220);
    if (i !== seq[idx]) {
      accepting = false; alive = false;
      beep(130, 0.4, "sawtooth");
      const score = (seq.length - 1) * 100;
      timers.push(setTimeout(() => gameOver(score, `Reached round ${seq.length}`), 500));
      return;
    }
    idx++;
    if (idx === seq.length) { accepting = false; setScore(seq.length * 100); msg("Nice! ✓"); timers.push(setTimeout(nextRound, 700)); }
  });

  timers.push(setTimeout(nextRound, 300));
  return () => { alive = false; timers.forEach(clearTimeout); };
}
