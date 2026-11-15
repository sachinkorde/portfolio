// Quick Draw — wait for green, then tap. 5 rounds; score from average reaction time.

export default function start({ stage, setScore, gameOver, beep }) {
  const ROUNDS = 5;
  let state = "idle", round = 0, times = [], goAt = 0, timer;

  stage.innerHTML = `<div class="g-wrap"><div class="g-bar mono"><span>Round <b id="qdRound">0</b> / ${ROUNDS}</span><span id="qdAvg">Avg: —</span></div>
    <button class="qd-pad idle" id="qdPad"><span class="qd-big">Tap to start</span><span class="qd-small">Wait for GREEN, then tap as fast as you can</span></button></div>`;
  const pad = stage.querySelector("#qdPad");
  const set = (cls, big, small = "") => { pad.className = "qd-pad " + cls; pad.innerHTML = `<span class="qd-big">${big}</span><span class="qd-small">${small}</span>`; };

  function arm() {
    state = "wait";
    set("wait", "Wait…", "Don't tap yet");
    timer = setTimeout(() => { state = "go"; goAt = performance.now(); set("go", "TAP!"); beep(880, 0.06); }, 1200 + Math.random() * 2500);
  }
  function hit() {
    if (state === "idle" || state === "result") { if (round >= ROUNDS) return; arm(); return; }
    if (state === "wait") { clearTimeout(timer); state = "result"; beep(160, 0.2, "sawtooth"); set("early", "Too early! 😅", "Counts as 650 ms · tap for next round"); times.push(650); round++; update(); return; }
    if (state === "go") {
      const ms = Math.round(performance.now() - goAt);
      times.push(ms); round++; state = "result";
      beep(660, 0.05, "triangle");
      update();
      if (round >= ROUNDS) {
        const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
        const score = Math.max(0, 1000 - avg);
        set("done", `${avg} ms avg`, "Nice reflexes!");
        setTimeout(() => gameOver(score, `Average: ${avg} ms`), 600);
      } else set("result", `${ms} ms`, "Tap for next round");
    }
  }
  function update() {
    stage.querySelector("#qdRound").textContent = round;
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    stage.querySelector("#qdAvg").textContent = `Avg: ${avg} ms`;
    setScore(Math.max(0, 1000 - avg));
  }
  pad.addEventListener("pointerdown", (e) => { e.preventDefault(); hit(); });
  const onKey = (e) => { if (e.key === " " && !e.repeat) { e.preventDefault(); hit(); } };
  addEventListener("keydown", onKey);

  return () => { clearTimeout(timer); removeEventListener("keydown", onKey); };
}
