
// ─── BLOW THE CANDLES ────────────────────────────────────────
let candlesBlown = false;

function blowCandles() {
  if (candlesBlown) return;
  candlesBlown = true;

  const flames = document.querySelectorAll('.flame');
  const btn    = document.getElementById('blow-btn');
  const hint   = document.getElementById('blow-hint');

  // Blow out one by one
  flames.forEach((f, i) => {
    setTimeout(() => {
      f.classList.add('out');
      // small smoke puff
      const puff = document.createElement('div');
      puff.style.cssText = `
        position:absolute; font-size:1rem; color:rgba(255,255,255,0.5);
        animation: fadeInUp 1s ease forwards; pointer-events:none;
        left:${f.getBoundingClientRect().left + window.scrollX}px;
        top:${f.getBoundingClientRect().top + window.scrollY - 20}px;
        z-index:999;
      `;
      puff.textContent = '💨';
      document.body.appendChild(puff);
      setTimeout(() => puff.remove(), 1000);
    }, i * 300);
  });

  setTimeout(() => {
    btn.disabled = true;
    btn.textContent = '🕯️ Wish Made!';
    hint.innerHTML = '<span class="wish-revealed">🌟 Your wish is on its way to the universe! 🌟</span>';
    // Big confetti burst
    burst(window.innerWidth / 2, window.innerHeight / 2, 150);
    spawnHeartsBurst(20);
  }, flames.length * 300 + 200);
}


// ─── FLOATING HEARTS ─────────────────────────────────────────
const HEART_EMOJIS = ['❤️','💖','💗','💓','💝','💕','🧡','💛','💚','💜','💙'];

function spawnHeart() {
  const h = document.createElement('div');
  h.className = 'heart';
  h.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
  const left     = Math.random() * 100;
  const duration = Math.random() * 7 + 6;
  const delay    = Math.random() * 3;
  const size     = Math.random() * 1.2 + 0.6;
  h.style.cssText = `
    left: ${left}%;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    font-size: ${size}rem;
  `;
  document.getElementById('hearts').appendChild(h);
  setTimeout(() => h.remove(), (duration + delay) * 1000);
}

function spawnHeartsBurst(count = 10) {
  for (let i = 0; i < count; i++) {
    setTimeout(spawnHeart, i * 80);
  }
}

// Gentle continuous hearts
setInterval(spawnHeart, 1800);


// ─── TYPEWRITER EFFECT ───────────────────────────────────────
const FULL_MESSAGE = `Hello dear,

Enavea ena panra, saptiya, saptrupa nu ninaikura... Happy Birthday! 🎂

Sorry vea — un birthday eppavume ipdithanla poguthu. But I hope this birthday will be really special for you. 🌟

Inaikachu freeya iru. Mind la iruka stuff la thuki potutu be free. Nalla sapdu, be strong, be brave, be happy. 💪❤️

Yaru vanthalum ponalum — nee neya iru. You have something special in you... athu matu pogama pathuko. Poirthalum thirumba grow paniko — athutha unna unique a kattum. 🦋✨

One again, Happy Birthday Girl! 🥳🎉

                                              — Your Boy 💙`;

function typeMessage(elementId, text, speed = 28) {
  const el = document.getElementById(elementId);
  el.innerHTML = '';
  const cursor = document.createElement('span');
  cursor.className = 'cursor-blink';
  el.appendChild(cursor);

  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
    } else {
      clearInterval(interval);
      setTimeout(() => cursor.remove(), 2000);
    }
  }, speed);
}

// Start typewriter after gate unlocks (called from checkPassword success)
function startPageAnimations() {
  setTimeout(() => typeMessage('birthday-message', FULL_MESSAGE, 22), 800);
}


// ─── PHOTO UPLOAD ────────────────────────────────────────────
function previewPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img  = document.getElementById('uploaded-photo');
    const placeholder = document.getElementById('photo-placeholder');
    img.src = e.target.result;
    img.style.display = 'block';
    placeholder.style.display = 'none';
    // Celebrate photo upload
    burst(window.innerWidth / 2, 300, 60);
    spawnHeartsBurst(8);
  };
  reader.readAsDataURL(file);
}


// ─── MUSIC (Web Audio API — birthday melody) ─────────────────
let audioCtx = null;
let musicPlaying = false;
let musicNodes  = [];

function toggleMusic() {
  const btn = document.getElementById('music-btn');
  if (!musicPlaying) {
    playBirthdayMelody();
    btn.textContent = '🎶';
    btn.classList.add('playing');
    musicPlaying = true;
  } else {
    stopMusic();
    btn.textContent = '🎵';
    btn.classList.remove('playing');
    musicPlaying = false;
  }
}

function playBirthdayMelody() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  // Happy Birthday notes (frequencies in Hz, durations in seconds)
  const notes = [
    [261.6, 0.3],[261.6, 0.15],[293.7, 0.45],[261.6, 0.45],[349.2, 0.45],[330.6, 0.9],
    [261.6, 0.3],[261.6, 0.15],[293.7, 0.45],[261.6, 0.45],[392.0, 0.45],[349.2, 0.9],
    [261.6, 0.3],[261.6, 0.15],[523.3, 0.45],[440.0, 0.45],[349.2, 0.45],[330.6, 0.45],[293.7, 0.45],
    [466.2, 0.3],[466.2, 0.15],[440.0, 0.45],[349.2, 0.45],[392.0, 0.45],[349.2, 0.9],
  ];

  let time = audioCtx.currentTime + 0.1;
  notes.forEach(([freq, dur]) => {
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur - 0.05);
    osc.start(time);
    osc.stop(time + dur);
    musicNodes.push(osc);
    time += dur;
  });

  // Loop
  const totalDuration = notes.reduce((s, [, d]) => s + d, 0);
  setTimeout(() => { if (musicPlaying) { stopMusic(); playBirthdayMelody(); } }, totalDuration * 1000 + 200);
}

function stopMusic() {
  musicNodes.forEach(n => { try { n.stop(); } catch(e) {} });
  musicNodes = [];
  if (audioCtx) { audioCtx.close(); audioCtx = null; }
}
