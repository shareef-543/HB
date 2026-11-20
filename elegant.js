'use strict';

/* ============================================================
   BIRTHDAY WEBSITE — elegant.js
   ============================================================ */

// ─── CONSTANTS ───────────────────────────────
const PASSWORD  = '21112005';
const MAX_TRIES = 3;
const TOTAL     = 5;
const COLS = ['#c9a84c','#e8cc7a','#d4607a','#f0849a','#4a7fe0','#7aaaf5','#9b59b6','#ffffff'];
const HRT  = ['❤️','💙','💜','🤍','💛','🩵'];
const GATE_HEARTS_LIST = ['💙','💜','🩷','🤍','💛','❤️','🩵','✨','🌸','⭐'];

let tries    = 0;
let current  = 0;
let msgTyped = false;
let blown    = false;
let playing  = false;
let aCtx     = null;
let mNodes   = [];
let gateHeartTimer = null;

// ─── 1. BACKGROUND PARTICLES ─────────────────
(function bgParticles() {
  const cv = document.getElementById('bg-canvas');
  if (!cv) return;
  const cx = cv.getContext('2d');
  let W, H, pts = [];

  function resize() {
    W = cv.width  = window.innerWidth;
    H = cv.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 90; i++) pts.push({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    r:  Math.random() * 1.2 + 0.3,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    a:  Math.random()
  });

  function draw() {
    cx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      cx.beginPath();
      cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      cx.fillStyle = `rgba(201,168,76,${p.a * 0.35})`;
      cx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── 2. GATE HEARTS ──────────────────────────
function spawnGateHeart() {
  const el = document.getElementById('gate-hearts');
  if (!el) return;
  const h = document.createElement('div');
  h.className = 'g-heart';
  h.textContent = GATE_HEARTS_LIST[Math.floor(Math.random() * GATE_HEARTS_LIST.length)];
  const dur = Math.random() * 7 + 6;
  h.style.cssText = `
    left:${Math.random() * 100}%;
    bottom:${Math.random() * 20}%;
    font-size:${Math.random() * 1.2 + 0.6}rem;
    animation-duration:${dur}s;
    animation-delay:${Math.random() * 2}s;
  `;
  el.appendChild(h);
  setTimeout(() => { try { h.remove(); } catch(e){} }, (dur + 2) * 1000);
}

for (let i = 0; i < 12; i++) setTimeout(spawnGateHeart, i * 400);
gateHeartTimer = setInterval(spawnGateHeart, 1200);

// ─── 3. PASSWORD GATE ────────────────────────
function toggleEye() {
  const inp = document.getElementById('pw');
  const btn = document.getElementById('eye-btn');
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.textContent = inp.type === 'password' ? '👁' : '🙈';
}

function unlock() {
  const val = document.getElementById('pw').value;
  const err = document.getElementById('gate-err');

  if (val === PASSWORD) {
    err.textContent = '';
    clearInterval(gateHeartTimer);
    const gate = document.getElementById('gate');
    gate.classList.add('out');
    setTimeout(() => {
      gate.style.display = 'none';
      document.getElementById('slides').classList.remove('hidden');
      document.getElementById('arr-next').classList.remove('hidden-arr');
      document.getElementById('dot-nav').style.display = '';
      document.getElementById('music-fab').style.display = 'none';
      goTo(0);
      triggerConfettiOn('c0');
    }, 720);
  } else {
    tries++;
    const dot = document.getElementById('a' + tries);
    if (dot) dot.classList.add('used');
    const inp = document.getElementById('pw');
    inp.value = '';
    inp.classList.remove('shake');
    void inp.offsetWidth;
    inp.classList.add('shake');
    setTimeout(() => inp.classList.remove('shake'), 500);
    if (tries >= MAX_TRIES) {
      err.textContent = 'Too many attempts. Refresh to try again.';
      document.querySelector('.gate-submit').disabled = true;
      inp.disabled = true;
    } else {
      err.textContent = `Wrong password — ${MAX_TRIES - tries} attempt${MAX_TRIES - tries !== 1 ? 's' : ''} left.`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const pwInput = document.getElementById('pw');
  if (pwInput) pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') unlock(); });
  document.getElementById('arr-prev').classList.add('hidden-arr');
  document.getElementById('arr-next').classList.add('hidden-arr');
  document.getElementById('dot-nav').style.display = 'none';
  document.getElementById('music-fab').style.display = 'none';
});

// ─── 4. SLIDE ENGINE ─────────────────────────
const slides = document.querySelectorAll('.slide');

function goTo(idx) {
  if (idx < 0 || idx >= TOTAL) return;
  slides.forEach((s, i) => {
    s.classList.remove('active', 'exit-left');
    if (i < idx) s.classList.add('exit-left');
  });
  slides[idx].classList.add('active');
  current = idx;
  updateNav();

  // Per-slide triggers
  if (idx === 1 && !msgTyped) startTypewriter();
  if (idx === 3) document.getElementById('music-fab').style.display = '';
  if (idx === 4) {
    setTimeout(() => triggerConfettiOn('c4'), 300);
    spawnHearts(25);
  }
}

function nextSlide() { goTo(current + 1); }
function prevSlide() { goTo(current - 1); }

function updateNav() {
  document.getElementById('arr-prev').classList.toggle('hidden-arr', current === 0);
  document.getElementById('arr-next').classList.toggle('hidden-arr', current === TOTAL - 1);
  document.querySelectorAll('.dot-n').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

// Keyboard
document.addEventListener('keydown', e => {
  if (document.getElementById('slides').classList.contains('hidden')) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextSlide();
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prevSlide();
});

// Swipe
let tsX = 0, tsY = 0;
document.addEventListener('touchstart', e => {
  tsX = e.touches[0].clientX;
  tsY = e.touches[0].clientY;
}, { passive: true });
document.addEventListener('touchend', e => {
  if (document.getElementById('slides').classList.contains('hidden')) return;
  const dx = tsX - e.changedTouches[0].clientX;
  const dy = Math.abs(tsY - e.changedTouches[0].clientY);
  if (Math.abs(dx) > 50 && dy < 60) dx > 0 ? nextSlide() : prevSlide();
}, { passive: true });

// ─── 5. CONFETTI ─────────────────────────────
function triggerConfettiOn(canvasId) {
  const cv = document.getElementById(canvasId);
  if (!cv) return;
  const cx = cv.getContext('2d');
  cv.width  = window.innerWidth;
  cv.height = window.innerHeight;
  let pieces = [];

  for (let i = 0; i < 140; i++) pieces.push({
    x:  Math.random() * cv.width,
    y:  -20,
    vx: (Math.random() - 0.5) * 6,
    vy: Math.random() * 4 + 2,
    color: COLS[Math.floor(Math.random() * COLS.length)],
    w:  Math.random() * 9 + 4,
    h:  Math.random() * 5 + 3,
    rot: Math.random() * Math.PI * 2,
    rspd: (Math.random() - 0.5) * 0.18,
    alpha: 1
  });

  function draw() {
    cx.clearRect(0, 0, cv.width, cv.height);
    pieces = pieces.filter(p => p.alpha > 0);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.05;
      p.rot += p.rspd;
      if (p.y > cv.height) p.alpha -= 0.08;
      cx.save();
      cx.globalAlpha = Math.max(0, p.alpha);
      cx.translate(p.x, p.y);
      cx.rotate(p.rot);
      cx.fillStyle = p.color;
      cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cx.restore();
    });
    if (pieces.length) requestAnimationFrame(draw);
    else cx.clearRect(0, 0, cv.width, cv.height);
  }
  draw();
}

// ─── 6. BLOW CANDLES ─────────────────────────
function blowAll() {
  if (blown) return;
  blown = true;
  ['fl1', 'fl2', 'fl3'].forEach((id, i) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.classList.add('out');
    }, i * 280);
  });
  const btn = document.getElementById('blow-btn');
  setTimeout(() => {
    if (btn) { btn.textContent = '✨ Wish sent to the universe...'; btn.disabled = true; }
    triggerConfettiOn('c0');
  }, 900);
  setTimeout(nextSlide, 2200);
}

