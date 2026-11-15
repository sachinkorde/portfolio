// Circuit Flip — tapping a node toggles it and its 4 neighbours. Light up every node.
// Puzzles are made by pressing random nodes on a fully-lit board, so they're always solvable.

export default function start({ stage, setScore, gameOver, beep }) {
  const N = 5;
  let level = 1, total = 0, moves = 0, board;

  function press(b, i) {
    const r = (i / N) | 0, c = i % N;
    [[r, c], [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([y, x]) => { if (y >= 0 && y < N && x >= 0 && x < N) b[y * N + x] ^= 1; });
  }
  function newBoard() {
    board = Array(N * N).fill(1);
    const presses = 2 + level * 2;
    for (let k = 0; k < presses; k++) press(board, (Math.random() * N * N) | 0);
    if (board.every(Boolean)) press(board, 12);
    moves = 0;
    render();
  }
  stage.innerHTML = `<div class="g-wrap"><div class="g-bar mono"><span>Level <b id="cfLvl">1</b> / 5</span><span>Moves: <b id="cfMoves">0</b></span></div><div class="cf-grid" id="cfGrid"></div><button class="g-btn" id="cfReset">↺ Reset level</button></div>`;
  const grid = stage.querySelector("#cfGrid");
  function render() {
    grid.innerHTML = board.map((v, i) => `<button class="cf-node ${v ? "on" : ""}" data-i="${i}" aria-label="Node ${i + 1} ${v ? "on" : "off"}"></button>`).join("");
    stage.querySelector("#cfLvl").textContent = level;
    stage.querySelector("#cfMoves").textContent = moves;
  }
  let snapshot;
  const saveSnap = () => (snapshot = board.slice());

  grid.addEventListener("click", (e) => {
    const n = e.target.closest(".cf-node");
    if (!n) return;
    press(board, +n.dataset.i);
    moves++;
    beep(300 + board.filter(Boolean).length * 20, 0.05);
    render();
    if (board.every(Boolean)) {
      total += Math.max(50, 300 - moves * 10) * level;
      setScore(total);
      beep(880, 0.2, "triangle");
      if (level >= 5) setTimeout(() => gameOver(total, "All circuits powered! ⚡"), 400);
      else setTimeout(() => { level++; newBoard(); saveSnap(); }, 500);
    }
  });
  stage.querySelector("#cfReset").addEventListener("click", () => { board = snapshot.slice(); moves = 0; render(); });

  newBoard(); saveSnap();
  return () => {};
}
