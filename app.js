/**
 * @desc Takes rows and cols and returns a 2d array representing a 2d rectangle
 * @param {Number} cols
 * @param {Number} rows
 * @returns {[][]}
 */
const createGrid = (cols, rows) => {
  const grid = [];
  for (let row = 0; row < rows; row++) {
    const tempRow = [];
    for (let col = 0; col < cols; col++) {
      tempRow.push([""]); // Remove this after changing ~
    }
    grid.push(tempRow);
  }
  return grid;
};

/**
 * @desc Takes a grid and appends the rows and cols to the shell
 * @param {Object} grid
 * @param {Element} shell
 */
const displayGrid = (grid, shell) => {
  const container = document.createElement("div");
  container.classList.add("container");
  const innerContainer = document.createElement("div");
  for (let row = 0; row < grid.height; row++) {
    const rowElement = document.createElement("div");
    rowElement.classList.add("row");
    for (let col = 0; col < grid.width; col++) {
      const colElement = document.createElement("span");
      colElement.classList.add("col");
      //colElement.innerHTML = grid.array[row][col];
      if (grid.array[row][col] === "~") colElement.classList.add("red");
      rowElement.appendChild(colElement);
    }
    innerContainer.appendChild(rowElement);
  }
  container.append(innerContainer);
  shell.appendChild(container);
};

/**
 * Redraws the grid
 * @param {Object} grid
 * @param {Element} shell
 */
const updateGrid = (grid, shell) => {
  shell.innerHTML = "";
  displayGrid(grid, shell);
};

/**
 * @desc Updates platformLength columns of grid from the leftCol index
 * @param {Object} grid
 * @param {Number} leftCol
 * @param {Number} platformLength
 */
const movePlatform = (grid, leftCol, platformLength) => {
  const row = grid.row;
  const rightEdge = Math.min(leftCol + platformLength, grid.width);
  for (let col = 0; col < grid.width; col++) {
    if (col >= leftCol && col < rightEdge) {
      grid.array[row][col] = "~";
    } else {
      grid.array[row][col] = "";
    }
  }
};

/**
 * @desc Creates a moving 1xsize platform that travels to the edge of the grid and then back again
 * @param {Object} grid
 * @param {Element} shell
 * @param {Number} speed Speed at which the interval ticks lower = faster platform
 * @param {Number} size Size of the platform
 * @returns The platform interval
 */
const createMovingPlatform = (grid, shell, speed, size) => {
  let pos = 0;
  let isReversing = false;
  const interval = setInterval(() => {
    if (pos === grid.width - size && isReversing === false) {
      isReversing = true;
    }
    if (pos === 0 && isReversing === true) {
      isReversing = false;
    }
    movePlatform(grid, pos, size);
    pos += isReversing ? -1 : 1;
    updateGrid(grid, shell);
  }, speed);
  return interval;
};

const stopPlatform = (interval) => {
  clearInterval(interval);
  // Change the grid to blanks if they aren't over a previous platform
};

const handleKeyboard = (event) => {
  console.log(event.key);
  stopPlatform(platformInterval);
  grid.row--;
  platformInterval = createMovingPlatform(grid, app, 400, 3);
};

document.body.addEventListener("keydown", handleKeyboard);

const app = document.getElementById("app");
const grid = { width: 7, height: 11, row: 10 };
grid.array = createGrid(grid.width, grid.height);

displayGrid(grid, app);
updateGrid(grid, app);

let platformInterval = createMovingPlatform(grid, app, 500, 3);
