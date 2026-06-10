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
const tileMap = [
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
];

const walls = new Set();
const foods = new Set();
const ghosts = new Set();
let pacman;

const directions = ["U", "D", "L", "R"];
let score = 0;
let lives = 3;
let gameover = false;

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
function loadMap() {
  walls.clear();
  foods.clear();
  ghosts.clear();

  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < colunCount; c++) {
      const row = tileMap[r];
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
}

function update() {
  if (gameover) {
    return;
  }
  move();
  draw();
  setTimeout(update, 50);
}
function draw() {
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
    context.fillText("game Over: " + String(score), tileSize / 2, tileSize / 2);
  } else {
    context.fillText(
      "x" + String(lives) + " " + String(score),
      tileSize / 2,
      tileSize / 2
    );
  }
}
function move() {
  for (let ghost of ghosts.values()) {
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;
    if ( ghost.x % tileSize ==  0 && ghost.y % tileSize == 0) {
      const possibleDirections =  getPossibleDirections(ghost);
      if (possibleDirections.length >= 3) {
        if (Math.random() < 0.5) {
          const newDirection = possibleDirections[Math.floor (Math.random() * possibleDirections.length)];
          ghost.updateDirection(newDirection);
        }
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
    loadMap();
    resetPosition();
  }
}
function movePacman(e) {
  if (gameover) {
    loadMap();
    resetPosition();
    lives = 3;
    score = 0;
    gameover = false;
    update();
    return;
  }
  if (e.code == "ArrowUp" || e.code == "KeyW") {
    pacman.updateDirection("U");
  } else if (e.code == "ArrowDown" || e.code == "KeyS") {
    pacman.updateDirection("D");
  } else if (e.code == "ArrowLeft" || e.code == "KeyA") {
    pacman.updateDirection("L");
  } else if (e.code == "ArrowRight" || e.code == "KeyD") {
    pacman.updateDirection("R");
  }

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
  let possibleDirections =[]

  const tests = [
    {dir:"U", x: ghost.x, y: ghost.y - tileSize},
    {dir:"D", x: ghost.x, y: ghost.y + tileSize},
    {dir:"L", x: ghost.x - tileSize , y: ghost.y},
    {dir:"R", x: ghost.x + tileSize, y: ghost.y}
  ]

  for (let test of tests) {
    let blocked = false;

    for (let wall of walls.values()) {
      if (
        test.x < wall.x + wall.width &&
        test.x + ghost.width > wall.x &&
        test.y < wall.y + wall.height &&
        test.y + ghost.height > wall.y
        ){
          blocked = true;
          break
        }
    }
    if (!blocked) {
      possibleDirections.push(test.dir);
      
    }
    
  }
  return possibleDirections; 
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
