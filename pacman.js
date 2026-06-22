//this the board
let board;
const rowCount = 21;
const colunCount = 19;
const tileSize = 32;
const boardwidth = colunCount * tileSize;
const boardHeight = rowCount * tileSize;
let context;
// images
let blueGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let redGhostImage;

let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let wallImage;

//X = wall, O = skip, P = pac man, ' ' = food
//Ghosts: b = blue, o = orange, p = pink, r = red
const maps = [
  [
    // Level 0
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XXXX X X X XXXX X",
    "X X             X X",
    "X X XXX XXX XXX X X",
    "X X               X",
    "X XXX XXXXXXX XXX X",
    "X   X       X   X X",
    "XXX X XXrXX X XXX X",
    "X      pob      X X",
    "XXX X XXXXXXX X XXX",
    "X   X       X   X X",
    "X XXX XXXXXXX XXX X",
    "X X               X",
    "X X XXX XXX XXX X X",
    "X X      P      X X",
    "X XXXX XXXXX XXXX X",
    "X                 X",
    "X XXXX X X X XXXX X",
    "X        X        X",
    "XXXXXXXXXXXXXXXXXXX",
  ],

  [
    // Level 1
    "XXXXXXXXXXXXXXXXXXX",
    "X   X        X    X",
    "X X X XXXX X X XX X",
    "X X      X     X  X",
    "X XXX X XXX XX X  X",
    "X     X     X  X  X",
    "X XXX XXXXXXX XXX X",
    "X   X       X     X",
    "X X X XXXrXXX XXX X",
    "X X     pob       X",
    "X X X XXXXXXX X XXX",
    "X   X         X   X",
    "X XXX XXXXXXX XXX X",
    "X X               X",
    "X X XXX XXX XXX X X",
    "X X      P      X X",
    "X XXXX XXXXX XXXX X",
    "X                 X",
    "X XXXX X X X XXXX X",
    "X        X        X",
    "XXXXXXXXXXXXXXXXXXX",
  ],
  [
    // level 2
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XXXX X X X XXXX X",
    "X X    X X X    X X",
    "X X XX XXX XX XXX X",
    "X                 X",
    "X XXX XXXXXXX XXX X",
    "X   X       X   X X",
    "XXX X XXrXX X XXX X",
    "X      pob      X X",
    "XXX X XXXXXXX X XXX",
    "X   X       X   X X",
    "X XXX XXXXXXX XXX X",
    "X                 X",
    "X XX XX XXX XX XX X",
    "X X      P      X X",
    "X XXXX XXXXX XXXX X",
    "X                 X",
    "X XXXX X X X XXXX X",
    "X        X        X",
    "XXXXXXXXXXXXXXXXXXX",
  ],
  [
    //level 3
    "XXXXXXXXXXXXXXXXXXX",
    "X   X         X   X",
    "X X X XXXXXXX X X X",
    "X X           X X X",
    "X XXXXX XXX XXXXX X",
    "X               X X",
    "X XXX XXXXXXX XXX X",
    "X X   X   X   X X X",
    "X X X XXrXX X X X X",
    "X   X  pob  X   X X",
    "XXX X XXXXXXX X X X",
    "X     X       X X X",
    "X XXX XXXXXXX XXX X",
    "X X               X",
    "X XXXXX XXX XXXXX X",
    "X X      P      X X",
    "X XXXXXXXXXXXXXXX X",
    "X                 X",
    "X XXXX X X X XXXX X",
    "X        X        X",
    "XXXXXXXXXXXXXXXXXXX",
  ],
  [
    //level 4
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XXXX X X X XXXX X",
    "X X   X     X   X X",
    "X X X XXXXXXX X X X",
    "X   X         X   X",
    "XXX XXXXX XXXXX XXX",
    "X       X       X X",
    "X XX XXrX XX XX X X",
    "X    pob   X      X",
    "XXX XXXXXXX XXXXX X",
    "X       X       X X",
    "X XXXXX X XXXXX X X",
    "X X             X X",
    "X X XXXXX XXXXX X X",
    "X X      P      X X",
    "X XXXXX X XXXXX X X",
    "X                 X",
    "X XXXX X X X XXXX X",
    "X        X        X",
    "XXXXXXXXXXXXXXXXXXX",
  ],
];

const walls = new Set();
const foods = new Set();
const ghosts = new Set();
let pacman;

