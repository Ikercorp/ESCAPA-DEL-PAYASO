let player, gameArea;
let enemies = [];
let playerPosition = { x: 100, y: 100 };
let playerSpeed = 10;
let enemySpeed = 3;
let gameRunning = false;

document.getElementById("startButton").addEventListener("click", startGame);

function startGame() {
  // Obtener configuraciones
  const enemyCount = parseInt(document.getElementById("enemyCount").value);
  playerSpeed = parseInt(document.getElementById("playerSpeed").value);
  enemySpeed = parseInt(document.getElementById("enemySpeed").value);
  const background = document.getElementById("background").value;

  // Mostrar el área del juego
  document.getElementById("config-panel").classList.add("hidden");
  gameArea = document.getElementById("game-area");
  gameArea.classList.remove("hidden");

  // Fondo
  if (background.startsWith("http")) {
    gameArea.style.backgroundImage = `url('${background}')`;
  } else {
    gameArea.style.backgroundImage = "none";
    gameArea.style.backgroundColor = background;
  }

  // Crear jugador
  player = document.getElementById("player");
  playerPosition = { x: 100, y: 100 };
  player.style.backgroundImage = "url('amarrillo.png')";
  player.style.backgroundSize = "contain";
  player.style.backgroundRepeat = "no-repeat";
  player.style.width = "50px";
  player.style.height = "50px";
  updatePositions();

  // Crear enemigos
  enemies = [];
  for (let i = 0; i < enemyCount; i++) {
    const enemy = document.createElement("div");
    enemy.classList.add("impuesto");
    enemy.style.backgroundImage = "url('it.png')";
    enemy.style.backgroundSize = "contain";
    enemy.style.backgroundRepeat = "no-repeat";
    // Tamaño ligeramente mayor que jugador
    const size = 60;
    enemy.style.width = `${size}px`;
    enemy.style.height = `${size}px`;
    enemy.style.left = `${Math.random() * (gameArea.clientWidth - size)}px`;
    enemy.style.top = `${Math.random() * (gameArea.clientHeight - size)}px`;
    gameArea.appendChild(enemy);
    enemies.push({
      el: enemy,
      x: parseFloat(enemy.style.left),
      y: parseFloat(enemy.style.top),
    });
  }

  gameRunning = true;
  gameLoop();
}

// Movimiento jugador
window.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  switch (e.key) {
    case "ArrowUp":
      if (playerPosition.y > 0) playerPosition.y -= playerSpeed;
      break;
    case "ArrowDown":
      if (playerPosition.y < gameArea.clientHeight - 50)
        playerPosition.y += playerSpeed;
      break;
    case "ArrowLeft":
      if (playerPosition.x > 0) playerPosition.x -= playerSpeed;
      break;
    case "ArrowRight":
      if (playerPosition.x < gameArea.clientWidth - 50)
        playerPosition.x += playerSpeed;
      break;
  }
  updatePositions();
});

function moveEnemies() {
  enemies.forEach(enemy => {
    const dx = playerPosition.x - enemy.x;
    const dy = playerPosition.y - enemy.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if(dist > 0){
      enemy.x += (dx/dist)*enemySpeed;
      enemy.y += (dy/dist)*enemySpeed;
      enemy.el.style.transform = `translate(${enemy.x}px, ${enemy.y}px)`;
    }
  });
}

function updatePositions() {
  player.style.transform = `translate(${playerPosition.x}px, ${playerPosition.y}px)`;
  enemies.forEach((enemy) => {
    enemy.el.style.transform = `translate(${enemy.x}px, ${enemy.y}px)`;
  });
}

function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  for(let enemy of enemies){
    const enemyRect = enemy.el.getBoundingClientRect();
    if (
      playerRect.right > enemyRect.left &&
      playerRect.left < enemyRect.right &&
      playerRect.bottom > enemyRect.top &&
      playerRect.top < enemyRect.bottom
    ) {
      alert("💀 ¡TODOS FLOTARAN GEORGIE!");
      gameRunning = false;
      window.location.reload();
      break;
    }
  }
}

function gameLoop() {
  if (!gameRunning) return;
  moveEnemies();
  updatePositions();
  checkCollision();
  requestAnimationFrame(gameLoop);
}
