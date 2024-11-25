let headx = 5;
let headY = 5;
let score = 0;
let foodx;
let foodY;
let direction = "right";
let nextdirection = direction;
let tails = [
  { x: 2, y: 5 },
  { x: 3, y: 5 },
  { x: 4, y: 5 },
];
let IntervalId = null;

const config = {
  size: 20,
  width: 30,
  height: 20,
};

const boardEl = document.getElementById("background");
boardEl.style.width = config.width * config.size + "px";
boardEl.style.height = config.height * config.size + "px";

function goUp() {
  headY = (headY - 1 + config.height) % config.height;
}

function goDown() {
  headY = (headY + 1) % config.height;
}

function goLeft() {
  headx = (headx - 1 + config.width) % config.width;
}

function goRight() {
  headx = (headx + 1) % config.width;
}

function changedirection(newdirection) {
  if (
    (direction === "up" && newdirection !== "down") ||
    (direction === "down" && newdirection !== "up") ||
    (direction === "left" && newdirection !== "right") ||
    (direction === "right" && newdirection !== "left")
  ) {
    nextdirection = newdirection;
  }
}

function start() {
  reset();
  if (!IntervalId) {
    IntervalId = setInterval(gameLoop, 200);
  }
  document.getElementById("game-over").style.display = "none";
}

function generateFood() {
  do {
    foodx = Math.floor(Math.random() * config.width);
    foodY = Math.floor(Math.random() * config.height);
  } while (isFoodOnSnake(foodx, foodY));
}

function isFoodOnSnake(x, y) {
  for (let i = 0; i < tails.length; i++) {
    if (tails[i].x === x && tails[i].y === y) {
      return true;
    }
  }
  return false;
}

function reset() {
  headx = 5;
  headY = 5;
  direction = "right";
  nextdirection = direction;
  tails = [
    { x: 2, y: 5 },
    { x: 3, y: 5 },
    { x: 4, y: 5 },
  ];
  score = 0;
  generateFood();
  document.getElementById("score").innerText = "Score: " + score;
}

function restart() {
  reset();
  start();
}

function pause() {
  clearInterval(IntervalId);
  IntervalId = null;
}

function gameLoop() {
  switch (nextdirection) {
    case "up":
      goUp();
      break;
    case "down":
      goDown();
      break;
    case "left":
      goLeft();
      break;
    case "right":
      goRight();
      break;
  }

  tails.push({ x: headx, y: headY });
  tails.shift();

  // Check collision with the tail
  for (let i = 0; i < tails.length - 1; i++) {
    if (headx === tails[i].x && headY === tails[i].y) {
      gameOver();
      return;
    }
  }

  // Check collision with the food
  if (headx === foodx && headY === foodY) {
    tails.push({ x: headx, y: headY });
    generateFood();
    score += 1;
    document.getElementById("score").innerText = "Score: " + score;
  }

  direction = nextdirection;
  render();
}

function gameOver() {
  clearInterval(IntervalId);
  IntervalId = null;
  document.getElementById("game-over").style.display = "block";
}

function Keydown(event) {
  const key = event.key;
  switch (key) {
    case "ArrowUp":
      changedirection("up");
      break;
    case "ArrowDown":
      changedirection("down");
      break;
    case "ArrowLeft":
      changedirection("left");
      break;
    case "ArrowRight":
      changedirection("right");
      break;
  }
}

document.addEventListener("keydown", Keydown);

function render() {
  let tailsHtml = "";
  let foodHtml = `<div class="food" style="width: ${config.size}px; height: ${
    config.size
  }px; top: ${foodY * config.size}px; left: ${foodx * config.size}px"></div>`;

  for (let i = 0; i < tails.length; i++) {
    tailsHtml += `<div class="snake" style="width: ${config.size}px; height: ${
      config.size
    }px; top: ${tails[i].y * config.size}px; left: ${
      tails[i].x * config.size
    }px"></div>`;
  }

  boardEl.innerHTML = `${foodHtml} ${tailsHtml}`;
}

render();
