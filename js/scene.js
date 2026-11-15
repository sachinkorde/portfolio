// ============================================================
//  HERO MINI-GAME (Three.js)
//  Fly a low-poly ship through space: collect coins, dodge rocks.
//  Mouse / touch steers the ship. Pauses when off-screen.
// ============================================================
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("gameCanvas");
const hero = document.getElementById("hero");
const scoreEl = document.getElementById("hudScore");
const bestEl = document.getElementById("hudBest");
const comboEl = document.getElementById("hudCombo");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
} catch (e) {
  document.body.classList.add("no-webgl");
  throw e;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const BG = 0x070a14;
scene.background = new THREE.Color(BG);
scene.fog = new THREE.Fog(BG, 30, 95);

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
camera.position.set(0, 1.2, 10);

// ---------- Lights ----------
scene.add(new THREE.HemisphereLight(0x8fb8ff, 0x1a0b2e, 1.1));
const sun = new THREE.DirectionalLight(0xffffff, 1.6);
sun.position.set(4, 8, 6);
scene.add(sun);
const rim = new THREE.PointLight(0xa855f7, 30, 40);
rim.position.set(-6, -2, 2);
scene.add(rim);

// ---------- Starfield (warp) ----------
const STARS = 1400;
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(STARS * 3);
for (let i = 0; i < STARS; i++) {
  starPos[i * 3] = (Math.random() - 0.5) * 120;
  starPos[i * 3 + 1] = (Math.random() - 0.5) * 70;
  starPos[i * 3 + 2] = -Math.random() * 110;
}
starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
const stars = new THREE.Points(
  starGeo,
  new THREE.PointsMaterial({ color: 0x9fd8ff, size: 0.14, transparent: true, opacity: 0.85 })
);
scene.add(stars);

// ---------- Neon grid floor ----------
const grid = new THREE.GridHelper(200, 80, 0x22d3ee, 0x1b2a55);
grid.position.y = -6;
grid.material.transparent = true;
grid.material.opacity = 0.35;
scene.add(grid);

// ---------- Player ship (built from primitives) ----------
const ship = new THREE.Group();
const hullMat = new THREE.MeshStandardMaterial({ color: 0xe6ecff, flatShading: true, metalness: 0.3, roughness: 0.4 });
const accentMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, flatShading: true, emissive: 0x0a5160, metalness: 0.2, roughness: 0.5 });
const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e2340, flatShading: true });

const body = new THREE.Mesh(new THREE.ConeGeometry(0.45, 2.2, 6), hullMat);
body.rotation.x = -Math.PI / 2;
ship.add(body);
const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), darkMat);
cockpit.position.set(0, 0.22, -0.1);
cockpit.scale.set(1, 0.8, 1.6);
ship.add(cockpit);
const wing = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 0.7), accentMat);
wing.position.set(0, -0.05, 0.45);
ship.add(wing);
for (const s of [-1, 1]) {
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.55, 0.5), accentMat);
  fin.position.set(s * 1.25, 0.2, 0.55);
  ship.add(fin);
}
const flame = new THREE.Mesh(
  new THREE.ConeGeometry(0.22, 0.9, 8),
  new THREE.MeshBasicMaterial({ color: 0xffb020, transparent: true, opacity: 0.9 })
);
flame.rotation.x = Math.PI / 2;
flame.position.z = 1.45;
ship.add(flame);
const engineLight = new THREE.PointLight(0xffa020, 12, 6);
engineLight.position.z = 1.6;
ship.add(engineLight);
ship.position.set(0, 0, 4);
scene.add(ship);

// ---------- Pickups & obstacles ----------
const coinGeo = new THREE.TorusGeometry(0.45, 0.14, 8, 18);
const coinMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0x7a4d00, metalness: 0.6, roughness: 0.3, flatShading: true });
const rockGeo = new THREE.IcosahedronGeometry(1, 0);
const rockMats = [0x6d28d9, 0x334155, 0x0e7490].map(
  (c) => new THREE.MeshStandardMaterial({ color: c, flatShading: true, roughness: 0.9 })
);

const items = [];
const BOUNDS = { x: 7, y: 3.6 };
function spawn(type, z) {
  const isCoin = type === "coin";
  const m = new THREE.Mesh(isCoin ? coinGeo : rockGeo, isCoin ? coinMat : rockMats[(Math.random() * 3) | 0]);
  const s = isCoin ? 1 : 0.5 + Math.random() * 0.9;
  m.scale.setScalar(s);
  m.userData = { type, r: isCoin ? 0.6 : s, spin: new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(0.02) };
  reset(m, z);
  scene.add(m);
  items.push(m);
}
function reset(m, z = -90 - Math.random() * 20) {
  m.position.set((Math.random() * 2 - 1) * BOUNDS.x, (Math.random() * 2 - 1) * BOUNDS.y, z);
  m.visible = true;
}
for (let i = 0; i < 14; i++) spawn("coin", -10 - i * 7);
for (let i = 0; i < 12; i++) spawn("rock", -20 - i * 8);

// ---------- Burst particles on coin pickup ----------
const bursts = [];
function burst(pos, color) {
  const n = 18;
  const g = new THREE.BufferGeometry();
  const p = new Float32Array(n * 3);
  const v = [];
  for (let i = 0; i < n; i++) {
    p.set([pos.x, pos.y, pos.z], i * 3);
    v.push(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(0.35));
  }
  g.setAttribute("position", new THREE.BufferAttribute(p, 3));
  const pts = new THREE.Points(g, new THREE.PointsMaterial({ color, size: 0.18, transparent: true, opacity: 1 }));
  pts.userData = { v, life: 1 };
  scene.add(pts);
  bursts.push(pts);
}

