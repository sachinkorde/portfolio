// Tile Shift — 3x3 sliding puzzle. Shuffled with legal moves, so it's always solvable.

export default function start({ stage, setScore, gameOver, beep }) {
  const N = 3;
  let tiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  let moves = 0, done = false;
  const neighbors = (i) => [i - N, i + N, i % N ? i - 1 : -1, (i + 1) % N ? i + 1 : -1].filter((j) => j >= 0 && j < N * N);

  // scramble from solved state
  let blank = 8, prev = -1;
  for (let k = 0; k < 120; k++) {
    const opts = neighbors(blank).filter((j) => j !== prev);
    const j = opts[(Math.random() * opts.length) | 0];
    [tiles[blank], tiles[j]] = [tiles[j], tiles[blank]];
    prev = blank; blank = j;
  }
  if (tiles.join() === "1,2,3,4,5,6,7,8,0") { [tiles[0], tiles[1]] = [tiles[1], tiles[0]]; [tiles[3], tiles[4]] = [tiles[4], tiles[3]]; }

  stage.innerHTML = `<div class="g-wrap"><div class="g-bar mono"><span>Moves: <b id="tsMoves">0</b></span><span>Goal: 1 → 8</span></div><div class="ts-grid" id="tsGrid"></div></div>`;
  const grid = stage.querySelector("#tsGrid");
  const draw = () => {
    grid.innerHTML = tiles.map((v, i) => v
      ? `<button class="ts-tile ${v === i + 1 ? "ok" : ""}" data-i="${i}">${v}</button>`
      : `<span class="ts-tile blank"></span>`).join("");
  };
  draw();

  grid.addEventListener("click", (e) => {
    const b = e.target.closest(".ts-tile[data-i]");
    if (!b || done) return;
    const i = +b.dataset.i, z = tiles.indexOf(0);
    if (!neighbors(i).includes(z)) { beep(180, 0.05); return; }
    [tiles[i], tiles[z]] = [tiles[z], tiles[i]];
    moves++;
    stage.querySelector("#tsMoves").textContent = moves;
    beep(420 + tiles.filter((v, k) => v === k + 1).length * 40, 0.04);
    draw();
    const sc = Math.max(100, 1000 - moves * 8);
    setScore(sc);
    if (tiles.join() === "1,2,3,4,5,6,7,8,0") { done = true; beep(880, 0.2, "triangle"); setTimeout(() => gameOver(sc, `Solved in ${moves} moves!`), 400); }
  });

  return () => {};
}
