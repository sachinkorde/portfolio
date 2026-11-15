// Block Breaker — paddle + ball + bricks. 3 lives, levels get faster.
import { makeCanvas, loop, keyboard, COLORS, centerText } from "./_kit.js";

export default function start({ stage, setScore, gameOver, beep }) {
  const { canvas, ctx, w, h, toLocal } = makeCanvas(stage, 480, 600);
  const kb = keyboard(["ArrowLeft", "ArrowRight", " "]);
  const ROWS = 6, COLS = 8, BW = 52, BH = 18, GAP = 6, TOP = 70;
  const left = (w - (COLS * BW + (COLS - 1) * GAP)) / 2;
  const palette = [COLORS.pink, COLORS.violet, "#818cf8", COLORS.cyan, "#34d399", COLORS.gold];
  let paddle = { x: w / 2, w: 90 }, ball, bricks, score = 0, lives = 3, level = 1, launched = false, over = false, pointerX = null;

  function build() {
    bricks = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++)
      bricks.push({ x: left + c * (BW + GAP), y: TOP + r * (BH + GAP), hp: r < level - 1 ? 2 : 1, color: palette[r] });
  }
  function resetBall() { ball = { x: paddle.x, y: h - 60, vx: 0, vy: 0, r: 7 }; launched = false; }
  function launch() {
    if (launched || over) return;
    const sp = 330 + level * 30;
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 0.8;
    ball.vx = Math.cos(a) * sp; ball.vy = Math.sin(a) * sp; launched = true;
  }
  const onMove = (e) => { pointerX = toLocal(e.clientX, e.clientY).x; };
  const onDown = (e) => { onMove(e); launch(); };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerdown", onDown);
  const onKey = (e) => { if (e.key === " " || e.key === "ArrowUp") launch(); };
  addEventListener("keydown", onKey);

  build(); resetBall();
  const stop = loop((dt) => {
    if (!over) {
      if (kb.keys.ArrowLeft) { paddle.x -= 480 * dt; pointerX = null; }
      if (kb.keys.ArrowRight) { paddle.x += 480 * dt; pointerX = null; }
      if (pointerX != null) paddle.x += (pointerX - paddle.x) * Math.min(1, dt * 18);
      paddle.x = Math.max(paddle.w / 2, Math.min(w - paddle.w / 2, paddle.x));

      if (!launched) { ball.x = paddle.x; ball.y = h - 60; }
      else {
        // sub-steps to avoid tunnelling
        const steps = 3;
        for (let s = 0; s < steps; s++) {
          ball.x += (ball.vx * dt) / steps; ball.y += (ball.vy * dt) / steps;
          if (ball.x < ball.r || ball.x > w - ball.r) { ball.vx *= -1; ball.x = Math.max(ball.r, Math.min(w - ball.r, ball.x)); beep(300, 0.03); }
          if (ball.y < ball.r) { ball.vy = Math.abs(ball.vy); beep(300, 0.03); }
          // paddle
          const py = h - 40;
          if (ball.vy > 0 && ball.y + ball.r >= py && ball.y + ball.r <= py + 14 && Math.abs(ball.x - paddle.x) < paddle.w / 2 + ball.r) {
            const hit = (ball.x - paddle.x) / (paddle.w / 2);
            const sp = Math.hypot(ball.vx, ball.vy) * 1.01;
            const a = -Math.PI / 2 + hit * 1.05;
            ball.vx = Math.cos(a) * sp; ball.vy = Math.sin(a) * sp;
            beep(440, 0.04);
          }
          // bricks
          for (const b of bricks) {
            if (b.hp <= 0) continue;
            if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + BW && ball.y + ball.r > b.y && ball.y - ball.r < b.y + BH) {
              const overlapX = Math.min(ball.x + ball.r - b.x, b.x + BW - (ball.x - ball.r));
              const overlapY = Math.min(ball.y + ball.r - b.y, b.y + BH - (ball.y - ball.r));
              if (overlapX < overlapY) ball.vx *= -1; else ball.vy *= -1;
              b.hp--; if (b.hp <= 0) { score += 10 * level; beep(660 + Math.random() * 200, 0.05, "triangle"); } else beep(500, 0.04);
              setScore(score);
              break;
            }
          }
        }
        if (ball.y > h + 20) {
          lives--; beep(150, 0.25, "sawtooth");
          if (lives <= 0) { over = true; setTimeout(() => gameOver(score, `Out of balls · Level ${level}`), 250); }
          else resetBall();
        }
        if (bricks.every((b) => b.hp <= 0)) { level++; score += 100; setScore(score); build(); resetBall(); beep(880, 0.2, "triangle"); }
      }
    }

    // draw
    ctx.fillStyle = COLORS.bg; ctx.fillRect(0, 0, w, h);
    for (const b of bricks) {
      if (b.hp <= 0) continue;
      ctx.fillStyle = b.color; ctx.globalAlpha = b.hp > 1 ? 1 : 0.85;
      ctx.fillRect(b.x, b.y, BW, BH);
      if (b.hp > 1) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.strokeRect(b.x + 1, b.y + 1, BW - 2, BH - 2); }
    }
    ctx.globalAlpha = 1;
    const grd = ctx.createLinearGradient(paddle.x - paddle.w / 2, 0, paddle.x + paddle.w / 2, 0);
    grd.addColorStop(0, COLORS.cyan); grd.addColorStop(1, COLORS.violet);
    ctx.fillStyle = grd; ctx.fillRect(paddle.x - paddle.w / 2, h - 40, paddle.w, 12);
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = COLORS.text; ctx.font = "600 14px 'JetBrains Mono', monospace"; ctx.textAlign = "left";
    ctx.fillText(`LVL ${level}`, 14, 30); ctx.textAlign = "right"; ctx.fillText("❤".repeat(lives), w - 14, 30);
    if (!launched && !over && score === 0 && level === 1) centerText(ctx, w, h, "BLOCK BREAKER", "Tap / Space to launch");
  });

  return () => { stop(); kb.off(); removeEventListener("keydown", onKey); };
}
