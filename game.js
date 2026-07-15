/**
 * Remosaic — flexible color-memory picture puzzle
 * Modes: Classic · Kids · Challenge · Daily · Endless · Your photo
 */

(function () {
  "use strict";

  // ── Colors + patterns (patterns help beyond hue alone) ──
  const COLORS = [
    { id: "coral", hex: "#ff6b6b", pattern: "solid" },
    { id: "amber", hex: "#ffb020", pattern: "stripes" },
    { id: "lime", hex: "#7bed9f", pattern: "dots" },
    { id: "sky", hex: "#54a0ff", pattern: "grid" },
    { id: "violet", hex: "#a55eea", pattern: "diagonal" },
    { id: "rose", hex: "#ff9ff3", pattern: "rings" },
    { id: "green", hex: "#2ed573", pattern: "stripes-v" },
    { id: "orange", hex: "#ff7f50", pattern: "dots-lg" },
    { id: "cyan", hex: "#18dcff", pattern: "chevrons" },
    { id: "gold", hex: "#f6e58d", pattern: "solid" },
    { id: "indigo", hex: "#6c5ce7", pattern: "grid" },
    { id: "mint", hex: "#55efc4", pattern: "diagonal" },
  ];

  /**
   * Shape cadence (Classic):
   *   Early  — every ~3 levels (novelty while learning)
   *   Mid    — every ~3–4 levels
   *   Late   — every ~4 levels (room to master harder boards)
   * Milestones: 3 → 6 → 9 → 12 → 16 → 20 → 24
   * Levels between are softer practice on known art.
   */
  const SHAPE_MILESTONES = [3, 6, 9, 12, 16, 20, 24];

  const ART_CYCLE = [
    "circle", "square", "triangle", "star", "hexagon",
    "heart", "spiral", "diamond", "flower", "leaf",
    "moon", "crystal", "sunset", "galaxy", "ring", "crown", "prism",
  ];

  // Classic campaign — 24 levels aligned to the cadence above
  const CLASSIC_LEVELS = [
    // ── Open: learn the loop ──
    { name: "Dot", cols: 2, rows: 2, matchSize: 2, flashMs: 1100, ghostMs: 700, previewMs: 1000, peeks: 1, focus: false, art: "circle", tip: "Warm-up. Match pairs. 2-in-a-row streaks keep solves safe." },
    { name: "Tile", cols: 3, rows: 2, matchSize: 2, flashMs: 1050, ghostMs: 550, previewMs: 850, peeks: 1, focus: false, art: "square", tip: "A few more pieces. Still pairs, long flashes." },

    // ── L3 NEW ──
    { name: "Triangle", cols: 3, rows: 2, matchSize: 2, flashMs: 1000, ghostMs: 500, previewMs: 900, peeks: 2, focus: false, art: "triangle", tip: "New shape! Easy pairs — enjoy the reveal." },
    { name: "Echo", cols: 3, rows: 2, matchSize: 2, flashMs: 980, ghostMs: 400, previewMs: 700, peeks: 1, focus: false, art: "circle", tip: "Practice streak habits on a familiar shape." },
    { name: "Gridlet", cols: 3, rows: 3, matchSize: 3, flashMs: 980, ghostMs: 350, previewMs: 750, peeks: 2, focus: false, art: "square", tip: "First triples — gentle pace, extra peeks." },

    // ── L6 NEW ──
    { name: "Hexagon", cols: 4, rows: 3, matchSize: 2, flashMs: 960, ghostMs: 350, previewMs: 800, peeks: 2, focus: false, art: "hexagon", tip: "New shape! Bigger board, still only pairs." },
    { name: "Beacon", cols: 4, rows: 3, matchSize: 2, flashMs: 940, ghostMs: 250, previewMs: 550, peeks: 2, focus: false, art: "star", tip: "Star pairs. Flash a little shorter." },
    { name: "Nest", cols: 4, rows: 3, matchSize: 3, flashMs: 920, ghostMs: 250, previewMs: 600, peeks: 2, focus: false, art: "hexagon", tip: "Triples on the hex — still plenty of help." },

    // ── L9 NEW ──
    { name: "Spiral", cols: 4, rows: 3, matchSize: 2, flashMs: 920, ghostMs: 250, previewMs: 700, peeks: 2, focus: false, art: "spiral", tip: "New shape! Soft pairs to unlock the spiral." },
    { name: "Pulse", cols: 4, rows: 4, matchSize: 2, flashMs: 900, ghostMs: 200, previewMs: 500, peeks: 2, focus: false, art: "heart", tip: "16 pieces, pairs only. Take your time." },
    { name: "Facet", cols: 4, rows: 3, matchSize: 3, flashMs: 880, ghostMs: 150, previewMs: 500, peeks: 2, focus: false, art: "diamond", tip: "Triples with a light ghost tint." },

    // ── L12 NEW ──
    { name: "Leaf", cols: 4, rows: 4, matchSize: 2, flashMs: 880, ghostMs: 200, previewMs: 650, peeks: 2, focus: false, art: "leaf", tip: "New shape! Easy pairs under the leaf." },
    { name: "Bloom", cols: 4, rows: 4, matchSize: 2, flashMs: 860, ghostMs: 100, previewMs: 400, peeks: 2, focus: false, art: "flower", tip: "Flower pairs. Streak discipline over speed." },
    { name: "Coil", cols: 4, rows: 4, matchSize: 4, flashMs: 900, ghostMs: 200, previewMs: 750, peeks: 3, focus: false, art: "spiral", tip: "First quads — slow flashes and 3 peeks." },
    { name: "Orbit", cols: 4, rows: 4, matchSize: 2, flashMs: 840, ghostMs: 0, previewMs: 400, peeks: 2, focus: false, art: "moon", tip: "Moon pairs. Ghosts off — pure memory." },

    // ── L16 NEW ──
    { name: "Crystal", cols: 5, rows: 4, matchSize: 2, flashMs: 860, ghostMs: 150, previewMs: 700, peeks: 3, focus: false, art: "crystal", tip: "New shape! Soft landing with peeks and pairs." },
    { name: "Grove", cols: 5, rows: 4, matchSize: 2, flashMs: 840, ghostMs: 100, previewMs: 450, peeks: 2, focus: false, art: "leaf", tip: "Wider board, still pairs." },
    { name: "Focus Beam", cols: 4, rows: 3, matchSize: 3, flashMs: 860, ghostMs: 0, previewMs: 600, peeks: 2, focus: true, art: "hexagon", tip: "Focus mode: one color at a time." },
    { name: "Horizon", cols: 5, rows: 4, matchSize: 2, flashMs: 820, ghostMs: 0, previewMs: 350, peeks: 2, focus: false, art: "sunset", tip: "Sunset pairs. Board is getting big." },

    // ── L20 NEW ──
    { name: "Ring", cols: 5, rows: 4, matchSize: 2, flashMs: 840, ghostMs: 150, previewMs: 650, peeks: 3, focus: false, art: "ring", tip: "New shape! Easy pairs around the ring." },
    { name: "Nebula", cols: 5, rows: 4, matchSize: 4, flashMs: 820, ghostMs: 100, previewMs: 550, peeks: 2, focus: false, art: "galaxy", tip: "Galaxy quads — use the preview." },
    { name: "Shard", cols: 5, rows: 4, matchSize: 4, flashMs: 800, ghostMs: 0, previewMs: 400, peeks: 2, focus: false, art: "crystal", tip: "Crystal quads. Shorter window." },
    { name: "Refract", cols: 6, rows: 4, matchSize: 3, flashMs: 780, ghostMs: 0, previewMs: 350, peeks: 2, focus: false, art: "prism", tip: "Prism triples on a wide board." },

    // ── L24 NEW / crest ──
    { name: "Crown", cols: 6, rows: 4, matchSize: 3, flashMs: 800, ghostMs: 150, previewMs: 700, peeks: 3, focus: false, art: "crown", tip: "Campaign crest — unlock the crown. You've earned it." },
  ];

  function cloneLevel(L, patch = {}) {
    return Object.assign({}, L, patch);
  }

  function kidsLevels() {
    return CLASSIC_LEVELS.map((L) =>
      cloneLevel(L, {
        flashMs: Math.min(1400, L.flashMs + 350),
        ghostMs: Math.max(500, L.ghostMs + 400),
        previewMs: Math.max(800, L.previewMs || 600),
        peeks: Math.max(2, (L.peeks || 0) + 2),
        focus: false,
        tip: L.tip + " (Kids: gentler timings & extra peeks.)",
      })
    );
  }

  function challengeLevels() {
    return CLASSIC_LEVELS.map((L, i) =>
      cloneLevel(L, {
        flashMs: Math.max(420, L.flashMs - 200),
        ghostMs: 0,
        previewMs: i === 0 ? 500 : Math.max(0, (L.previewMs || 0) - 300),
        peeks: Math.max(0, (L.peeks || 0) - 1),
        focus: i >= 2 ? true : L.focus,
        tip: L.tip + " (Challenge: faster & leaner.)",
      })
    );
  }

  /**
   * Streak rule (anti-spam):
   * Get 2 clicks of the same color in a row.
   * If you switch colors before that 2-streak, the last fully solved color
   * returns to the board (one color step back — not a full wipe).
   */

  // ── Settings (persisted) ──
  const SETTINGS_KEY = "remosaic_settings_v1";
  const DAILY_KEY = "remosaic_daily_v1";
  const ENDLESS_BEST_KEY = "remosaic_endless_best";

  const defaultSettings = {
    sound: true,
    haptics: true,
    patterns: true,
    marks: true,
  };

  function loadSettings() {
    try {
      return Object.assign({}, defaultSettings, JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"));
    } catch {
      return Object.assign({}, defaultSettings);
    }
  }

  function saveSettings(s) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    } catch {
      /* ignore */
    }
  }

  let settings = loadSettings();

  // ── Seeded RNG (daily) ──
  function dateSeedString(d = new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function hashSeed(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function seededShuffle(arr, rand) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function shuffle(arr) {
    return seededShuffle(arr, Math.random);
  }

  // ── Daily level (one board/config for the whole day) ──
  function buildDailyLevel() {
    const key = dateSeedString();
    const rand = mulberry32(hashSeed("remosaic-daily-" + key));
    const sizes = [
      { cols: 4, rows: 3, matchSize: 2 },
      { cols: 4, rows: 4, matchSize: 2 },
      { cols: 4, rows: 3, matchSize: 3 },
      { cols: 5, rows: 4, matchSize: 2 },
      { cols: 4, rows: 4, matchSize: 4 },
      { cols: 5, rows: 4, matchSize: 4 },
      { cols: 6, rows: 4, matchSize: 3 },
    ];
    const pick = sizes[Math.floor(rand() * sizes.length)];
    const art = ART_CYCLE[Math.floor(rand() * ART_CYCLE.length)];
    return {
      name: `Daily ${key}`,
      cols: pick.cols,
      rows: pick.rows,
      matchSize: pick.matchSize,
      flashMs: 650 + Math.floor(rand() * 250),
      ghostMs: rand() > 0.6 ? 200 : 0,
      previewMs: rand() > 0.4 ? 600 : 0,
      peeks: 1 + Math.floor(rand() * 2),
      focus: rand() > 0.7,
      art,
      tip: `Daily puzzle for ${key}. Same layout seed for everyone. Keep 2-in-a-row streaks.`,
      seedKey: key,
    };
  }

  // ── Endless wave generator ──
  function buildEndlessLevel(wave) {
    const w = Math.max(1, wave);
    const matchOptions = w < 3 ? [2] : w < 6 ? [2, 3] : w < 10 ? [2, 3, 4] : [3, 4];
    const matchSize = matchOptions[(w - 1) % matchOptions.length];
    let cols = 2 + Math.min(4, Math.floor((w + 1) / 2));
    let rows = 2 + Math.min(3, Math.floor(w / 3));
    // Ensure divisible by matchSize
    let total = cols * rows;
    while (total % matchSize !== 0) {
      if (rows <= cols) rows += 1;
      else cols += 1;
      total = cols * rows;
      if (total > 36) {
        cols = 6;
        rows = matchSize === 4 ? 4 : 6;
        total = cols * rows;
        break;
      }
    }
    const flashMs = Math.max(450, 1000 - w * 40);
    const peeks = w < 4 ? 2 : w < 8 ? 1 : w % 3 === 0 ? 1 : 0;
    return {
      name: `Wave ${w}`,
      cols,
      rows,
      matchSize,
      flashMs,
      ghostMs: w <= 2 ? 400 : w <= 5 ? 150 : 0,
      previewMs: w <= 3 ? 700 : w <= 7 ? 400 : 0,
      peeks,
      focus: w >= 5 && w % 2 === 0,
      art: ART_CYCLE[(w - 1) % ART_CYCLE.length],
      tip: `Endless wave ${w}. Boards grow; flashes shrink. Don't break your 2-streaks.`,
      wave: w,
    };
  }

  // Photo campaign: fixed progression using uploaded image
  function photoLevels() {
    return [
      { name: "Snapshot", cols: 2, rows: 2, matchSize: 2, flashMs: 1000, ghostMs: 500, previewMs: 800, peeks: 1, focus: false, art: "photo", tip: "Your photo — start with pairs." },
      { name: "Portrait", cols: 3, rows: 3, matchSize: 3, flashMs: 900, ghostMs: 200, previewMs: 600, peeks: 2, focus: false, art: "photo", tip: "Triples over your image." },
      { name: "Mosaic", cols: 4, rows: 4, matchSize: 2, flashMs: 800, ghostMs: 0, previewMs: 0, peeks: 2, focus: false, art: "photo", tip: "More tiles, same picture." },
      { name: "Gallery", cols: 5, rows: 4, matchSize: 4, flashMs: 700, ghostMs: 0, previewMs: 500, peeks: 2, focus: false, art: "photo", tip: "Quads — full reveal awaits." },
      { name: "Masterpiece", cols: 6, rows: 4, matchSize: 3, flashMs: 650, ghostMs: 0, previewMs: 0, peeks: 1, focus: true, art: "photo", tip: "Finale with your photo." },
    ];
  }

  // ── DOM ──
  const $ = (sel) => document.querySelector(sel);
  const screens = {
    title: $("#screen-title"),
    how: $("#screen-how"),
    settings: $("#screen-settings"),
    game: $("#screen-game"),
  };
  const boardEl = $("#board");
  const canvas = $("#art-canvas");
  const ctx = canvas.getContext("2d");
  const stage = $("#stage");
  const winOverlay = $("#win-overlay");
  const toastEl = $("#toast");
  const twistEl = $("#hud-twist");
  const photoInput = $("#photo-input");
  const photoStatus = $("#photo-status");
  const btnPeek = $("#btn-peek");

  const hud = {
    level: $("#hud-level"),
    name: $("#hud-name"),
    match: $("#hud-match"),
    peeks: $("#hud-peeks"),
    moves: $("#hud-moves"),
    left: $("#hud-left"),
    streak: $("#hud-streak"),
    tip: $("#hud-tip"),
    stars: $("#win-stars"),
    modeLabel: $("#hud-mode-label"),
  };

  // ── State ──
  let mode = "classic"; // classic | kids | challenge | daily | endless | photo
  let campaign = CLASSIC_LEVELS.slice();
  let levelIndex = 0;
  let endlessWave = 1;
  let tiles = [];
  let progress = Object.create(null);
  let moves = 0;
  let peeksLeft = 0;
  let peeksUsed = 0;
  let inputLocked = false;
  let flashTimers = new Map();
  let ghostTimers = new Map();
  let levelStartTime = 0;
  let flashing = new Set();
  let combo = 0;
  /** Consecutive clicks of the same color (need 2 before switching safely) */
  let sameColorStreak = 0;
  /** Color key of the current click streak */
  let streakColorKey = null;
  /**
   * Last fully solved set — vulnerable until you bank a clean 2-streak later
   * or complete another set without breaking. Unsolved on broken <2 streak.
   * @type {{ colorKey: string, indices: number[], color: object } | null}
   */
  let lastSolved = null;
  let audioCtx = null;
  /** @type {HTMLImageElement | null} */
  let customPhoto = null;
  /** @type {() => number} */
  let levelRand = Math.random;
  let dailySeedKey = "";

  function showScreen(name) {
    Object.values(screens).forEach((el) => el && el.classList.remove("active"));
    screens[name].classList.add("active");
  }

  function clearTimers() {
    flashTimers.forEach((id) => clearTimeout(id));
    ghostTimers.forEach((id) => clearTimeout(id));
    flashTimers.clear();
    ghostTimers.clear();
    flashing.clear();
  }

  function isInProgress(index) {
    return Object.values(progress).some((list) => list.includes(index));
  }

  function toast(msg, ms = 1600) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toastEl.classList.remove("show"), ms);
  }

  function haptic(pattern = 12) {
    if (!settings.haptics) return;
    try {
      if (navigator.vibrate) navigator.vibrate(pattern);
    } catch {
      /* ignore */
    }
  }

  // ── Audio ──
  function beep(freq, dur, type = "sine", gain = 0.04) {
    if (!settings.sound) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const t = audioCtx.currentTime;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start(t);
      o.stop(t + dur);
    } catch {
      /* ignore */
    }
  }

  function sfxFlash() {
    beep(520, 0.05, "triangle", 0.028);
  }
  function sfxMatch() {
    beep(660, 0.08, "sine", 0.05);
    setTimeout(() => beep(880, 0.12, "sine", 0.05), 70);
    haptic([10, 30, 18]);
  }
  function sfxWin() {
    [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.15, "sine", 0.05), i * 90));
    haptic([20, 40, 20, 40, 40]);
  }
  function sfxPeek() {
    beep(400, 0.05, "square", 0.02);
    setTimeout(() => beep(600, 0.08, "square", 0.02), 50);
    haptic(8);
  }
  function sfxStepBack() {
    beep(220, 0.09, "triangle", 0.03);
    setTimeout(() => beep(160, 0.12, "triangle", 0.025), 60);
    haptic([25, 40, 25]);
  }

  // ── Art ──
  function resizeCanvas() {
    const size = stage.clientWidth;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawPhotoCover() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!customPhoto) {
      ctx.fillStyle = "#1a1030";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "600 16px DM Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("No photo loaded", w / 2, h / 2);
      return;
    }
    const iw = customPhoto.naturalWidth || customPhoto.width;
    const ih = customPhoto.naturalHeight || customPhoto.height;
    const scale = Math.max(w / iw, h / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;
    ctx.drawImage(customPhoto, dx, dy, dw, dh);
    // soft vignette so tiles read better at start
    const v = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.75);
    v.addColorStop(0, "transparent");
    v.addColorStop(1, "rgba(0,0,0,0.25)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
  }

  function roundRectPath(x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function drawArt(kind) {
    resizeCanvas();
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const cx = w / 2;
    const cy = h / 2;

    if (kind === "photo" || (mode === "photo" && customPhoto)) {
      drawPhotoCover();
      return;
    }

    const palettes = {
      circle: ["#1a1030", "#2d1b4e"],
      square: ["#0f1c2e", "#1a3a5c"],
      triangle: ["#1a1428", "#3a2458"],
      star: ["#1c1028", "#3d1f5c"],
      hexagon: ["#0e1a28", "#1a3a48"],
      heart: ["#2a1020", "#5c1a3a"],
      spiral: ["#14102a", "#2a1a50"],
      diamond: ["#0e1e28", "#1a4a5c"],
      flower: ["#1a1e14", "#3a4a28"],
      leaf: ["#0e1a12", "#1a3a24"],
      moon: ["#0c1020", "#1a2848"],
      crystal: ["#101828", "#1a3050"],
      sunset: ["#2a1420", "#5c2a18", "#8c4a10"],
      galaxy: ["#080818", "#1a0a40", "#0a2040"],
      ring: ["#101820", "#1a3040"],
      crown: ["#201810", "#4a3018"],
      prism: ["#101018", "#2a1840", "#103040"],
    };
    const stops = palettes[kind] || ["#12141c", "#1e2438"];
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    stops.forEach((c, i) => bgGrad.addColorStop(i / Math.max(stops.length - 1, 1), c));
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(cx, cy);

    switch (kind) {
      case "circle":
        drawGlowCircle(0, 0, w * 0.28, "#7c6cff", "#3dd6c6");
        break;
      case "square":
        drawRoundedRect(-w * 0.22, -w * 0.22, w * 0.44, w * 0.44, 18, "#54a0ff", "#2ed573");
        break;
      case "triangle":
        drawTriangle(0, 0, w * 0.3, "#ff9ff3", "#a55eea");
        break;
      case "star":
        drawStar(0, 0, 5, w * 0.28, w * 0.12, "#ffb020", "#ff6b6b");
        break;
      case "hexagon":
        drawPolygon(0, 0, 6, w * 0.26, "#3dd6c6", "#54a0ff");
        break;
      case "heart":
        drawHeart(0, w * 0.04, w * 0.26, "#ff6b8a", "#ff9ff3");
        break;
      case "spiral":
        drawSpiral(0, 0, w * 0.28, "#7c6cff", "#18dcff");
        break;
      case "diamond":
        drawDiamond(0, 0, w * 0.26, "#18dcff", "#a55eea");
        break;
      case "flower":
        drawFlower(0, 0, w * 0.12, 6, "#ff9ff3", "#7bed9f", "#ffb020");
        break;
      case "leaf":
        drawLeaf(0, 0, w * 0.28, "#2ed573", "#7bed9f");
        break;
      case "moon":
        drawMoon(0, 0, w * 0.26, "#f6e58d", "#a55eea");
        drawStarsField(w, h, 28);
        break;
      case "crystal":
        drawCrystal(0, 0, w * 0.24, "#18dcff", "#a55eea", "#ffffff");
        break;
      case "sunset":
        drawSunset(w, h);
        break;
      case "galaxy":
        drawGalaxy(w, h);
        break;
      case "ring":
        drawRing(0, 0, w * 0.28, w * 0.14, "#3dd6c6", "#7c6cff");
        break;
      case "crown":
        drawCrown(0, 0, w * 0.32, "#ffb020", "#f6e58d", "#ff6b6b");
        break;
      case "prism":
        drawPrism(w, h);
        break;
      default:
        drawGlowCircle(0, 0, w * 0.25, "#7c6cff", "#3dd6c6");
    }
    ctx.restore();
  }

  function drawGlowCircle(x, y, r, c1, c2) {
    const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 1.4);
    g.addColorStop(0, c1);
    g.addColorStop(0.55, c2);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r * 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function drawRoundedRect(x, y, w, h, r, c1, c2) {
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    roundRectPath(x, y, w, h, r);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function drawTriangle(x, y, s, c1, c2) {
    const g = ctx.createLinearGradient(x, y - s, x, y + s * 0.6);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x, y - s * 0.75);
    ctx.lineTo(x + s * 0.85, y + s * 0.55);
    ctx.lineTo(x - s * 0.85, y + s * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function drawPolygon(x, y, sides, r, c1, c2) {
    const g = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const a = (Math.PI * 2 * i) / sides - Math.PI / 2;
      const px = x + Math.cos(a) * r;
      const py = y + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function drawSpiral(x, y, maxR, c1, c2) {
    ctx.strokeStyle = c1;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    const turns = 3.2;
    const steps = 90;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const a = t * turns * Math.PI * 2;
      const r = t * maxR;
      const px = x + Math.cos(a) * r;
      const py = y + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.strokeStyle = c2;
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = 0.7;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = c2;
    ctx.beginPath();
    ctx.arc(x, y, maxR * 0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawLeaf(x, y, s, c1, c2) {
    const g = ctx.createLinearGradient(x - s, y, x + s, y);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x, y - s * 0.85);
    ctx.bezierCurveTo(x + s * 0.7, y - s * 0.4, x + s * 0.65, y + s * 0.35, x, y + s * 0.85);
    ctx.bezierCurveTo(x - s * 0.65, y + s * 0.35, x - s * 0.7, y - s * 0.4, x, y - s * 0.85);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y - s * 0.7);
    ctx.quadraticCurveTo(x + s * 0.08, y, x, y + s * 0.7);
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.stroke();
  }

  function drawCrystal(x, y, s, c1, c2, c3) {
    const g = ctx.createLinearGradient(x, y - s, x, y + s);
    g.addColorStop(0, c3);
    g.addColorStop(0.35, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + s * 0.55, y - s * 0.15);
    ctx.lineTo(x + s * 0.4, y + s * 0.85);
    ctx.lineTo(x - s * 0.4, y + s * 0.85);
    ctx.lineTo(x - s * 0.55, y - s * 0.15);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x, y + s * 0.85);
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.stroke();
  }

  function drawRing(x, y, outer, inner, c1, c2) {
    const g = ctx.createLinearGradient(x - outer, y - outer, x + outer, y + outer);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, outer, 0, Math.PI * 2);
    ctx.arc(x, y, inner, 0, Math.PI * 2, true);
    ctx.fill("evenodd");
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, outer, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, inner, 0, Math.PI * 2);
    ctx.stroke();
    // soft glow
    ctx.strokeStyle = c1;
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(x, y, (outer + inner) / 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawCrown(x, y, s, c1, c2, jewel) {
    const g = ctx.createLinearGradient(x, y - s * 0.5, x, y + s * 0.4);
    g.addColorStop(0, c2);
    g.addColorStop(1, c1);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x - s * 0.55, y + s * 0.25);
    ctx.lineTo(x - s * 0.55, y - s * 0.05);
    ctx.lineTo(x - s * 0.28, y + s * 0.12);
    ctx.lineTo(x, y - s * 0.45);
    ctx.lineTo(x + s * 0.28, y + s * 0.12);
    ctx.lineTo(x + s * 0.55, y - s * 0.05);
    ctx.lineTo(x + s * 0.55, y + s * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();
    // jewels
    [[0, -s * 0.28], [-s * 0.35, s * 0.02], [s * 0.35, s * 0.02]].forEach(([jx, jy], i) => {
      ctx.fillStyle = i === 0 ? jewel : "#18dcff";
      ctx.beginPath();
      ctx.arc(x + jx, y + jy, s * 0.07, 0, Math.PI * 2);
      ctx.fill();
    });
    // band
    ctx.fillStyle = c1;
    ctx.fillRect(x - s * 0.55, y + s * 0.22, s * 1.1, s * 0.12);
  }

  function drawStar(x, y, points, outer, inner, c1, c2) {
    const g = ctx.createLinearGradient(x - outer, y - outer, x + outer, y + outer);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outer : inner;
      const angle = (Math.PI / points) * i - Math.PI / 2;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawHeart(x, y, s, c1, c2) {
    const g = ctx.createLinearGradient(x - s, y - s, x + s, y + s);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.35);
    ctx.bezierCurveTo(x, y, x - s, y - s * 0.6, x - s, y - s * 0.15);
    ctx.bezierCurveTo(x - s, y + s * 0.35, x, y + s * 0.7, x, y + s);
    ctx.bezierCurveTo(x, y + s * 0.7, x + s, y + s * 0.35, x + s, y - s * 0.15);
    ctx.bezierCurveTo(x + s, y - s * 0.6, x, y, x, y + s * 0.35);
    ctx.fill();
  }

  function drawDiamond(x, y, s, c1, c2) {
    const g = ctx.createLinearGradient(x, y - s, x, y + s);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + s * 0.72, y);
    ctx.lineTo(x, y + s);
    ctx.lineTo(x - s * 0.72, y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawFlower(x, y, petalR, petals, c1, c2, center) {
    for (let i = 0; i < petals; i++) {
      const angle = (Math.PI * 2 * i) / petals;
      const px = x + Math.cos(angle) * petalR * 1.1;
      const py = y + Math.sin(angle) * petalR * 1.1;
      ctx.fillStyle = i % 2 === 0 ? c1 : c2;
      ctx.beginPath();
      ctx.ellipse(px, py, petalR, petalR * 0.65, angle, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = center;
    ctx.beginPath();
    ctx.arc(x, y, petalR * 0.55, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawMoon(x, y, r, c1, c2) {
    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x + r * 0.35, y - r * 0.1, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = c2;
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(x, y, r * 1.15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawStarsField(w, h, n) {
    ctx.save();
    ctx.translate(-w / 2, -h / 2);
    for (let i = 0; i < n; i++) {
      const x = (Math.sin(i * 12.9898) * 0.5 + 0.5) * w;
      const y = (Math.cos(i * 78.233) * 0.5 + 0.5) * h;
      ctx.fillStyle = i % 4 === 0 ? "#a55eea" : "#fff";
      ctx.globalAlpha = 0.4 + (i % 5) * 0.1;
      ctx.beginPath();
      ctx.arc(x, y, 1 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawSunset(w, h) {
    ctx.translate(-w / 2, -h / 2);
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#1a1030");
    sky.addColorStop(0.45, "#c44569");
    sky.addColorStop(0.7, "#f8a05a");
    sky.addColorStop(1, "#f6d365");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#ff6b35";
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.58, w * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1028";
    ctx.beginPath();
    ctx.moveTo(0, h * 0.72);
    ctx.quadraticCurveTo(w * 0.25, h * 0.55, w * 0.5, h * 0.7);
    ctx.quadraticCurveTo(w * 0.75, h * 0.85, w, h * 0.65);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();
  }

  function drawGalaxy(w, h) {
    ctx.translate(-w / 2, -h / 2);
    const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 10, w * 0.5, h * 0.5, w * 0.7);
    bg.addColorStop(0, "#3d1a6e");
    bg.addColorStop(0.4, "#1a0a40");
    bg.addColorStop(1, "#050510");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    for (let arm = 0; arm < 3; arm++) {
      ctx.strokeStyle = arm === 1 ? "rgba(124,108,255,0.35)" : "rgba(61,214,198,0.25)";
      ctx.lineWidth = 8;
      ctx.beginPath();
      for (let t = 0; t < 40; t++) {
        const a = t * 0.35 + arm * ((Math.PI * 2) / 3);
        const r = 10 + t * (w * 0.012);
        const x = w * 0.5 + Math.cos(a) * r;
        const y = h * 0.5 + Math.sin(a) * r * 0.7;
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    for (let i = 0; i < 60; i++) {
      const x = (((i * 97) % 100) / 100) * w;
      const y = (((i * 53) % 100) / 100) * h;
      ctx.fillStyle = i % 5 === 0 ? "#ff9ff3" : "#fff";
      ctx.globalAlpha = 0.3 + (i % 4) * 0.15;
      ctx.beginPath();
      ctx.arc(x, y, 1 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#f6e58d";
    ctx.shadowColor = "#a55eea";
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.5, w * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function drawPrism(w, h) {
    ctx.translate(-w / 2, -h / 2);
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, "#101028");
    bg.addColorStop(0.5, "#1a1840");
    bg.addColorStop(1, "#0a2830");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.moveTo(0, h * 0.35);
    ctx.lineTo(w * 0.42, h * 0.48);
    ctx.lineTo(w * 0.42, h * 0.52);
    ctx.lineTo(0, h * 0.45);
    ctx.fill();
    const px = w * 0.5;
    const py = h * 0.55;
    const s = w * 0.18;
    const g = ctx.createLinearGradient(px - s, py, px + s, py);
    g.addColorStop(0, "rgba(255,255,255,0.55)");
    g.addColorStop(0.5, "rgba(200,220,255,0.35)");
    g.addColorStop(1, "rgba(255,255,255,0.5)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(px, py - s);
    ctx.lineTo(px + s, py + s * 0.7);
    ctx.lineTo(px - s, py + s * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ["#ff6b6b", "#ffb020", "#7bed9f", "#54a0ff", "#a55eea", "#ff9ff3"].forEach((color, i) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.moveTo(px + s * 0.3, py);
      ctx.lineTo(w * 0.95, h * (0.28 + i * 0.08));
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }

  // ── Board build ──
  function buildColorAssignment(total, matchSize, rand) {
    if (total % matchSize !== 0) {
      throw new Error(`Tiles (${total}) must divide by matchSize (${matchSize})`);
    }
    const groups = total / matchSize;
    const palette = seededShuffle(COLORS, rand).slice(0, groups);
    const assignment = [];
    palette.forEach((_, colorIndex) => {
      for (let i = 0; i < matchSize; i++) assignment.push(colorIndex);
    });
    return { colors: palette, indices: seededShuffle(assignment, rand) };
  }

  function currentLevel() {
    if (mode === "endless") return buildEndlessLevel(endlessWave);
    if (mode === "daily") return campaign[0];
    return campaign[levelIndex];
  }

  function modeTitle() {
    const map = {
      classic: "Level",
      kids: "Kids",
      challenge: "Challenge",
      daily: "Daily",
      endless: "Wave",
      photo: "Photo",
    };
    return map[mode] || "Level";
  }

  function twistLabels(level) {
    const bits = [];
    bits.push(`×${level.matchSize}`);
    bits.push("2-streak");
    if (lastSolved) bits.push("At risk");
    if (level.focus) bits.push("Focus");
    if (level.previewMs) bits.push("Preview");
    if (level.ghostMs) bits.push("Ghost");
    if (level.peeks) bits.push(`${level.peeks} Peek${level.peeks > 1 ? "s" : ""}`);
    if (settings.patterns) bits.push("Patterns");
    if (mode === "photo") bits.push("Photo");
    return bits;
  }

  function updateHud(level) {
    hud.modeLabel.textContent = modeTitle();
    if (mode === "endless") {
      hud.level.textContent = String(endlessWave);
    } else if (mode === "daily") {
      hud.level.textContent = "★";
    } else {
      hud.level.textContent = String(levelIndex + 1);
    }
    hud.name.textContent = level.name;
    hud.match.textContent = String(level.matchSize);
    hud.peeks.textContent = String(peeksLeft);
    hud.moves.textContent = String(moves);
    hud.left.textContent = String(tiles.filter((t) => !t.matched).length);
    if (hud.streak) {
      hud.streak.textContent = `${sameColorStreak}/2`;
      hud.streak.classList.toggle("stat-warn", sameColorStreak === 1 && !!lastSolved);
    }
    let streakTip = " Need 2 of the same color in a row.";
    if (sameColorStreak === 1) {
      streakTip = lastSolved
        ? " One more of that color — miss and your last solved color returns."
        : " One more of that color to bank the streak.";
    } else if (sameColorStreak >= 2) {
      streakTip = " Streak safe. Keep matching!";
    } else if (lastSolved) {
      streakTip = " Last solve is at risk until you land a 2-streak.";
    }
    hud.tip.textContent = level.tip + streakTip;
    if (twistEl) {
      twistEl.innerHTML = twistLabels(level)
        .map((t) => `<span class="twist-chip">${t}</span>`)
        .join("");
    }
    if (btnPeek) {
      btnPeek.disabled = peeksLeft <= 0 || inputLocked;
      btnPeek.textContent = peeksLeft > 0 ? `Peek (${peeksLeft})` : "No peeks";
    }
  }

  function updateArtProgress() {
    const total = tiles.length;
    const done = tiles.filter((t) => t.matched).length;
    if (done === total && total > 0) {
      canvas.style.opacity = "1";
      return;
    }
    const p = total ? done / total : 0;
    canvas.style.opacity = String(0.18 + p * 0.72);
  }

  function setTileVisual(tile, modeName) {
    tile.el.classList.remove("flashing", "remembered", "matched", "wrong", "ghost", "preview");
    tile.el.style.background = "";
    tile.el.style.removeProperty("--ghost");
    tile.el.style.removeProperty("--c");
    tile.el.removeAttribute("data-pattern");

    if (modeName === "flash" || modeName === "preview") {
      tile.el.style.background = tile.color.hex;
      tile.el.style.setProperty("--c", tile.color.hex);
      tile.el.classList.add(modeName === "preview" ? "preview" : "flashing");
      if (settings.patterns) {
        tile.el.setAttribute("data-pattern", tile.color.pattern || "solid");
      }
      tile.el.setAttribute("aria-label", `Color ${tile.color.id}${settings.patterns ? ", pattern " + tile.color.pattern : ""}`);
    } else if (modeName === "ghost") {
      tile.el.classList.add("ghost");
      tile.el.style.setProperty("--ghost", tile.color.hex);
      if (settings.patterns) {
        tile.el.setAttribute("data-pattern", tile.color.pattern || "solid");
        tile.el.style.setProperty("--c", tile.color.hex);
      }
      tile.el.setAttribute("aria-label", `Fading ${tile.color.id}`);
    } else if (modeName === "remembered") {
      if (settings.marks) {
        tile.el.classList.add("remembered");
        tile.el.setAttribute("aria-label", "Counted — remember its color");
      } else {
        tile.el.setAttribute("aria-label", "Hidden piece");
      }
    } else if (modeName === "matched") {
      tile.el.classList.add("matched");
      tile.el.disabled = true;
      tile.el.setAttribute("aria-label", "Matched");
    } else {
      tile.el.setAttribute("aria-label", "Hidden piece");
    }
  }

  function abandonProgress(exceptColorKey) {
    Object.keys(progress).forEach((key) => {
      if (key === exceptColorKey) return;
      progress[key].forEach((i) => {
        if (!tiles[i].matched) setTileVisual(tiles[i], "hidden");
      });
      delete progress[key];
    });
  }

  function clearBrokenStreakProgress(oldColorKey) {
    if (!oldColorKey || !progress[oldColorKey]) return;
    progress[oldColorKey].forEach((i) => {
      if (!tiles[i].matched) {
        tiles[i].el.classList.add("wrong");
        setTileVisual(tiles[i], "hidden");
        setTimeout(() => tiles[i].el.classList.remove("wrong"), 350);
      }
    });
    delete progress[oldColorKey];
  }

  /** Put the last fully solved color back on the board. */
  function unsolveLastColor() {
    if (!lastSolved) return false;
    const { indices, color } = lastSolved;
    lastSolved = null;
    combo = 0;

    indices.forEach((i) => {
      const t = tiles[i];
      if (!t) return;
      t.matched = false;
      t.el.disabled = false;
      t.el.classList.add("wrong");
      setTileVisual(t, "flash");
      setTimeout(() => {
        if (!t.matched) {
          t.el.classList.remove("wrong");
          setTileVisual(t, "hidden");
        }
      }, 450);
    });

    sfxStepBack();
    toast(
      color && color.id
        ? `Broken streak — ${color.id} returned`
        : "Broken streak — last solved color returned"
    );
    updateArtProgress();
    return true;
  }

  /**
   * Track same-color click streak.
   * Switching before 2 in a row → last solved color comes back.
   */
  function applyStreakRule(colorKey) {
    if (streakColorKey === null) {
      sameColorStreak = 1;
      streakColorKey = colorKey;
      return;
    }

    if (colorKey === streakColorKey) {
      sameColorStreak += 1;
      return;
    }

    // Switched colors before landing 2 in a row
    if (sameColorStreak < 2) {
      clearBrokenStreakProgress(streakColorKey);
      unsolveLastColor();
    }

    sameColorStreak = 1;
    streakColorKey = colorKey;
  }

  function resetStreakAfterSolve() {
    // Solved set already required matchSize hits; streak is satisfied.
    // Reset so the next color can start cleanly without auto-penalty.
    sameColorStreak = 0;
    streakColorKey = null;
  }

  function scheduleAfterFlash(index, level) {
    if (flashTimers.has(index)) clearTimeout(flashTimers.get(index));
    const id = setTimeout(() => {
      flashTimers.delete(index);
      flashing.delete(index);
      const tile = tiles[index];
      if (!tile || tile.matched) return;

      if (level.ghostMs > 0 && !isInProgress(index)) {
        setTileVisual(tile, "ghost");
        if (ghostTimers.has(index)) clearTimeout(ghostTimers.get(index));
        const gid = setTimeout(() => {
          ghostTimers.delete(index);
          if (!tile.matched && !isInProgress(index)) setTileVisual(tile, "hidden");
          else if (isInProgress(index)) setTileVisual(tile, "remembered");
        }, level.ghostMs);
        ghostTimers.set(index, gid);
        return;
      }

      if (isInProgress(index)) setTileVisual(tile, "remembered");
      else setTileVisual(tile, "hidden");
    }, level.flashMs);
    flashTimers.set(index, id);
  }

  function lockSet(colorKey, indices) {
    inputLocked = true;
    combo += 1;
    const color = tiles[indices[0]] ? tiles[indices[0]].color : null;
    // Most recent solve is the only one that can return if you break a 2-streak later.
    // Earlier solves stay locked once a newer color is solved.
    lastSolved = { colorKey, indices: indices.slice(), color };
    resetStreakAfterSolve();
    sfxMatch();

    indices.forEach((i) => {
      if (flashTimers.has(i)) {
        clearTimeout(flashTimers.get(i));
        flashTimers.delete(i);
      }
      if (ghostTimers.has(i)) {
        clearTimeout(ghostTimers.get(i));
        ghostTimers.delete(i);
      }
      flashing.delete(i);
      setTileVisual(tiles[i], "flash");
    });

    if (combo >= 2) toast(`Combo ×${combo}!`);

    setTimeout(() => {
      indices.forEach((i) => {
        tiles[i].matched = true;
        setTileVisual(tiles[i], "matched");
      });
      delete progress[colorKey];
      inputLocked = false;
      updateHud(currentLevel());
      updateArtProgress();
      if (tiles.every((t) => t.matched)) {
        lastSolved = null; // level over — no return
        completeLevel();
      }
    }, 300);
  }

  function onTileClick(index) {
    if (inputLocked) return;
    const level = currentLevel();
    const tile = tiles[index];
    if (!tile || tile.matched) return;
    if (isInProgress(index)) return;
    if (flashing.has(index)) return;

    moves += 1;
    sfxFlash();
    haptic(6);

    const colorKey = String(tile.colorIndex);

    // Streak rule runs before progress updates
    applyStreakRule(colorKey);

    if (level.focus && !progress[colorKey]) {
      abandonProgress(colorKey);
    }

    flashing.add(index);
    setTileVisual(tile, "flash");
    scheduleAfterFlash(index, level);

    if (progress[colorKey]) {
      progress[colorKey].push(index);
      if (progress[colorKey].length >= level.matchSize) {
        lockSet(colorKey, progress[colorKey].slice());
      } else {
        updateHud(level);
      }
      return;
    }

    progress[colorKey] = [index];
    if (sameColorStreak === 1) combo = 0;
    updateHud(level);
  }

  function runPreview(level) {
    if (!level.previewMs) return Promise.resolve();
    inputLocked = true;
    toast("Memorize…");
    tiles.forEach((t) => {
      if (!t.matched) setTileVisual(t, "preview");
    });
    return new Promise((resolve) => {
      setTimeout(() => {
        tiles.forEach((t, i) => {
          if (t.matched) return;
          if (isInProgress(i)) setTileVisual(t, "remembered");
          else setTileVisual(t, "hidden");
        });
        inputLocked = false;
        toast("Go!");
        resolve();
      }, level.previewMs);
    });
  }

  function usePeek() {
    if (peeksLeft <= 0 || inputLocked) return;
    const level = currentLevel();
    peeksLeft -= 1;
    peeksUsed += 1;
    sfxPeek();
    inputLocked = true;
    updateHud(level);

    tiles.forEach((t) => {
      if (!t.matched) setTileVisual(t, "preview");
    });

    setTimeout(() => {
      tiles.forEach((t, i) => {
        if (t.matched) return;
        if (isInProgress(i)) setTileVisual(t, "remembered");
        else setTileVisual(t, "hidden");
      });
      inputLocked = false;
      updateHud(level);
    }, Math.max(level.flashMs, 900));
  }

  function starRating(level) {
    const total = level.cols * level.rows;
    const ideal = total;
    const ratio = moves / Math.max(ideal, 1);
    let stars = 3;
    if (ratio > 1.6 || peeksUsed > (level.peeks || 0)) stars = 2;
    if (ratio > 2.6 || peeksUsed > (level.peeks || 0) + 1) stars = 1;
    if (moves <= ideal * 1.2 && peeksUsed <= 1) stars = 3;
    if (moves <= ideal && peeksUsed === 0) stars = 3;
    return Math.max(1, Math.min(3, stars));
  }

  function saveDailyScore(stars, movesCount, elapsed) {
    try {
      const prev = JSON.parse(localStorage.getItem(DAILY_KEY) || "null");
      const entry = { date: dailySeedKey, stars, moves: movesCount, elapsed };
      if (!prev || prev.date !== dailySeedKey || movesCount < prev.moves) {
        localStorage.setItem(DAILY_KEY, JSON.stringify(entry));
      }
    } catch {
      /* ignore */
    }
  }

  function saveEndlessBest(wave) {
    try {
      const best = Number(localStorage.getItem(ENDLESS_BEST_KEY) || "0");
      if (wave > best) localStorage.setItem(ENDLESS_BEST_KEY, String(wave));
    } catch {
      /* ignore */
    }
  }

  function completeLevel() {
    inputLocked = true;
    clearTimers();
    stage.classList.add("revealed");
    canvas.style.opacity = "1";
    sfxWin();

    const elapsed = Math.round((performance.now() - levelStartTime) / 1000);
    const level = currentLevel();
    const stars = starRating(level);

    let isLast = false;
    let nextLabel = "Next level";
    let eyebrow = "Picture unlocked";
    let title = `${level.name} unlocked`;

    if (mode === "daily") {
      isLast = true;
      nextLabel = "Back to menu";
      eyebrow = "Daily complete";
      title = "Today's mosaic cleared";
      saveDailyScore(stars, moves, elapsed);
    } else if (mode === "endless") {
      isLast = false;
      nextLabel = `Wave ${endlessWave + 1}`;
      eyebrow = "Wave cleared";
      title = `Wave ${endlessWave} done`;
      saveEndlessBest(endlessWave);
    } else {
      isLast = levelIndex >= campaign.length - 1;
      nextLabel = isLast ? "Play again" : "Next level";
      if (isLast) title = mode === "photo" ? "Photo fully unlocked!" : "Campaign complete!";
    }

    $("#win-eyebrow").textContent = eyebrow;
    $("#win-title").textContent = title;
    let stats = `${moves} moves · ${elapsed}s · match ${level.matchSize}`;
    if (mode === "endless") {
      const best = Number(localStorage.getItem(ENDLESS_BEST_KEY) || "0");
      stats += ` · best wave ${Math.max(best, endlessWave)}`;
    }
    if (mode === "daily") stats += ` · ${dailySeedKey}`;
    $("#win-stats").textContent = stats;
    if (hud.stars) {
      hud.stars.textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
      hud.stars.setAttribute("aria-label", `${stars} of 3 stars`);
    }
    $("#btn-next").textContent = nextLabel;
    winOverlay.classList.remove("hidden");
  }

  async function startLevelAt(indexOrWave) {
    clearTimers();
    progress = Object.create(null);
    moves = 0;
    peeksUsed = 0;
    inputLocked = false;
    combo = 0;
    sameColorStreak = 0;
    streakColorKey = null;
    lastSolved = null;
    winOverlay.classList.add("hidden");
    stage.classList.remove("revealed");

    if (mode === "endless") {
      endlessWave = Math.max(1, indexOrWave || endlessWave);
    } else if (mode === "daily") {
      levelIndex = 0;
    } else {
      levelIndex = Math.max(0, Math.min(indexOrWave, campaign.length - 1));
    }

    const level = currentLevel();
    peeksLeft = level.peeks || 0;

    // Seeded assignment for daily; random otherwise
    if (mode === "daily") {
      levelRand = mulberry32(hashSeed("remosaic-board-" + dailySeedKey));
    } else if (mode === "endless") {
      levelRand = mulberry32(hashSeed("endless-" + endlessWave + "-" + Date.now()));
    } else {
      levelRand = Math.random;
    }

    const total = level.cols * level.rows;
    const { colors, indices } = buildColorAssignment(total, level.matchSize, levelRand);

    tiles = indices.map((colorIndex) => ({
      colorIndex,
      color: colors[colorIndex],
      matched: false,
      el: null,
    }));

    boardEl.style.gridTemplateColumns = `repeat(${level.cols}, 1fr)`;
    boardEl.style.gridTemplateRows = `repeat(${level.rows}, 1fr)`;
    boardEl.innerHTML = "";

    tiles.forEach((tile, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tile";
      btn.setAttribute("role", "gridcell");
      btn.setAttribute("aria-label", `Piece ${i + 1}, hidden`);
      btn.dataset.index = String(i);
      btn.addEventListener("click", () => onTileClick(i));
      tile.el = btn;
      boardEl.appendChild(btn);
    });

    drawArt(level.art);
    updateArtProgress();
    updateHud(level);
    showScreen("game");

    // Celebrate shape milestones (cadence in SHAPE_MILESTONES)
    const n = mode === "endless" ? endlessWave : levelIndex + 1;
    if (
      (mode === "classic" || mode === "kids" || mode === "challenge") &&
      SHAPE_MILESTONES.includes(n)
    ) {
      toast(`New shape: ${level.name}!`);
    }

    await runPreview(level);
    levelStartTime = performance.now();
  }

  function beginMode(selected) {
    mode = selected;
    if (mode === "classic") campaign = CLASSIC_LEVELS.slice();
    else if (mode === "kids") campaign = kidsLevels();
    else if (mode === "challenge") campaign = challengeLevels();
    else if (mode === "photo") campaign = photoLevels();
    else if (mode === "daily") {
      dailySeedKey = dateSeedString();
      campaign = [buildDailyLevel()];
    } else if (mode === "endless") {
      endlessWave = 1;
      campaign = [];
    }

    if (mode === "endless") startLevelAt(1);
    else startLevelAt(0);
  }

  // ── Photo load ──
  function loadPhotoFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      toast("Please choose an image file");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      customPhoto = img;
      photoStatus.classList.remove("hidden");
      photoStatus.textContent = `Loaded: ${file.name} — starting photo mode…`;
      toast("Photo ready");
      beginMode("photo");
    };
    img.onerror = () => toast("Could not load that image");
    img.src = url;
  }

  // ── Settings UI ──
  function syncSettingsUI() {
    $("#opt-sound").checked = settings.sound;
    $("#opt-haptics").checked = settings.haptics;
    $("#opt-patterns").checked = settings.patterns;
    $("#opt-marks").checked = settings.marks;
  }

  function bindSettings() {
    const map = {
      "opt-sound": "sound",
      "opt-haptics": "haptics",
      "opt-patterns": "patterns",
      "opt-marks": "marks",
    };
    Object.entries(map).forEach(([id, key]) => {
      const el = $("#" + id);
      if (!el) return;
      el.addEventListener("change", () => {
        settings[key] = el.checked;
        saveSettings(settings);
      });
    });
  }

  function updateDailyLabel() {
    const el = $("#daily-label");
    if (!el) return;
    const key = dateSeedString();
    let extra = key;
    try {
      const prev = JSON.parse(localStorage.getItem(DAILY_KEY) || "null");
      if (prev && prev.date === key) {
        extra = `${key} · best ${prev.moves} moves`;
      }
    } catch {
      /* ignore */
    }
    el.textContent = extra;
  }

  // ── Events ──
  document.querySelectorAll(".mode-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const m = btn.getAttribute("data-mode");
      if (m === "photo") {
        if (customPhoto) beginMode("photo");
        else photoInput.click();
        return;
      }
      beginMode(m);
    });
  });

  photoInput.addEventListener("change", () => {
    const file = photoInput.files && photoInput.files[0];
    if (file) loadPhotoFile(file);
    photoInput.value = "";
  });

  $("#btn-how").addEventListener("click", () => showScreen("how"));
  $("#btn-how-back").addEventListener("click", () => showScreen("title"));
  $("#btn-settings").addEventListener("click", () => {
    syncSettingsUI();
    showScreen("settings");
  });
  $("#btn-settings-back").addEventListener("click", () => showScreen("title"));
  $("#btn-menu").addEventListener("click", () => {
    clearTimers();
    updateDailyLabel();
    showScreen("title");
  });
  $("#btn-restart").addEventListener("click", () => {
    if (mode === "endless") startLevelAt(endlessWave);
    else startLevelAt(levelIndex);
  });
  $("#btn-replay").addEventListener("click", () => {
    if (mode === "endless") startLevelAt(endlessWave);
    else startLevelAt(levelIndex);
  });
  $("#btn-next").addEventListener("click", () => {
    if (mode === "daily") {
      updateDailyLabel();
      showScreen("title");
      return;
    }
    if (mode === "endless") {
      endlessWave += 1;
      startLevelAt(endlessWave);
      return;
    }
    if (levelIndex >= campaign.length - 1) {
      startLevelAt(0);
      return;
    }
    startLevelAt(levelIndex + 1);
  });
  if (btnPeek) btnPeek.addEventListener("click", usePeek);

  bindSettings();
  updateDailyLabel();

  window.addEventListener("resize", () => {
    if (!screens.game.classList.contains("active")) return;
    drawArt(currentLevel().art);
    updateArtProgress();
  });

  window.addEventListener("keydown", (e) => {
    if (!screens.game.classList.contains("active")) return;
    if (e.key === "p" || e.key === "P") usePeek();
    if (e.key === "r" || e.key === "R") {
      if (mode === "endless") startLevelAt(endlessWave);
      else startLevelAt(levelIndex);
    }
  });

  // Drag & drop photo onto title
  const titleCard = document.querySelector(".title-card");
  if (titleCard) {
    ["dragenter", "dragover"].forEach((ev) => {
      titleCard.addEventListener(ev, (e) => {
        e.preventDefault();
        titleCard.classList.add("drag-over");
      });
    });
    ["dragleave", "drop"].forEach((ev) => {
      titleCard.addEventListener(ev, (e) => {
        e.preventDefault();
        titleCard.classList.remove("drag-over");
      });
    });
    titleCard.addEventListener("drop", (e) => {
      const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) loadPhotoFile(file);
    });
  }

  window.Remosaic = {
    beginMode,
    startLevelAt,
    CLASSIC_LEVELS,
  };
})();
