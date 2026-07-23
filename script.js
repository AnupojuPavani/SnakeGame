// ===============================
// SNAKE GAME - PART 1
// ===============================

// Board
const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score");

// Create Board
for (let i = 0; i < 400; i++) {
  const cell = document.createElement("div");
  board.appendChild(cell);
}

const cells = document.querySelectorAll("#game-board div");

// Snake
let snake = [42, 41, 40];

// Direction
let direction = 1;

// Score
let score = 0;

// High Score
let highScore = Number(localStorage.getItem("highScore")) || 0;
highScoreDisplay.textContent = highScore;

// Speed
let speed = 300;

// Pause
let paused = false;

// Game Variable
let game;

// Sounds
const eatSound = new Audio("eat.mp3");
const gameOverSound = new Audio("gameover.mp3");

// Apple
let food = randomFood();

// Random Apple
function randomFood() {
  let position;

  do {
    position = Math.floor(Math.random() * 400);
  } while (snake.includes(position));

  return position;
}

// Draw Snake
function drawSnake() {
  snake.forEach((index, i) => {
    cells[index].style.background = i === 0 ? "#008000" : "lime";

    cells[index].style.borderRadius = "6px";
    cells[index].style.boxShadow = "0 0 5px lime";
  });
}

// Clear Snake
function clearSnake() {
  snake.forEach((index) => {
    cells[index].style.background = "";
    cells[index].style.borderRadius = "";
    cells[index].style.boxShadow = "";
  });
}

// Draw Apple
function drawFood() {
  cells[food].style.background = "red";
  cells[food].style.borderRadius = "50%";
  cells[food].style.boxShadow = "0 0 10px red";
}

// Game Over
function gameOver() {
  clearInterval(game);

  gameOverSound.play().catch(() => {});

  setTimeout(() => {
    alert("💀 Game Over!\n\nScore : " + score);
  }, 100);
}
// ===============================
// SNAKE GAME - PART 2
// ===============================

// Move Snake
function moveSnake() {
  clearSnake();

  // Clear Old Apple
  cells[food].style.background = "";
  cells[food].style.borderRadius = "";
  cells[food].style.boxShadow = "";

  let head = snake[0] + direction;

  // Wall Collision
  if (
    head < 0 ||
    head >= 400 ||
    (direction === 1 && snake[0] % 20 === 19) ||
    (direction === -1 && snake[0] % 20 === 0)
  ) {
    gameOver();
    return;
  }

  // Body Collision
  if (snake.includes(head)) {
    gameOver();
    return;
  }

  // Move Snake
  snake.unshift(head);

  // Apple Eat
  if (head === food) {
    score++;
    scoreDisplay.textContent = score;

    eatSound.play().catch(() => {});

    // High Score
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreDisplay.textContent = highScore;
    }

    // New Apple
    food = randomFood();

    // Increase Speed
    if (speed > 80) {
      speed -= 10;
      clearInterval(game);
      game = setInterval(moveSnake, speed);
    }
  } else {
    snake.pop();
  }

  drawSnake();
  drawFood();
}

// ===============================
// KEYBOARD CONTROLS
// ===============================

document.body.tabIndex = 0;

window.onload = function () {
  document.body.focus();
};

document.addEventListener("keydown", function (e) {
  e.preventDefault();

  switch (e.key) {
    case "ArrowUp":
      if (direction !== 20) direction = -20;
      break;

    case "ArrowDown":
      if (direction !== -20) direction = 20;
      break;

    case "ArrowLeft":
      if (direction !== 1) direction = -1;
      break;

    case "ArrowRight":
      if (direction !== -1) direction = 1;
      break;

    case " ":
      if (!paused) {
        clearInterval(game);
        paused = true;
      } else {
        game = setInterval(moveSnake, speed);
        paused = false;
      }
      break;
  }
});

// ===============================
// MOBILE SWIPE CONTROLS
// ===============================

let startX = 0;
let startY = 0;

board.addEventListener("touchstart", function (e) {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

board.addEventListener("touchend", function (e) {
  let endX = e.changedTouches[0].clientX;
  let endY = e.changedTouches[0].clientY;

  let dx = endX - startX;
  let dy = endY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30 && direction !== -1) {
      direction = 1;
    }

    if (dx < -30 && direction !== 1) {
      direction = -1;
    }
  } else {
    if (dy > 30 && direction !== -20) {
      direction = 20;
    }

    if (dy < -30 && direction !== 20) {
      direction = -20;
    }
  }
});

// ===============================
// RESTART
// ===============================

document.getElementById("restart").addEventListener("click", function () {
  location.reload();
});

// ===============================
// START GAME
// ===============================

drawSnake();
drawFood();

game = setInterval(moveSnake, speed);
