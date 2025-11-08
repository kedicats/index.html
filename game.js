const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Oyun öğeleri
let player = {
  x: 100,
  y: canvas.height / 2,
  width: 40,
  height: 40,
  speed: 5,
  dx: 0,
  dy: 0,
};

let bullets = [];
let walls = [
  { x: 400, y: 200, width: 200, height: 30, color: '#888' },
  { x: 600, y: 350, width: 100, height: 30, color: '#666' }
];

let keys = {};

// Tuş olayları
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// Mouse tıklama: ateş etcanvas.addEventListener('click', (e) => {
  let rect = canvas.getBoundingClientRect();
  let mouseX = e.clientX - rect.left;
  let mouseY = e.clientY - rect.top;

  // Oyuncunun merkez noktası
  let centerX = player.x + player.width / 2;
  let centerY = player.y + player.height / 2;

  // Merminin hareket yönü
  let angle = Math.atan2(mouseY - centerY, mouseX - centerX);
  let speed = 10;

  bullets.push({
    x: centerX,
    y: centerY,
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed,
    width: 8,
    height: 8,
    color: 'red'
  });
});

// Oyuncu hareketi
function movePlayer() {
  player.dx = 0;
  player.dy = 0;

  if (keys['ArrowUp'] || keys['w']) player.dy = -player.speed;
  if (keys['ArrowDown'] || keys['s']) player.dy = player.speed;
  if (keys['ArrowLeft'] || keys['a']) player.dx = -player.speed;
  if (keys['ArrowRight'] || keys['d']) player.dx = player.speed;

  player.x += player.dx;
  player.y += player.dy;

  // Ekran sınır kontrolü
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

// Mermilerin hareketi ve çarpışma kontrolü
function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.x += b.dx;
    b.y += b.dy;

    // Çarpışma: duvarlara vurursa yok olur
    let hitWall = false;
    for (let j = 0; j < walls.length; j++) {
      if (b.x < walls[j].x + walls[j].width &&
          b.x + b.width > walls[j].x &&
          b.y < walls[j].y + walls[j].height &&
          b.y + b.height > walls[j].y) {
        hitWall = true;
        break;
      }
    }

    // Sınırların dışına çıksa veya duvara çarptıysa
    if (hitWall || b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
      bullets.splice(i, 1);
    }
  }
}

// Duvar çizimi
function drawWalls() {
  walls.forEach(w => {
    ctx.fillStyle = w.color;
    ctx.fillRect(w.x, w.y, w.width, w.height);
  });
}

// Oyuncu çizimi
function drawPlayer() {
  ctx.fillStyle = '#00f';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Mermi çizimi
function drawBullets() {
  bullets.forEach(b => {
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.width, b.height);
  });
}

// Ana oyun döngüsü
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  updateBullets();

  drawWalls();
  drawPlayer();
  drawBullets();

  requestAnimationFrame(gameLoop);
}

gameLoop();
