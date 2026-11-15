// Shared helpers for the arcade games.

// Creates a canvas with a fixed logical size (w x h) that scales to fit the stage.
export function makeCanvas(stage, w, h) {
  const canvas = document.createElement("canvas");
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.className = "am-canvas";
  canvas.style.aspectRatio = `${w} / ${h}`;
  canvas.tabIndex = 0;
  stage.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  // client coords -> logical coords
  const toLocal = (cx, cy) => {
    const r = canvas.getBoundingClientRect();
    return { x: ((cx - r.left) / r.width) * w, y: ((cy - r.top) / r.height) * h };
  };
  setTimeout(() => canvas.focus({ preventScroll: true }), 30);
  return { canvas, ctx, w, h, toLocal };
}

// requestAnimationFrame loop with delta time (seconds). Returns stop().
export function loop(fn) {
  let id, last = performance.now(), on = true;
  const tick = (t) => {
    if (!on) return;
    const dt = Math.min((t - last) / 1000, 0.05);
    last = t;
    fn(dt, t / 1000);
    id = requestAnimationFrame(tick);
  };
  id = requestAnimationFrame(tick);
  return () => { on = false; cancelAnimationFrame(id); };
}

// Keyboard state tracker. Returns { keys, off() }.
export function keyboard(prevent = []) {
  const keys = {};
  const down = (e) => { keys[e.key] = true; if (prevent.includes(e.key)) e.preventDefault(); };
  const up = (e) => { keys[e.key] = false; };
  addEventListener("keydown", down);
  addEventListener("keyup", up);
  return { keys, off() { removeEventListener("keydown", down); removeEventListener("keyup", up); } };
}

export const rand = (a, b) => a + Math.random() * (b - a);
export const shuffle = (arr) => { for (let i = arr.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };

export const COLORS = { bg: "#0b1020", cyan: "#22d3ee", violet: "#a855f7", pink: "#f472b6", gold: "#fbbf24", text: "#e8ecf8", muted: "#8d96b3", grid: "rgba(120,150,255,.08)" };

export function drawGridBg(ctx, w, h, offset = 0) {
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  for (let x = -(offset % 32); x < w; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
}

// Simple "tap to start" overlay text on a canvas
export function centerText(ctx, w, h, title, sub) {
  ctx.fillStyle = "rgba(7,10,20,.6)";
  ctx.fillRect(0, 0, w, h);
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.text;
  ctx.font = "700 26px 'Chakra Petch', sans-serif";
  ctx.fillText(title, w / 2, h / 2 - 6);
  if (sub) { ctx.fillStyle = COLORS.cyan; ctx.font = "500 13px 'JetBrains Mono', monospace"; ctx.fillText(sub, w / 2, h / 2 + 22); }
}