const directions = ["U", "D", "L", "R"];
let score = 0;
let lives = 3;
let gameover = false;

// difficulty system
let difficulty = "easy";
// level system
let level = 4;

//another smart mode system that i need in 1.2
let phaseStart = Date.now();
let phase = "cooldown";

//like what is called smart Mode
let smartMode = false;

let SMART_DURATION = 5000; // mean 5 seconds
let SMART_COOLDOWN = 60000; // mean 60 seconds or 1 minute

//the random ghost that have smartMode
let smartGhostIndex = -1;

//this for buffer directions of pacman
let bufferedDirection = "null";

//the menu of tha game started
// i don't need gameStarted again but let it be for now
let gameStarted = false;
//your win
let gameWon = false;
//main  menus
let gameState = "mainMenu";

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardwidth;
  context = board.getContext("2d");

  LoadImage();
  loadMap();
  //console.log(walls.size);
  //console.log(foods.size);
  //console.log(ghosts.size);
  for (let ghost of ghosts.values()) {
    const newDirection = directions[Math.floor(Math.random() * 4)];
    ghost.updateDirection(newDirection);
  }
  update();
  document.addEventListener("keyup", movePacman);
};

function LoadImage() {
  wallImage = new Image();
  wallImage.src = "./wall.png";

  blueGhostImage = new Image();
  blueGhostImage.src = "./blueGhost.png";
  orangeGhostImage = new Image();
  orangeGhostImage.src = "./orangeGhost.png";
  pinkGhostImage = new Image();
  pinkGhostImage.src = "./pinkGhost.png";
  redGhostImage = new Image();
  redGhostImage.src = "./redGhost.png";

  pacmanUpImage = new Image();
  pacmanUpImage.src = "./pacmanUp.png";
  pacmanDownImage = new Image();
  pacmanDownImage.src = "./pacmanDown.png";
  pacmanLeftImage = new Image();
  pacmanLeftImage.src = "./pacmanLeft.png";
  pacmanRightImage = new Image();
  pacmanRightImage.src = "./pacmanRight.png";
}

function getGhostCount() {
  if (difficulty === "easy") return 1;
  if (difficulty === "normal") return 2;
  if (difficulty === "hard") return 3;
  if (difficulty === "impossible") return 4;

  return 2;
}

function loadMap() {
  walls.clear();
  foods.clear();
  ghosts.clear();

  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < colunCount; c++) {
      const row = maps[level][r];
      const tileMapChar = row[c];

      const x = c * tileSize;
      const y = r * tileSize;

      if (tileMapChar == "X") {
        const wall = new Block(wallImage, x, y, tileSize, tileSize);
        walls.add(wall);
      } else if (tileMapChar == "b") {
        const ghost = new Block(blueGhostImage, x, y, tileSize, tileSize);
        ghosts.add(ghost);
      } else if (tileMapChar == "o") {
        const ghost = new Block(orangeGhostImage, x, y, tileSize, tileSize);
        ghosts.add(ghost);
      } else if (tileMapChar == "p") {
        const ghost = new Block(pinkGhostImage, x, y, tileSize, tileSize);
        ghosts.add(ghost);
      } else if (tileMapChar == "r") {
        const ghost = new Block(redGhostImage, x, y, tileSize, tileSize);
        ghosts.add(ghost);
      } else if (tileMapChar == "P") {
        pacman = new Block(pacmanRightImage, x, y, tileSize, tileSize);
      } else if (tileMapChar == " ") {
        const food = new Block(null, x + 14, y + 14, 4, 4);
        foods.add(food);
      }
    }
  }

  const ghostLimit = getGhostCount();

  while (ghosts.size > ghostLimit) {
    const ghostToRemove = ghosts.values().next().value;
    ghosts.delete(ghostToRemove);
  }
}

