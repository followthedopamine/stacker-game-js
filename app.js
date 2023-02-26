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
 * @desc Helper function to create a container for our notifications
 * @param {Element} shell
 * @returns
 */
const createNotificationElement = (shell, debug) => {
  const notificationContainer = document.createElement("div");
  notificationContainer.classList.add("notification-container");
  const notification = document.createElement("div");
  notification.classList.add("notification");
  // const replayLink = document.createElement("a");
  const replayButton = document.createElement("a");
  replayButton.innerHTML = "Replay";
  replayButton.classList.add("replay");
  replayButton.addEventListener("click", handleReplay);
  if (debug) notification.innerHTML = "Test text";
  notificationContainer.appendChild(notification);
  notificationContainer.appendChild(replayButton);
  shell.appendChild(notificationContainer);
  return notificationContainer;
};

const toggleTutorialDisplay = (event) => {
  console.log(tutorial.style.display);
  if (tutorial.style.display == "" || tutorial.style.display == "none") {
    tutorial.style.display = "block";
  } else {
    tutorial.style.display = "none";
  }
};

const buildTutorialButton = () => {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("tutorial-btn-container");
  const button = document.createElement("button");
  button.classList.add("tutorial-btn");
  button.innerHTML = "Tutorial";
  button.addEventListener("click", toggleTutorialDisplay);
  buttonContainer.appendChild(button);
  return buttonContainer;
};

const buildTutorial = () => {
  const tutorialText = `
  Start the game and see a row of blocks moving back and forth on a conveyor belt. <br /><br />
  Press any key or click to stop the blocks at the right time and stack them on top of each other.<br /><br />
  Keep stacking the blocks to reach the top of the machine.<br /><br />
  If you miss the timing, the block will fall off the stack and the game will be over.<br /><br />
  Retry the game if you don't reach the top.<br /><br />
  Good luck and have fun playing the stacker game!`;

  const tutorial = document.createElement("div");
  tutorial.classList.add("tutorial");
  tutorial.innerHTML = tutorialText;
  return tutorial;
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

/**
 * @desc Checks if the square underneath the coordinates given is solid
 * @param {Object} grid
 * @param {[Number, Number]} Coordinates of square to check
 * @returns
 */
const isSquareValid = (grid, [row, col]) => {
  if (row === grid.height - 1) return true;
  if (grid.array[row + 1][col] === "~") return true;
  return false;
};

/**
 * @desc Checks given row for invalid squares and if found removes them
 * @param {Object} grid
 * @param {Number} row
 * @returns true if game can continue else returns false
 */
const checkRow = (grid, row) => {
  if (row === grid.height - 1) return true;
  let canContinue = false;
  for (let i = 0; i < grid.width; i++) {
    if (grid.array[row][i] === "~") {
      if (!isSquareValid(grid, [row, i])) {
        grid.array[row][i] = "";
      } else {
        canContinue = true;
      }
    }
  }
  return canContinue;
};

/**
 * @desc Displays the notification box set up in createNotificationElement with the given text
 * @param {Element} shell
 * @param {String} text The text to display in the notification
 */
const displayNotification = (shell, text) => {
  shell.firstChild.innerHTML = text;
  shell.style.display = "flex";
};

/**
 * @desc Displays a notification on win or loss
 * @param {Element} shell
 * @param {Boolean} isWon Whether the player won the game or not
 */
const endGame = (shell, isWon) => {
  if (isWon) {
    displayNotification(shell, "You won!");
  } else {
    displayNotification(shell, "You lost! :(");
  }
  click.removeEventListener("mousedown", handleClick);
  document.body.removeEventListener("keydown", handleKeyboard);
  console.log("You won");
};

/**
 * @desc Advances the game to the next row and checks if the game is over
 * @param {Object} grid
 * @param {Element} shell
 * @param {Interval} interval
 */
const nextRow = (grid, shell, interval) => {
  grid.row--;
  if (checkRow(grid, grid.row + 1)) {
    // Possible bug here
    // Game can continue
    if (grid.row === -1) {
      // Game was won
      endGame(notification, true);
      return;
    }
    const speed = grid.game[grid.row][1];
    const size = grid.game[grid.row][0];
    platformInterval = createMovingPlatform(grid, shell, speed, size);
  } else {
    // Game over
    endGame(notification, false);
    console.log("Game over");
  }
};

/**
 * @desc Clears the interval responsible for moving the platform and advances the game to the next row
 * @param {Object} grid
 * @param {Element} shell
 * @param {Interval} interval
 */
const stopPlatform = (grid, shell, interval) => {
  clearInterval(interval);
  nextRow(grid, shell, interval);
};

const handleKeyboard = (event) => {
  console.log("Test", grid.row);
  stopPlatform(grid, appContainer, platformInterval);
};

const handleClick = (event) => {
  handleKeyboard(event);
};

const handleReplay = (event) => {
  console.log("Handle replay");
  document.location.reload();
};

document.body.addEventListener("keydown", handleKeyboard);
const click = document.getElementById("click");
click.addEventListener("mousedown", handleClick);

const app = document.getElementById("app");

const notification = createNotificationElement(app, false);
const appContainer = document.createElement("div");
const tutorial = buildTutorial();
app.appendChild(tutorial);
app.appendChild(appContainer);
const grid = { width: 7, height: 11, row: 10 };
grid.array = createGrid(grid.width, grid.height);
grid.game = [
  [3, 400],
  [3, 350],
  [3, 300],
  [2, 250],
  [2, 200],
  [2, 150],
  [2, 100],
  [1, 100],
  [1, 80],
  [1, 80],
  [1, 50],
];
grid.game = grid.game.reverse();

displayGrid(grid, appContainer);
updateGrid(grid, appContainer);

let platformInterval = createMovingPlatform(grid, appContainer, 500, 3);

document.body.appendChild(buildTutorialButton());
