
// ─── YES / MAYBE BUTTONS ─────────────────────────────────────
function sayYes() {
  const resp = document.getElementById('response-text');
  resp.textContent = '🥺💙 She said YES! Forever & always! 💙🥺';

  // Massive celebration
  burst(window.innerWidth / 2, window.innerHeight / 2, 200);
  setTimeout(() => burst(window.innerWidth * 0.2, window.innerHeight * 0.4, 100), 200);
  setTimeout(() => burst(window.innerWidth * 0.8, window.innerHeight * 0.4, 100), 400);
  spawnHeartsBurst(30);

  // Hide buttons after yes
  document.querySelector('.proposal-buttons').innerHTML =
    '<p style="font-size:2rem; animation: heartbeat 1s infinite;">💙🌟💙</p>';
}

function runAway(btn) {
  const maxX = window.innerWidth  - 160;
  const maxY = window.innerHeight - 60;
  const x    = Math.floor(Math.random() * maxX);
  const y    = Math.floor(Math.random() * maxY);
  btn.style.position = 'fixed';
  btn.style.left     = x + 'px';
  btn.style.top      = y + 'px';
  btn.style.zIndex   = '9999';
  btn.style.transition = 'left 0.2s, top 0.2s';
}