function update() {
  //console.log("update running");
  if (gameover) {
    return;
  }
  if (gameState === "paused") {
    draw();
    setTimeout(update, 50);
    return;
  }

  if (gameState === "playing") {
    move();
  }
  draw();
  setTimeout(update, 50);
}
function draw() {
  //state mainMenu
  if (gameState === "mainMenu") {
    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = "#0B1D3A";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "white";
    context.font = "30px sans-serif";
    context.fillText("PAC-MAN", 220, 100);

    context.font = "24px sans-serif";
    context.fillText("1: Play", 240, 220);
    context.fillText("2: Settings", 240, 280);
    context.fillText("3: Feedback", 240, 340);

    return;
  }
  if (gameState === "Settings") {
    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = "#102A43";
    context.fillRect(0, 0, board.width, board.height);
    context.fillStyle = "white";
    context.font = "30px sans-serif";
    context.fillText("SETTINGS", 220, 100);

    context.font = "20px sans-serif";
    context.fillText("Sound:coming soon", 180, 220);
    context.fillText("Language: Coming Soon", 180, 260);
    context.fillText("Press B to go back", 180, 340);
    return;
  }
  //feedback menu

  if (gameState === "Feedback") {
    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = "#1E5AA8";
    context.fillRect(0, 0, board.width, board.height);
    context.fillStyle = "white";
    context.font = "30px sans-serif";
    context.fillText("FEEDBACK", 220, 100);

    context.font = "20px sans-serif";
    context.fillText("Thank you for playing!", 160, 220);
    context.fillText("Press B to go back", 180, 320);
    return;
  }

  //pause menu
  if (gameState === "paused") {
    context.fillStyle = "white";
    context.font = "40px sans-serif";
    context.fillText("PAUSED", 200, 300);

    context.font = "20px sans-serif";
    context.fillText("Press P to Resume", 180, 340);

    return;
  }

  // this part for modes menu of the game
  if (gameState === "difficultyMenu") {
    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = "#123D7A";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "white";
    context.font = "24px sans-serif";

    context.fillText("PAC-MAN", 170, 120);

    context.font = "22px sans-serif";

    context.fillText("Press 1 = Easy", 240, 220);
    context.fillText("Press 2 = Normal", 240, 270);
    context.fillText("Press 3 = Hard", 240, 320);
    context.fillText("Press 4 = Impossible", 240, 370);
    context.fillText("Press B  = Back", 240, 430);

    return;
  }
  // this part for ghosts and pacman
  context.clearRect(0, 0, board.width, board.height);
  context.drawImage(
    pacman.image,
    pacman.x,
    pacman.y,
    pacman.width,
    pacman.height
  );
  for (let ghost of ghosts.values()) {
    context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
  }
  for (let wall of walls.values()) {
    context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
  }
  context.fillStyle = "white";
  for (let food of foods.values()) {
    context.fillRect(food.x, food.y, food.width, food.height);
  }

  //score
  context.fillStyle = "white";
  context.font = "14px sans-serif";
  if (gameover) {
    //background panel
    context.fillStyle = "rgba(0 , 0, 0, 0.05)";
    context.fillRect(100, 150, 400, 300);

    //whitte lettres
    context.fillStyle = "white";

    context.font = "32px sans-serif";
    context.fillText("GAME OVER: ", 180, 220);

    context.font = "20px sans-serif";
    context.fillText("Score:" + score, 220, 270);

    context.fillText("Level Reached: " + (level + 1), 180, 320);
    context.fillText("Diffuculty: " + difficulty, 190, 350);
    context.fillText("Press Any Key To Restart", 120, 400);

    return;
  } else {
    context.fillText(
      "❤️" +
        lives +
        "   " +
        "   🍒  " +
        score +
        "   " +
        "   🗺️ " +
        level +
        "   " +
        ":   🎮 " +
        difficulty,
      tileSize / 2,
      tileSize / 2
    );
  }
  // restart menu and the winning menu and final score
  if (gameWon) {
    1;
    context.fillStyle = "white";
    context.font = "28px sans-serif";

    context.fillText("You Win!", 220, 250);

    context.font = "18px sans-serif";

    context.fillText("Final Score: " + score, 220, 300);
    context.fillText("Press any key to restart", 100, 350);
    return;
  }
}
function move() {
  if (gameWon) {
    return;
  }
  const now = Date.now();
  const elapsed = now - phaseStart;

  // ghost start smart mode after cooldown
  if (phase === "cooldown" && elapsed >= SMART_COOLDOWN) {
    phase = "smart";
    smartMode = true;
    phaseStart = now;

    smartGhostIndex = Math.floor(Math.random() * ghosts.size);
  }

  //ghosts stop being smart mode after duration and be normal again
  else if (phase === "smart" && elapsed >= SMART_DURATION) {
    phase = "cooldown";
    smartMode = false;
    phaseStart = now;
    smartGhostIndex = -1;
  }
  // this only to see if the function work or not

  //console.log("pahese:", phase, "smartMode:", smartMode);

  // buffer the movement about pacman
  if (
    bufferedDirection !== null &&
    pacman.x % tileSize == 0 &&
    pacman.y % tileSize == 0
  ) {
    pacman.updateDirection(bufferedDirection);
    //this get take it away from function pacmanMove(e)
    if (pacman.direction == "U") {
      pacman.image = pacmanUpImage;
    } else if (pacman.direction == "D") {
      pacman.image = pacmanDownImage;
    } else if (pacman.direction == "L") {
      pacman.image = pacmanLeftImage;
    } else if (pacman.direction == "R") {
      pacman.image = pacmanRightImage;
    }
  }

  // pacman rules moves
  pacman.x += pacman.velocityX;
  pacman.y += pacman.velocityY;

  let ghostArray = Array.from(ghosts);
  for (let i = 0; i < ghostArray.length; i++) {
    let ghost = ghostArray[i];

    if (ghost.x % tileSize == 0 && ghost.y % tileSize == 0) {
      const possibleDirections = getPossibleDirections(ghost);
      if (possibleDirections.length > 0) {
        let newDirection;
        //now only the smart ghost shase pacman
        if (smartMode && i === smartGhostIndex) {
          newDirection = chooseBestDirection(ghost, pacman, possibleDirections);
        } else {
          newDirection =
            possibleDirections[
              Math.floor(Math.random() * possibleDirections.length)
            ];
        }
        ghost.updateDirection(newDirection);
      }
    }
  }

  for (let wall of walls.values()) {
    if (collision(pacman, wall)) {
      pacman.x -= pacman.velocityX;
      pacman.y -= pacman.velocityY;
      break;
    }
  }
  for (let ghost of ghosts.values()) {
    if (collision(ghost, pacman)) {
      lives -= 1;
      if (lives == 0) {
        gameover = true;
        return;
      }
      resetPosition();
    }

    if (
      ghost.y == tileSize * 9 &&
      ghost.direction != "U" &&
      ghost.direction != "D"
    ) {
      ghost.updateDirection("U");
    }
    ghost.x += ghost.velocityX;
    ghost.y += ghost.velocityY;

    for (let wall of walls.values()) {
      if (
        collision(ghost, wall) ||
        ghost.x <= 0 ||
        ghost.x + ghost.width >= boardwidth
      ) {
        ghost.x -= ghost.velocityX;
        ghost.y -= ghost.velocityY;
        const newDirection = directions[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDirection);
      }
    }
  }

  //check food colision
  let foodEaten = null;
  for (let food of foods.values()) {
    if (collision(pacman, food)) {
      foodEaten = food;
      score += 10;
      break;
    }
  }
  if (foodEaten != null) {
    foods.delete(foodEaten);
  }

  //reset level
  if (foods.size == 0) {
    level++;
    if (level >= maps.length) {
      gameWon = true;
      // restart the game
      return;
    }
    loadMap();
    resetPosition();
  }
}
function movePacman(e) {
  //return button
  if (gameState === "Settings" || gameState === "Feedback") {
    if (e.code === "KeyB") {
      gameState = "mainMenu";
    }
    return;
  }
  //console.log("KEY PRESSED:", e.code);
  if (e.code === "KeyP") {
    if (gameState === "playing") {
      gameState = "paused";
    } else if (gameState === "paused") {
      gameState = "playing";
    }
  }
  // this look fine
  if (gameState === "mainMenu") {
    if (e.code === "Digit1" || e.code === "Numpad1") {
      gameState = "difficultyMenu";
    } else if (e.code === "Digit2" || e.code === "Numpad2") {
      //if i put setting instead of Setting the game won't work
      gameState = "Settings";
    } else if (e.code === "Digit3" || e.code === "Numpad3") {
      //if i put feedback instead of Feedback the game won't work
      gameState = "Feedback";
    }
    return;
  }
  if (gameState === "difficultyMenu") {
    // i have no idea why but if i put this in return botton part the game can't work
    if (e.code === "KeyB") {
      gameState = "mainMenu";
      return;
    }
    // the diffculty modes

    if (e.code === "Digit1" || e.code === "Numpad1") {
      difficulty = "easy";
    } else if (e.code === "Digit2" || e.code === "Numpad2") {
      difficulty = "normal";
    } else if (e.code === "Digit3" || e.code === "Numpad3") {
      difficulty = "hard";
    } else if (e.code === "Digit4" || e.code === "Numpad4") {
      difficulty = "impossible";
    } else {
      return;
    }

    gameState = "playing";

    loadMap();
    resetPosition();
    return;
  }

  //test
  //console.log("Difficulty:", difficulty);
  console.log("Game State:", gameState);

  if (gameover) {
    loadMap();
    resetPosition();
    lives = 3;
    score = 0;
    gameover = false;
    level = 0;

    lastSmartModeTime = Date.now();
    smartMode = false;

    update();
    return;
  }
  if (e.code == "ArrowUp" || e.code == "KeyW") {
    bufferedDirection = "U";
  } else if (e.code == "ArrowDown" || e.code == "KeyS") {
    bufferedDirection = "D";
  } else if (e.code == "ArrowLeft" || e.code == "KeyA") {
    bufferedDirection = "L";
  } else if (e.code == "ArrowRight" || e.code == "KeyD") {
    bufferedDirection = "R";
  }
  // this about restart menu
  if (gameWon) {
    gameWon = false;
    level = 0;
    score = 0;
    lives = 3;
    loadMap();
    resetPosition();
  }
  return;
}
function resetPosition() {
  pacman.reset();
  pacman.velocityX = 0;
  pacman.velocityY = 0;
  for (let ghost of ghosts.values()) {
    ghost.reset();
    const newDirection = directions[Math.floor(Math.random() * 4)];
    ghost.updateDirection(newDirection);
  }
}
function collision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// detect an intersection and help ghosts change there direction mid game
function getPossibleDirections(ghost) {
  let possibleDirections = [];

  const tests = [
    { dir: "U", x: ghost.x, y: ghost.y - tileSize },
    { dir: "D", x: ghost.x, y: ghost.y + tileSize },
    { dir: "L", x: ghost.x - tileSize, y: ghost.y },
    { dir: "R", x: ghost.x + tileSize, y: ghost.y },
  ];

  for (let test of tests) {
    let blocked = false;

    for (let wall of walls.values()) {
      if (
        test.x < wall.x + wall.width &&
        test.x + ghost.width > wall.x &&
        test.y < wall.y + wall.height &&
        test.y + ghost.height > wall.y
      ) {
        blocked = true;
        break;
      }
    }
    if (!blocked) {
      possibleDirections.push(test.dir);
    }
  }
  return possibleDirections;
}
//the function that i need to make the ghosts chase the pacman
function distance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}
function chooseBestDirection(ghost, pacman, possibleDirections) {
  let bestDir = null;
  let bestScore = Infinity;

  for (let dir of possibleDirections) {
    let nextX = ghost.x;
    let nextY = ghost.y;

    if (dir === "U") nextY -= tileSize;
    if (dir === "D") nextY += tileSize;
    if (dir === "L") nextX -= tileSize;
    if (dir === "R") nextX += tileSize;
    let score = distance(nextX, nextY, pacman.x, pacman.y);

    if (score < bestScore) {
      bestScore = score;
      bestDir = dir;
    }
  }
  return bestDir;
}

