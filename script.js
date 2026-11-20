/* ============================================================
   Birthday Website – JavaScript
   ============================================================ */

// ─── 0. PASSWORD GATE ────────────────────────────────────────
const CORRECT_PASSWORD = '21112005';   // 🔑 Password
const MAX_ATTEMPTS     = 3;
let   attempts         = 0;

function checkPassword() {
  const input = document.getElementById('pw-input').value;
  const error = document.getElementById('gate-error');

  if (input.toLowerCase() === CORRECT_PASSWORD.toLowerCase()) {
    // Correct!
    error.textContent = '🎉 Welcome! Enjoy the surprise!';
    error.style.color = '#7bed9f';
    const gate = document.getElementById('password-gate');
    setTimeout(() => {
      gate.classList.add('hide');
      setTimeout(() => { gate.style.display = 'none'; initialBurst(); startPageAnimations(); }, 650);
    }, 500);
  } else {
    // Wrong
    attempts++;
    const dot = document.getElementById(`dot-${attempts}`);
    if (dot) dot.classList.add('used');

    const remaining = MAX_ATTEMPTS - attempts;
    const pwInput   = document.getElementById('pw-input');

    pwInput.classList.remove('shake');
    void pwInput.offsetWidth; // reflow to restart animation
    pwInput.classList.add('shake');
    pwInput.value = '';

    if (attempts >= MAX_ATTEMPTS) {
      error.textContent = '🔒 Too many attempts! Try refreshing.';
      document.querySelector('.gate-btn').disabled = true;
      pwInput.disabled = true;
    } else {
      error.textContent = `❌ Wrong password! ${remaining} attempt${remaining !== 1 ? 's' : ''} left.`;
    }
    setTimeout(() => pwInput.classList.remove('shake'), 500);
  }
}

function togglePwVisibility() {
  const input = document.getElementById('pw-input');
  const btn   = document.getElementById('toggle-pw');
  if (input.type === 'password') {
    input.type  = 'text';
    btn.textContent = '🙈';
  } else {
    input.type  = 'password';
    btn.textContent = '👁️';
  }
}

// Allow Enter key to submit
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('pw-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') checkPassword();
  });
});


// ─── 1. CONFETTI ──────────────────────────────────────────────
const canvas  = document.getElementById('confetti-canvas');
const ctx     = canvas.getContext('2d');
let   pieces  = [];
const COLORS  = ['#ff6b9d','#c44dff','#ffd93d','#ff9f43','#00d2d3','#ff4757','#7bed9f','#eccc68'];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createPiece(x, y) {
  return {
    x,  y,
    vx: (Math.random() - 0.5) * 8,
    vy: (Math.random() * -12) - 4,
    gravity: 0.35,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
    w: Math.random() * 10 + 5,
    h: Math.random() * 6  + 4,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.2,
    alpha: 1,
    decay: Math.random() * 0.01 + 0.005,
  };
}

