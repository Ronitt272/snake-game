let gameover = false;

let canvas = document.querySelector('#gameboard');
let pen = canvas.getContext('2d');
const cellSize = 20;
const w = 18*cellSize;
const h = 8*cellSize;
let apple = new Image();
apple.src = './assets/apple.png';
pen.drawImage(apple,65,65); 
console.log("some")
class Food{
    constructor(xcor,ycor)
    {
        this.xcor = xcor;  //the coordinates of Apple are assigned as properties of object of class Food
        this.ycor = ycor;  
        this.apple = new Image(); //apple is a property of Food
        this.apple.src = './assets/apple.png';
    }

    drawFood(){
       pen.fillStyle = 'blue';
       pen.drawImage(this.apple,65,65,cellSize,cellSize); 
    }
}

class Snake{
    constructor(length)
    {
        this.length = length;
    }

    createSnake(){
        console.log(this.length)
        this.cells = []; //keeps coordinates of snake
        for(let i = this.length;i>0;i--) //initial size of snake is 5 boxes
        {
            this.cells.push({x : i, y : 0}); //populated the cells array with initial coordinates of snake
        }
        console.log(this.cells);
    }

    drawSnake()
    {
        pen.fillStyle = 'red';
        this.cells.forEach(element => {
            
            pen.fillRect(element.x*cellSize, element.y*cellSize, cellSize, cellSize);
        });
    }

    generateRandomFood()
    {
        let x = Math.round(Math.random()*(w-cellSize)/cellSize);
        let y = Math.round(Math.random()*(h-cellSize)/cellSize);
        if(this.collision_detection(x,y))
        {
            this.generateRandomFood();
        }
        let apple = new Food(x,y);//apple is an object of the Food class created above 
        apple.drawFood();
    }

    collision_detection(x,y)
    {
        for(let i=0;i<this.cells.length;i++)  //5 cells - x1y1, x2y2 ,.....
        {
            if(this.cells[i].x == x && this.cells[i].y == y)
            {
                return true;
            }
        }

        return false;
    }
}


function start()
{
let snake = new Snake(5); //new keyword needed to create object of class 'Snake'
snake.createSnake();
snake.drawSnake();
console.log(snake);
snake.generateRandomFood();
}


start();
// function gameloop(){
//     if(!gameover)
//     {
//         requestAnimationFrame(gameloop);
//     }    
//     else{
//         alert('The game has finished. GAME OVER!!');
//         let decision = confirm('Do you want to play another round ?'); //this returns a boolean value 
//         if(decision == true)
//         {
//             gameover = false;
//             start();
//         }
//     }

//     currentTime = Date.now;
//     timeElapsed = currentTime - previousTime;
//     if(timeElapsed > fpsInterval)
//     {
//         draw();
//         update();
//     }

// }