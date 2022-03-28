import Grid from "./grid.js";
import Tile from "./tile.js";

const gameBlock = document.querySelector(".gameBlock");
const grid = new Grid(gameBlock);
setupInput();

grid.randomNewCell().tile = new Tile(gameBlock);
grid.randomNewCell().tile = new Tile(gameBlock);
swipeEvents();
var startingX, startingY, movingX, movingY;

function swipeEvents() {
  gameBlock.addEventListener("touchstart", touchStart);
  gameBlock.addEventListener("touchmove", touchMove);
  gameBlock.addEventListener("touchend", touchEnd);
}

function touchStart(e) {
  startingX = e.touches[0].clientX;
  startingY = e.touches[0].clientY;
}

function touchMove(e) {
  movingX = e.touches[0].clientX;
  movingY = e.touches[0].clientY;
}

function touchEnd(e) {
  var swipeDirection;
  if (startingX + 60 < movingX) {
    swipeDirection = "right";
  } else if (startingX - 60 > movingX) {
    swipeDirection = "left";
  }

  if (startingY + 60 < movingY) {
    swipeDirection = "down";
  } else if (startingY - 60 > movingY) {
    swipeDirection = "up";
  }
  swipe(swipeDirection);
}

async function swipe(direction) {
  console.log(direction);
  switch (direction) {
    case "up":
      if (!canMoveUp()) {
        swipeEvents();
        return;
      }
      await moveUp();
      break;
    case "down":
      if (!canMoveDown()) {
        swipeEvents();
        return;
      }
      await moveDown();
      break;
    case "left":
      if (!canMoveLeft()) {
        swipeEvents();
        return;
      }
      await moveLeft();
      break;
    case "right":
      if (!canMoveRight()) {
        swipeEvents();
        return;
      }
      await moveRight();
      break;
    default:
      swipeEvents();
      return;
  }

  grid.cells.forEach((cell) => cell.mergeTiles());

  const newTile = new Tile(gameBlock);
  grid.randomNewCell().tile = newTile;

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      loseBlock();
    });
    return;
  }

  setupInput();
}

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    default:
      setupInput();
      return;
  }

  grid.cells.forEach((cell) => cell.mergeTiles());

  const newTile = new Tile(gameBlock);
  grid.randomNewCell().tile = newTile;

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      loseBlock();
    });
    return;
  }

  setupInput();
}

function moveUp() {
  return slideTiles(grid.cellsByColumn);
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function moveLeft() {
  return slideTiles(grid.cellsByRow);
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap((group) => {
      const promises = [];
      for (let i = 1; i < group.length; i++) {
        const cell = group[i];
        if (cell.tile == null) continue;
        let lastValidCell;
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j];
          if (!moveToCell.canAccept(cell.tile)) break;
          lastValidCell = moveToCell;
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition());
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile;
          } else {
            lastValidCell.tile = cell.tile;
          }
          cell.tile = null;
        }
      }
      return promises;
    })
  );
}

function canMoveUp() {
  return canMove(grid.cellsByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveLeft() {
  return canMove(grid.cellsByRow);
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}

function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
}

function rulesOpen() {
  const rulesBlock = document.querySelector(".rulesBlock");
  const rulesBtn = document.querySelector(".rulesBtn");

  const rulesOpenAnim = {
    animation: "rulesOpenAnim 0.5s ease-in-out .5s forwards",
  };

  const gameCloseAnim = {
    animation: "gameCloseAnim 0.4s ease-in-out forwards",
  };

  rulesBtn.onclick = () => {
    Object.assign(gameBlock.style, gameCloseAnim);
    Object.assign(rulesBlock.style, rulesOpenAnim);
  };
}

rulesOpen();

function loseBlock() {
  const loseBlock = document.querySelector(".loseBlock");
  const gameBlockAnim = {
    animation: "gameBlockAnim 0.5s ease-in-out .2s forwards",
  };
  const loseAnim = {
    animation: "loseAnim 0.5s ease-in-out .6s forwards",
  };

  Object.assign(gameBlock.style, gameBlockAnim);
  Object.assign(loseBlock.style, loseAnim);
}

function play() {
  const playBtn = document.querySelector(".playBtn");
  const rulesBlock = document.querySelector(".rulesBlock");

  const rulesCloseAnim = {
    animation: "rulesCloseAnim 0.4s ease-in-out forwards",
  };

  const gameOpenAnim = {
    animation: "gameOpenAnim 1s ease-in-out forwards",
  };

  playBtn.onclick = () => {
    Object.assign(rulesBlock.style, rulesCloseAnim);
    Object.assign(gameBlock.style, gameOpenAnim);
  };
}

play();