// ─── 7. TYPEWRITER ───────────────────────────
const MSG = `Hello dear,

Enavea ena panra, saptiya, saptrupa nu ninaikura...
Happy Birthday! 🎂

Sorry vea — un birthday eppavume ipdithanla poguthu.
But I hope this birthday will be really special for you. 🌟

Inaikachu freeya iru. Mind la iruka stuff la thuki potutu be free.
Nalla sapdu, be strong, be brave, be happy. 💪

Yaru vanthalum ponalum — nee neya iru.
You have something special in you...
athu matu pogama pathuko.
Poirthalum thirumba grow paniko —
athutha unna unique a kattum. 🦋

One again, Happy Birthday Girl! 🥳`;

function startTypewriter() {
  if (msgTyped) return;
  msgTyped = true;
  const el = document.getElementById('letter-text');
  if (!el) return;
  el.innerHTML = '';
  const cur = document.createElement('span');
  cur.className = 'cursor-blink';
  el.appendChild(cur);
  let i = 0;
  const iv = setInterval(() => {
    if (i < MSG.length) {
      el.insertBefore(document.createTextNode(MSG[i++]), cur);
    } else {
      clearInterval(iv);
      setTimeout(() => { try { cur.remove(); } catch(e){} }, 2500);
    }
  }, 20);
}

