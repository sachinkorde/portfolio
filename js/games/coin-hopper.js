// Coin Hopper — endless platformer. Jump (double-jump allowed), collect coins, don't fall.
import { makeCanvas, loop, keyboard, rand, COLORS, drawGridBg, centerText } from "./_kit.js";

export default function start({ stage, setScore, gameOver, beep }) {
  const { canvas, ctx, w, h } = makeCanvas(stage, 640, 360);
  const kb = keyboard([" ", "ArrowUp", "w"]);
  const G = 1500, JUMP = -560;
  let p, plats, coins, speed, dist, got, started, dead, scrollX;

  function reset() {
    p = { x: 120, y: 200, vy: 0, s: 24, jumps: 0, onGround: false };
    plats = [{ x: 0, y: 260, w: 360 }];
    coins = [];
    speed = 190; dist = 0; got = 0; started = false; dead = false; scrollX = 0;
    while (plats[plats.length - 1].x < w * 2) addPlat();
  }
  function addPlat() {
    const last = plats[plats.length - 1];
    const gap = rand(60, 120 + Math.min(80, speed / 6));
    const y = Math.max(140, Math.min(300, last.y + rand(-70, 70)));
    const pw = rand(90, 200);
    const pl = { x: last.x + last.w + gap, y, w: pw };
    plats.push(pl);
    const n = (Math.random() * 3) | 0;
    for (let i = 0; i < n; i++) coins.push({ x: pl.x + 20 + i * 28, y: y - 34 - (i % 2) * 14, t: rand(0, 6) });
  }
  function jump() {
    if (dead) return;
    if (!started) started = true;
    if (p.onGround || p.jumps < 2) {
      p.vy = JUMP * (p.jumps === 1 ? 0.88 : 1);
      p.jumps++;
      p.onGround = false;
      beep(p.jumps === 1 ? 520 : 700, 0.06);
    }
  }
  const onKey = (e) => { if ([" ", "ArrowUp", "w"].includes(e.key) && !e.repeat) jump(); };
  const onTap = (e) => { e.preventDefault(); jump(); };
  addEventListener("keydown", onKey);
  canvas.addEventListener("pointerdown", onTap);

  reset();
  const stop = loop((dt, t) => {
    if (started && !dead) {
      speed += dt * 6;
      const dx = speed * dt;
      dist += dx; scrollX += dx;
      plats.forEach((pl) => (pl.x -= dx));
      coins.forEach((c) => (c.x -= dx));
      plats = plats.filter((pl) => pl.x + pl.w > -20);
      coins = coins.filter((c) => c.x > -20 && !c.got);
      while (plats[plats.length - 1].x < w * 1.6) addPlat();

      const prevBottom = p.y + p.s;
      p.vy += G * dt;
      p.y += p.vy * dt;
      p.onGround = false;
      for (const pl of plats) {
        if (p.x + p.s > pl.x && p.x < pl.x + pl.w && prevBottom <= pl.y && p.y + p.s >= pl.y && p.vy >= 0) {
          p.y = pl.y - p.s; p.vy = 0; p.onGround = true; p.jumps = 0;
        }
      }
      for (const c of coins) {
        if (Math.abs(c.x - (p.x + p.s / 2)) < 20 && Math.abs(c.y - (p.y + p.s / 2)) < 22) { c.got = true; got++; beep(980, 0.05, "triangle"); }
      }
      setScore(got * 10 + Math.floor(dist / 40));
      if (p.y > h + 40) { dead = true; beep(160, 0.3, "sawtooth"); setTimeout(() => gameOver(got * 10 + Math.floor(dist / 40), "You fell!"), 300); }
    }

    // draw
    drawGridBg(ctx, w, h, scrollX * 0.4);
    for (const pl of plats) {
      const g = ctx.createLinearGradient(pl.x, 0, pl.x + pl.w, 0);
      g.addColorStop(0, COLORS.cyan); g.addColorStop(1, COLORS.violet);
      ctx.fillStyle = g; ctx.fillRect(pl.x, pl.y, pl.w, 8);
      ctx.fillStyle = "rgba(34,211,238,.08)"; ctx.fillRect(pl.x, pl.y + 8, pl.w, h - pl.y);
    }
    for (const c of coins) {
      const sx = Math.abs(Math.cos(t * 4 + c.t)) * 8 + 2;
      ctx.fillStyle = COLORS.gold; ctx.beginPath(); ctx.ellipse(c.x, c.y, sx, 10, 0, 0, Math.PI * 2); ctx.fill();
    }
    // player: a little cube hero with eyes
    const squash = p.onGround ? 1 : 1 + Math.min(0.2, Math.abs(p.vy) / 3000);
    ctx.save();
    ctx.translate(p.x + p.s / 2, p.y + p.s);
    ctx.scale(1 / squash, squash);
    ctx.fillStyle = COLORS.pink; ctx.fillRect(-p.s / 2, -p.s, p.s, p.s);
    ctx.fillStyle = "#fff"; ctx.fillRect(2, -p.s + 6, 6, 7); ctx.fillRect(-6, -p.s + 6, 6, 7);
    ctx.fillStyle = "#070a14"; ctx.fillRect(5, -p.s + 8, 3, 4); ctx.fillRect(-3, -p.s + 8, 3, 4);
    ctx.restore();
    ctx.fillStyle = COLORS.text; ctx.font = "600 14px 'JetBrains Mono', monospace"; ctx.textAlign = "left";
    ctx.fillText(`🪙 ${got}   ${Math.floor(dist / 10)}m`, 14, 24);
    if (!started) centerText(ctx, w, h, "COIN HOPPER", "Press Space / tap to jump · double-jump in the air");
  });

  return () => { stop(); kb.off(); removeEventListener("keydown", onKey); };
}