function burst(x, y, count = 60) {
  for (let i = 0; i < count; i++) pieces.push(createPiece(x, y));
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces = pieces.filter(p => p.alpha > 0);
  for (const p of pieces) {
    p.x  += p.vx;
    p.y  += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.99;
    p.rotation += p.rotSpeed;
    p.alpha    -= p.decay;

    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    if (p.shape === 'rect') {
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  requestAnimationFrame(animateConfetti);
}
animateConfetti();

// Auto-burst on load
function initialBurst() {
  const positions = [
    { x: canvas.width * 0.1, y: canvas.height * 0.3 },
    { x: canvas.width * 0.5, y: canvas.height * 0.1 },
    { x: canvas.width * 0.9, y: canvas.height * 0.3 },
  ];
  positions.forEach((pos, i) => {
    setTimeout(() => burst(pos.x, pos.y, 80), i * 300);
  });
}
setTimeout(initialBurst, 400);

// Click to burst
document.addEventListener('click', e => {
  if (e.target.closest('input, textarea, button, .customize-section')) return;
  burst(e.clientX, e.clientY, 50);
});


// ─── 2. BALLOONS ─────────────────────────────────────────────
const BALLOON_COLORS = ['#ff6b9d','#c44dff','#ffd93d','#ff9f43','#00d2d3','#ff4757','#7bed9f'];
const balloonsEl    = document.getElementById('balloons');

function spawnBalloon() {
  const bal = document.createElement('div');
  bal.className = 'balloon';
  const color    = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
  const left     = Math.random() * 100;
  const duration = Math.random() * 8 + 7;   // 7–15s
  const delay    = Math.random() * 5;
  const scale    = Math.random() * 0.5 + 0.7;

  bal.style.cssText = `
    left: ${left}%;
    background: radial-gradient(circle at 35% 35%, ${color}cc, ${color});
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    transform: scale(${scale});
  `;
  balloonsEl.appendChild(bal);
  setTimeout(() => bal.remove(), (duration + delay) * 1000);
}

// Spawn balloons periodically
for (let i = 0; i < 8; i++) spawnBalloon();
setInterval(spawnBalloon, 2500);


// ─── 3. PERSONALIZATION ──────────────────────────────────────
function updateWish() {
  const name    = document.getElementById('name-input').value.trim();
  const message = document.getElementById('message-input').value.trim();

  if (name) {
    const nameEl = document.getElementById('person-name');
    nameEl.style.transform = 'scale(1.2)';
    nameEl.textContent = name;
    setTimeout(() => { nameEl.style.transform = 'scale(1)'; }, 300);
  }

  if (message) {
    const msgEl = document.getElementById('birthday-message');
    msgEl.style.opacity = '0';
    setTimeout(() => {
      msgEl.textContent = message;
      msgEl.style.opacity = '1';
    }, 300);
  }

  // Celebrate!
  burst(window.innerWidth / 2, window.innerHeight / 3, 120);
  setTimeout(() => burst(window.innerWidth * 0.2, window.innerHeight * 0.5, 80), 200);
  setTimeout(() => burst(window.innerWidth * 0.8, window.innerHeight * 0.5, 80), 400);

  // Flash the update button
  const btn = document.querySelector('.update-btn');
  btn.textContent = '🎊 Updated!';
  btn.style.background = 'linear-gradient(135deg, #00d2d3, #7bed9f)';
  setTimeout(() => {
    btn.textContent = '🎉 Update Wish!';
    btn.style.background = '';
  }, 2000);
}

// Allow Enter in name input to trigger update
document.getElementById('name-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') updateWish();
});


// ─── 4. SPARKLE CURSOR ───────────────────────────────────────
document.addEventListener('mousemove', e => {
  if (Math.random() > 0.85) {
    const spark = document.createElement('div');
    Object.assign(spark.style, {
      position:   'fixed',
      left:       e.clientX + 'px',
      top:        e.clientY  + 'px',
      width:      '6px',
      height:     '6px',
      borderRadius:'50%',
      background: COLORS[Math.floor(Math.random() * COLORS.length)],
      pointerEvents: 'none',
      zIndex:     '998',
      transition: 'all 0.6s ease',
      transform:  'scale(1)',
      opacity:    '1',
    });
    document.body.appendChild(spark);
    requestAnimationFrame(() => {
      spark.style.transform  = 'scale(0) translateY(-20px)';
      spark.style.opacity    = '0';
    });
    setTimeout(() => spark.remove(), 650);
  }
});


// ─── 5. TITLE BLINK (tab) ────────────────────────────────────
const titles = ['🎂 Happy Birthday Forever!', '🎉 Celebrate!', '🥳 It\'s Your Day, Forever!', '💖 Forever & Always!'];
let   ti     = 0;
setInterval(() => {
  document.title = titles[ti++ % titles.length];
}, 1800);