// ─── 8. FLOATING HEARTS ──────────────────────
function spawnHearts(n) {
  n = n || 6;
  for (let i = 0; i < n; i++) {
    const h = document.createElement('div');
    Object.assign(h.style, {
      position:   'fixed',
      left:       Math.random() * 100 + 'vw',
      bottom:     '-40px',
      fontSize:   (Math.random() * 1.2 + 0.8) + 'rem',
      pointerEvents: 'none',
      zIndex:     '999',
      animation:  `floatH ${Math.random() * 4 + 5}s linear forwards`,
      animationDelay: (i * 0.15) + 's'
    });
    h.textContent = HRT[Math.floor(Math.random() * HRT.length)];
    document.body.appendChild(h);
    setTimeout(() => { try { h.remove(); } catch(e){} }, 9500);
  }
}

const ks = document.createElement('style');
ks.textContent = `@keyframes floatH {
  0%   { transform: translateY(0) rotate(-8deg); opacity: .9; }
  100% { transform: translateY(-110vh) rotate(8deg); opacity: 0; }
}`;
document.head.appendChild(ks);
setInterval(() => spawnHearts(1), 3000);

// ─── 9. YES / MAYBE ──────────────────────────
function sayYes() {
  const resp = document.getElementById('yes-resp');
  if (resp) resp.textContent = '🥺💙 She said yes... forever and always.';
  triggerConfettiOn('c0');
  spawnHearts(20);
  const btns = document.querySelector('.prop-btns');
  if (btns) btns.innerHTML = '<p style="font-size:2rem">💙</p>';
}

function flee(btn) {
  const margin = 80;
  const x = Math.random() * (window.innerWidth  - margin * 2) + margin;
  const y = Math.random() * (window.innerHeight - margin * 2) + margin;
  btn.style.position   = 'fixed';
  btn.style.left       = x + 'px';
  btn.style.top        = y + 'px';
  btn.style.zIndex     = '9999';
  btn.style.transition = 'left .18s ease, top .18s ease';
}

// ─── 10. MUSIC ───────────────────────────────
const NOTES = [
  [261.6,.3],[261.6,.15],[293.7,.45],[261.6,.45],[349.2,.45],[330.6,.9],
  [261.6,.3],[261.6,.15],[293.7,.45],[261.6,.45],[392.0,.45],[349.2,.9],
  [261.6,.3],[261.6,.15],[523.3,.45],[440.0,.45],[349.2,.45],[330.6,.45],[293.7,.45],
  [466.2,.3],[466.2,.15],[440.0,.45],[349.2,.45],[392.0,.45],[349.2,.9]
];

function toggleMusic() {
  const fab = document.getElementById('music-fab');
  if (!playing) {
    playMelody();
    fab.textContent = '♫';
    fab.classList.add('on');
    playing = true;
  } else {
    stopMelody();
    fab.textContent = '♪';
    fab.classList.remove('on');
    playing = false;
  }
}

function playMelody() {
  aCtx = new (window.AudioContext || window.webkitAudioContext)();
  let t = aCtx.currentTime + 0.1;
  NOTES.forEach(([f, d]) => {
    const o = aCtx.createOscillator();
    const g = aCtx.createGain();
    o.connect(g); g.connect(aCtx.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.22, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + d - 0.04);
    o.start(t); o.stop(t + d);
    mNodes.push(o); t += d;
  });
  const total = NOTES.reduce((s, [, d]) => s + d, 0);
  setTimeout(() => { if (playing) { stopMelody(); playMelody(); } }, total * 1000 + 100);
}

function stopMelody() {
  mNodes.forEach(n => { try { n.stop(); } catch(e){} });
  mNodes = [];
  if (aCtx) { aCtx.close(); aCtx = null; }
}
