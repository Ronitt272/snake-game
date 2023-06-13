let canvas = document.getElementById("ground");
let nobutton = document.getElementById("nobutton");
let yesbutton = document.getElementById("yesbutton");
let gameOverModal = new bootstrap.Modal(document.getElementById('gameOverModal'), {});
nobutton.addEventListener("click",()=>{
    gameOverModal.hide();
    
})

yesbutton.addEventListener("click",()=>{
    gameOverModal.hide();
    init();

})
//gameOverModal.modal('hide');
let pen = canvas.getContext("2d");
let score = document.getElementById("score");
let w = canvas.width;
let h = canvas.height;
let snake, gameOver, sugar;
class Food {
  constructor(x, y, color, cellSize) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.cellSize = cellSize;
    this.food_img = new Image();
    this.food_img.src = "./assets/apple.png";
  }
  drawFood() {
    pen.fillStyle = this.color;
    pen.drawImage(
      this.food_img,
      this.x * this.cellSize,
      this.y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }
}
class Snake {
  constructor(color) {
    this.len = 5;
    this.cellSize = canvas.width/25;
    this.color = color;
    this.direction = "right";
  }
  createSnake() {
    this.cells = [];
    for (let i = this.len; i > 0; i--) {
      this.cells.push({ x: i, y: 0 });
    }
  }
  generateRandomFood() {
    let x = Math.round(Math.random() * ((w - this.cellSize) / this.cellSize));
    let y = Math.round(Math.random() * ((h - this.cellSize) / this.cellSize));
    if (this.collison_with_snake(x, y)) this.generateRandomFood();
    else {
      sugar = new Food(x, y, "Red", this.cellSize);
      sugar.drawFood();
    }
  }
  drawSnake() {
    pen.fillStyle = this.color;
   
    for (let i = 0; i < this.len; i++) {
        let img = new Image();
        if(i==0){
            img = new Image();
            img.src = `./Graphics/head_${this.direction}.png`;
        }
        else if(i==this.len-1){
            let movingDirection = this.getMovingDirection(
              this.cells[i-1].x, this.cells[i-1].y,  
              this.cells[i].x, this.cells[i].y   
            );

            if(movingDirection.horizontal_direction == undefined){
                img.src = `./Graphics/tail_${movingDirection.vertical_direction == "top" ? "down" : "up"}.png`;
            }
            else{
                img.src = `./Graphics/tail_${movingDirection.horizontal_direction == "right"?"left":"right"}.png`;
            }

        }

        else{
           /* let movingDirection = this.getMovingDirection(
                this.cells[i].x, this.cells[i].y,
                this.cells[i-1].x,this.cells[i-1].y
            );

            if(movingDirection.horizontal_direction == undefined)
            {
                img.src = `./Graphics/body_vertical.png`;
            }

            else{
                img.src = `./Graphics/body_horizontal.png`;
            }

            let next_cell_direction = {};
            Object.assign(next_cell_direction,movingDirection);
            let previous_cell_direction = this.getMovingDirection(
                this.cells[i].x, this.cells[i].y,
                this.cells[i+1].x,this.cells[i+1].y
            );
            */

        let d = this.getMovingDirection(this.cells[i-1].x, this.cells[i-1].y, this.cells[i].x, this.cells[i].y);
        //console.log(this.horizontal_direction)
        //console.log(this.vertical_direction)

        img.src = "./Graphics/body_";
        let newD = this.getMovingDirection(this.cells[i-1].x, this.cells[i-1].y, this.cells[i+1].x, this.cells[i+1].y);
        console.log(d, newD)
        if(d.vertical_direction === undefined && newD.vertical_direction === undefined){
          img.src+= "horizontal";
        }
        else if(d.horizontal_direction === undefined && newD.horizontal_direction === undefined){
          img.src += "vertical";
        }
        else if(d.horizontal_direction === undefined && newD.horizontal_direction !== undefined){
          img.src += d.vertical_direction+(newD.horizontal_direction == "right" ? "left" : "right");
        }
        else{
          img.src += (newD.vertical_direction == "bottom" ? "top": "bottom") + d.horizontal_direction;
        }
        img.src+=".png";

        }
         
        pen.drawImage(
            img,
            this.cells[i].x*this.cellSize,
            this.cells[i].y*this.cellSize,
            this.cellSize,
            this.cellSize
            );
        }
  }

  getMovingDirection(x1,y1,x,y){
    let horizontal_direction;
    let vertical_direction;
    if(x1 - x > 0) horizontal_direction = "right";
    else if(x1 - x < 0) horizontal_direction = "left";
    if(y1 - y > 0) vertical_direction = "bottom";
    else if(y1 - y < 0) vertical_direction = "top";

    return {
        horizontal_direction : horizontal_direction,
        vertical_direction : vertical_direction
    };
  }
  collison_with_snake(X, Y) {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].x == X && this.cells[i].y == Y) return true;
    }
    return false;
  }
  foodEaten(newx, newy) {
    if (newx == sugar.x && newy == sugar.y) return true;
    return false;
  }
  updateSnake() {
    let headx = this.cells[0].x;
    let heady = this.cells[0].y;
    let newx = headx;
    let newy = heady;
    console.log(this.direction);
    if (this.direction == "left") newx = headx - 1;
    else if (this.direction == "right") newx = headx + 1;
    else if (this.direction == "up") newy = heady - 1;
    else newy = heady + 1;
    if (this.foodEaten(newx, newy)) {
      this.generateRandomFood();
      this.len++;
    } else this.cells.pop();

    if (this.collison_with_snake(newx, newy)) gameOver = true;
    this.cells.unshift({ x: newx, y: newy });
    let lastx = w / this.cellSize;
    let lasty = h / this.cellSize;
    if (newx < 0 || newx >= lastx) gameOver = true;
    if (newy < 0 || newy >= lasty) gameOver = true;
  }
}

function changeDirection(e) {
  if (e.key == "ArrowRight") {
    if (snake.direction != "left") snake.direction = "right";
  } else if (e.key == "ArrowLeft") {
    if (snake.direction != "right") snake.direction = "left";
  } else if (e.key == "ArrowUp") {
    if (snake.direction != "down") snake.direction = "up";
  } else if (e.key == "ArrowDown") {
    if (snake.direction != "up") snake.direction = "down";
  }
}
//initi plays the role of initialising the whole game
function init() {
  snake = new Snake("blue");
  snake.createSnake();
  snake.generateRandomFood();
  gameOver = false;
  score.textContent = snake.len - 5;
  document.addEventListener("keydown", changeDirection);
  startAnimating(10);
}
function draw() {
  pen.clearRect(0, 0, w, h);
  sugar.drawFood();
  snake.drawSnake();
  score.textContent = snake.len - 5;
}
function update() {
  snake.updateSnake();
}
init();
//===============================================
function startAnimating(fps) {
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  gameLoop();
}
function gameLoop() {
  if (!gameOver) requestAnimationFrame(gameLoop);
  else {
    gameOverModal.show();
    // alert("Game over");
    // let yes = confirm("Wanna play again?");
    // if (yes) init();
  }
  now = Date.now();
  elapsed = now - then;
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);

    // Put your drawing code here
    if (!gameOver) {
      draw();
      update();
    }
  }
}