// ---------- Input ----------
const target = new THREE.Vector2(0, 0);
let steered = false;
function setTarget(cx, cy) {
  steered = true;
  const r = canvas.getBoundingClientRect();
  const nx = ((cx - r.left) / r.width) * 2 - 1;
  const ny = -(((cy - r.top) / r.height) * 2 - 1);
  target.set(nx * BOUNDS.x, ny * BOUNDS.y);
}
addEventListener("pointermove", (e) => setTarget(e.clientX, e.clientY), { passive: true });
hero.addEventListener("touchmove", (e) => { const t = e.touches[0]; if (t) setTarget(t.clientX, t.clientY); }, { passive: true });

// ---------- Score ----------
let score = 0, combo = 1, best = 0, shake = 0;
try { best = +localStorage.getItem("sk_best") || 0; } catch (_) {}
function hud() {
  scoreEl.textContent = String(score).padStart(4, "0");
  bestEl.textContent = String(best).padStart(4, "0");
  comboEl.textContent = "x" + combo;
}
hud();

// ---------- Resize ----------
function resize() {
  const w = hero.clientWidth, h = hero.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  // pull the camera back on narrow screens so the play area fits
  camera.position.z = w < 700 ? 15 : 10;
  BOUNDS.x = w < 700 ? 4 : 7;
  // until the player steers: keep the ship clear of the hero text
  // (text sits at the bottom on phones, on the left on desktop)
  if (!steered) target.set(w < 700 ? 0 : 3.5, w < 700 ? 3 : 0);
  camera.updateProjectionMatrix();
}
addEventListener("resize", resize);
resize();

// ---------- Loop (only while hero is visible) ----------
let running = true;
new IntersectionObserver(([en]) => {
  const was = running;
  running = en.isIntersecting;
  if (running && !was) { clock.getDelta(); requestAnimationFrame(tick); }
}).observe(hero);

const clock = new THREE.Clock();
const tmp = new THREE.Vector3();
function tick() {
  if (!running) return;
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  const speed = (reduceMotion ? 12 : 26) * dt;

  // ship follows the pointer with easing + banking
  const prevX = ship.position.x;
  ship.position.x += (target.x - ship.position.x) * Math.min(1, dt * 5);
  ship.position.y += (target.y - ship.position.y) * Math.min(1, dt * 5);
  const vx = (ship.position.x - prevX) / Math.max(dt, 0.001);
  ship.rotation.z = THREE.MathUtils.lerp(ship.rotation.z, -vx * 0.06, 0.15);
  ship.rotation.x = THREE.MathUtils.lerp(ship.rotation.x, (target.y - ship.position.y) * 0.08, 0.1);
  flame.scale.y = 0.8 + Math.sin(t * 40) * 0.25;
  engineLight.intensity = 10 + Math.sin(t * 40) * 3;

  // stars
  const sp = starGeo.attributes.position.array;
  for (let i = 2; i < sp.length; i += 3) {
    sp[i] += speed * 1.6;
    if (sp[i] > 12) sp[i] = -110;
  }
  starGeo.attributes.position.needsUpdate = true;
  grid.position.z = (grid.position.z + speed) % 2.5;

  // items
  for (const m of items) {
    m.position.z += speed;
    m.rotation.x += m.userData.spin.x;
    m.rotation.y += m.userData.type === "coin" ? 0.06 : m.userData.spin.y;
    if (m.position.z > 12) reset(m);
    if (!m.visible) continue;
    tmp.copy(m.position).sub(ship.position);
    if (Math.abs(tmp.z) < 1 && Math.hypot(tmp.x, tmp.y) < m.userData.r + 0.7) {
      if (m.userData.type === "coin") {
        score += 10 * combo;
        combo = Math.min(combo + 1, 9);
        burst(m.position, 0xfbbf24);
        if (score > best) { best = score; try { localStorage.setItem("sk_best", best); } catch (_) {} }
      } else {
        combo = 1;
        shake = 0.5;
        burst(m.position, 0xa855f7);
        hero.classList.remove("hit"); void hero.offsetWidth; hero.classList.add("hit");
      }
      m.visible = false;
      hud();
    }
  }

  // bursts
  for (let i = bursts.length - 1; i >= 0; i--) {
    const b = bursts[i];
    const arr = b.geometry.attributes.position.array;
    b.userData.v.forEach((v, k) => { arr[k * 3] += v.x; arr[k * 3 + 1] += v.y; arr[k * 3 + 2] += v.z + speed; });
    b.geometry.attributes.position.needsUpdate = true;
    b.userData.life -= dt * 1.5;
    b.material.opacity = Math.max(0, b.userData.life);
    if (b.userData.life <= 0) { scene.remove(b); b.geometry.dispose(); b.material.dispose(); bursts.splice(i, 1); }
  }

  // camera: gentle follow + hit shake
  shake = Math.max(0, shake - dt);
  camera.position.x = ship.position.x * 0.25 + (Math.random() - 0.5) * shake;
  camera.position.y = 1.2 + ship.position.y * 0.2 + (Math.random() - 0.5) * shake;
  camera.lookAt(ship.position.x * 0.3, ship.position.y * 0.3, 0);

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
document.body.classList.add("webgl-ready");