class Block {
  constructor(image, x, y, width, height) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.startX = x;
    this.startY = y;

    this.direction = "R";

    this.velocityX = 0;
    this.velocityY = 0;
  }
  updateDirection(direction) {
    const prevDirection = this.direction;
    this.direction = direction;
    this.updateVelocity();
    this.x += this.velocityX;
    this.y += this.velocityY;

    for (let wall of walls.values()) {
      if (collision(this, wall)) {
        this.x -= this.velocityX;
        this.y -= this.velocityY;
        this.direction = prevDirection;
        this.updateVelocity();
        return;
      }
    }
  }

  updateVelocity() {
    if (this.direction == "U") {
      this.velocityX = 0;
      this.velocityY = -tileSize / 4;
    } else if (this.direction == "D") {
      this.velocityX = 0;
      this.velocityY = tileSize / 4;
    } else if (this.direction == "L") {
      this.velocityX = -tileSize / 4;
      this.velocityY = 0;
    } else if (this.direction == "R") {
      this.velocityX = tileSize / 4;
      this.velocityY = 0;
    }
  }

  reset() {
    this.x = this.startX;
    this.y = this.startY;
  }
}

// note of fixing a future bugs:

//- Rare restart-speed bug: not done yet
// May occur when a key is pressed at the exact moment of Game Over.
// Possible cause: multiple update loops or input during restart.
//- the movement pf ghosts is so annoying : not done yet
// either fix or make the game easier
