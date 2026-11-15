// Rock Dodge — survive a meteor shower. Score = survival time; stars give bonus.
import { makeCanvas, loop, keyboard, rand, COLORS, centerText } from "./_kit.js";

export default function start({ stage, setScore, gameOver, beep }) {
  const { canvas, ctx, w, h, toLocal } = makeCanvas(stage, 420, 600);
  const kb = keyboard(["ArrowLeft", "ArrowRight"]);
  const ship = { x: w / 2, y: h - 70, r: 16 };
  let rocks = [], stars = [], bg = [], time = 0, bonus = 0, spawn = 0, started = false, dead = false, targetX = null;
  for (let i = 0; i < 60; i++) bg.push({ x: rand(0, w), y: rand(0, h), s: rand(0.5, 2), v: rand(20, 80) });

  const onMove = (e) => { targetX = toLocal(e.clientX, e.clientY).x; if (!started) started = true; };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerdown", onMove);
  const score = () => Math.floor(time * 10) + bonus;

  const stop = loop((dt, t) => {
    if (kb.keys.ArrowLeft || kb.keys.ArrowRight) { started = true; targetX = null; }
    if (started && !dead) {
      time += dt;
      const diff = 1 + time / 15;
      if (kb.keys.ArrowLeft) ship.x -= 360 * dt;
      if (kb.keys.ArrowRight) ship.x += 360 * dt;
      if (targetX != null) ship.x += (targetX - ship.x) * Math.min(1, dt * 12);
      ship.x = Math.max(ship.r, Math.min(w - ship.r, ship.x));

      spawn -= dt;
      if (spawn <= 0) {
        spawn = Math.max(0.18, 0.7 / diff);
        const r = rand(12, 30);
        rocks.push({ x: rand(r, w - r), y: -r, r, vy: rand(140, 220) * diff, rot: rand(0, 6), vr: rand(-2, 2), pts: Array.from({ length: 8 }, () => rand(0.75, 1.1)) });
        if (Math.random() < 0.18) stars.push({ x: rand(20, w - 20), y: -20, vy: 160 });
      }
      rocks.forEach((r) => { r.y += r.vy * dt; r.rot += r.vr * dt; });
      stars.forEach((s) => (s.y += s.vy * dt));
      rocks = rocks.filter((r) => r.y < h + 40);
      for (const s of stars) if (!s.got && Math.hypot(s.x - ship.x, s.y - ship.y) < 24) { s.got = true; bonus += 50; beep(990, 0.07, "triangle"); }
      stars = stars.filter((s) => s.y < h + 20 && !s.got);
      for (const r of rocks) if (Math.hypot(r.x - ship.x, r.y - ship.y) < r.r * 0.85 + ship.r * 0.7) {
        dead = true; beep(120, 0.4, "sawtooth");
        setTimeout(() => gameOver(score(), `Survived ${time.toFixed(1)}s`), 350);
      }
      setScore(score());
    }

    // draw
    ctx.fillStyle = COLORS.bg; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#9fd8ff";
    for (const s of bg) { s.y += s.v * dt * (started ? 1.5 : 0.5); if (s.y > h) s.y = 0; ctx.fillRect(s.x, s.y, s.s, s.s * 2); }
    for (const s of stars) { ctx.fillStyle = COLORS.gold; ctx.font = "20px serif"; ctx.textAlign = "center"; ctx.fillText("⭐", s.x, s.y + 7); }
    for (const r of rocks) {
      ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(r.rot);
      ctx.fillStyle = "#4c3a78"; ctx.strokeStyle = COLORS.violet; ctx.lineWidth = 2;
      ctx.beginPath();
      r.pts.forEach((k, i) => { const a = (i / r.pts.length) * Math.PI * 2; ctx.lineTo(Math.cos(a) * r.r * k, Math.sin(a) * r.r * k); });
      ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    }
    if (!dead) {
      ctx.save(); ctx.translate(ship.x, ship.y);
      ctx.fillStyle = "#ffb020"; ctx.beginPath(); ctx.moveTo(-6, 14); ctx.lineTo(0, 22 + Math.sin(t * 40) * 4); ctx.lineTo(6, 14); ctx.fill();
      ctx.fillStyle = COLORS.text; ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(14, 14); ctx.lineTo(-14, 14); ctx.closePath(); ctx.fill();
      ctx.fillStyle = COLORS.cyan; ctx.fillRect(-16, 6, 32, 5);
      ctx.restore();
    }
    ctx.fillStyle = COLORS.text; ctx.font = "600 14px 'JetBrains Mono', monospace"; ctx.textAlign = "left";
    ctx.fillText(`${time.toFixed(1)}s`, 14, 26);
    if (!started) centerText(ctx, w, h, "ROCK DODGE", "Move mouse / drag / ← → to start");
  });

  return () => { stop(); kb.off(); };
}
