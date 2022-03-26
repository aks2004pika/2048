const cellSize = 20;
const cellGap = 2;
const cellRepeat = 4;

export default class Grid {
  #cells;
  constructor(gridElement) {
    gridElement.style.setProperty("--cell-size-", `${cellSize}vmin`);
    gridElement.style.setProperty("--cell-gap-", `${cellGap}vmin`);
    gridElement.style.setProperty("--cell-repeat-", cellRepeat);
    this.#cells = createCellElement(gridElement).map((cellElement, index) => {
      return new Cells(
        cellElement,
        index % cellRepeat,
        Math.floor(index / cellRepeat)
      );
    });
  }

  get cells() {
    return this.#cells;
  }

  get cellsByRow() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, []);
  }

  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
  }

  get #randomCell() {
    return this.#cells.filter((cell) => cell.tile == null);
  }

  randomNewCell() {
    const randomIndex = Math.floor(Math.random() * this.#randomCell.length);
    return this.#randomCell[randomIndex];
  }
}

class Cells {
  #cellElement;
  #x;
  #y;
  #tile;
  #mergeTile;

  constructor(cellElement, x, y) {
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get tile() {
    return this.#tile;
  }

  set tile(value) {
    this.#tile = value;
    if (value == null) {
      return;
    }
    this.#tile.x = this.#x;
    this.#tile.y = this.#y;
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(value) {
    this.#mergeTile = value;
    if (value == null) {
      return;
    }
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  canAccept(tile) {
    return (
      this.tile == null ||
      (this.mergeTile == null && this.tile.value === tile.value)
    );
  }

  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return;
    this.tile.value = this.tile.value + this.mergeTile.value;
    this.mergeTile.remove();
    this.mergeTile = null;
  }
}

function createCellElement(gridElement) {
  const cells = [];
  for (var i = 0; i < cellRepeat * cellRepeat; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cells");
    cells.push(cell);
    gridElement.append(cell);
  }
  return cells;
}
