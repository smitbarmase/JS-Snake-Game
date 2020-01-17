// Originally developed by @smitbarmase on 17 Jan 2020

let canvas = document.querySelector('canvas')
canvas.width = innerWidth
canvas.height = innerHeight
c = canvas.getContext('2d')

// We are using "cell unit" for snake position on canvas.

// For game modification
const cellLength = 22 // Length of each cell
const cellCount = 25
const speed = 1.7 // Pixel to increase every time animate function is called.
const snakeSize = 4

const gameName = "Smooth Scrolling Snake Game"

// No need to change
const gridSide = cellLength * cellCount //Length of grid
const ref_x = (innerWidth/2)-(gridSide/2)
const ref_y = (innerHeight/2)-(gridSide/2)

let refSnakeSize = snakeSize + 1  // Reference snake size will be one greater than actual, due to animation.
let snake_x = Array(refSnakeSize).fill(0) // Snake x co-ordinate in cell unit array
let snake_y = Array(refSnakeSize).fill(0) // Snake y co-ordinate in cell unit array

let dir_x = 1
let dir_y = 0

// Temporary direction values, to store previous direction.
let temp_x = dir_x
let temp_y = dir_y

// Food co-ordinate will be in cell units.
let foodPos_x = 0
let foodPos_y = 0

let gameOver = false
let factor = 0

function clearCanvas(){
  // Background Color
  c.fillStyle = "#1b1b1b"
  c.fillRect(0, 0, canvas.width, canvas.height);
  // Grid Color
  c.fillStyle = "#262626"
  c.fillRect(ref_x, ref_y, gridSide, gridSide);
  // Making grid
  c.strokeStyle = "#333333"
  for(let i=0; i<=cellCount; i++){
    c.beginPath()
    c.moveTo(ref_x+(cellLength*i), ref_y)
    c.lineTo(ref_x+(cellLength*i), ref_y+gridSide)
    c.stroke()
    c.moveTo(ref_x, ref_y+(cellLength*i))
    c.lineTo(ref_x+gridSide, ref_y+(cellLength*i))
    c.stroke()
  }

}

function spawnFood(){
    foodPos_x = Math.floor(Math.random() * cellCount)
    foodPos_y = Math.floor(Math.random() * cellCount)

    for(let i=0; i<refSnakeSize; i++) {
      if(snake_x[i]===foodPos_x || snake_y[i]===foodPos_y) {
        spawnFood()
        break
      }
    }
}

function printFood(){
  c.fillStyle = "#FAAAAA"
  c.fillRect(ref_x+(foodPos_x*cellLength), ref_y+(foodPos_y*cellLength), cellLength, cellLength)
}

function printText(){
  c.fillStyle = "#ffffff"
  c.textAlign = "center"

  c.font = "35px Arial"
  c.fillText("Smooth scrolling snake game in JavaScript", innerWidth/2, 75)

  c.font = "24px Arial"
  c.fillText("Snake size : ".concat(refSnakeSize-1)+"   |   Cell count : ".concat(cellCount)+"   |   Cell length : ".concat(cellLength), innerWidth/2, innerHeight-75)
  c.font = "24px Arial"
  c.fillText("v1.0  |  Project developed by @smitbarmase", innerWidth/2, innerHeight-30)
}

function updateSnakeCell(){
  // Shifting snake forward by shifting positions backward
  for(let i=refSnakeSize-1; i>0; i--){
    snake_x[i] = snake_x[i-1]
    snake_y[i] = snake_y[i-1]
  }

  // Updating snake head as stated by direction
  snake_x[0] += dir_x
  snake_y[0] += dir_y

  // Checking snake wall collision
  if(snake_x[0] > cellCount-1 || snake_y[0] > cellCount-1 || snake_x[0] < 0 || snake_y[0] < 0) {
    gameOver = true
  }
}

// Add event listener for input
document.addEventListener("keypress", function onPress(event) {
    switch(event.key){
      case 'w': if(dir_y==0){
                  dir_x = 0
                  dir_y = -1
                }
      break
      case 's': if(dir_y==0){
                  dir_x = 0
                  dir_y = 1
                }
      break
      case 'a': if(dir_x==0){
                  dir_x = -1
                  dir_y = 0
                }
      break
      case 'd': if(dir_x==0){
                  dir_x = 1
                  dir_y = 0
                }
      break
    }
})

// Continuous loop
function animate(){

  if(gameOver===false){
    // Clear Canvas before updating animation.
    clearCanvas()
    printFood()
    printText()

    c.fillStyle = "#ffffff"

    // Printing snake on canvas. // Converting cell unit to real co-ordinate.
    for(let i=0; i<refSnakeSize; i++) {
      if(i===0) {
        // For head
        if(temp_x===1)
          c.fillRect(ref_x+(cellLength*snake_x[i]), ref_y+(cellLength*snake_y[i]), factor, cellLength);
        else if(temp_x===-1)
          c.fillRect(cellLength-factor+ref_x+(cellLength*snake_x[i]), ref_y+(cellLength*snake_y[i]), factor, cellLength);
        else if(temp_y===1)
          c.fillRect(ref_x+(cellLength*snake_x[i]), ref_y+(cellLength*snake_y[i]), cellLength, factor);
        else
          c.fillRect(ref_x+(cellLength*snake_x[i]), cellLength-factor+ref_y+(cellLength*snake_y[i]), cellLength, factor);
      }
      else if(i===refSnakeSize-1) {
        // For tail
        if(snake_x[i-1]>snake_x[i])
          c.fillRect(ref_x+(cellLength*snake_x[i])+factor, ref_y+(cellLength*snake_y[i]), cellLength-factor, cellLength);
        else if(snake_x[i-1]<snake_x[i])
          c.fillRect(ref_x+(cellLength*snake_x[i]), ref_y+(cellLength*snake_y[i]), cellLength-factor, cellLength);
        else if(snake_y[i-1]>snake_y[i])
          c.fillRect(ref_x+(cellLength*snake_x[i]), ref_y+(cellLength*snake_y[i])+factor, cellLength, cellLength-factor);
        else
          c.fillRect(ref_x+(cellLength*snake_x[i]), ref_y+(cellLength*snake_y[i]), cellLength, cellLength-factor);
      }
      else {
        c.fillRect(ref_x+(cellLength*snake_x[i]), ref_y+(cellLength*snake_y[i]), cellLength, cellLength);
      }
    }

    factor += speed // Increase factor by 'speed' pixel every time

    if(factor>=cellLength){
      factor = 0
      // Store temporary value of direction
      temp_x = dir_x
      temp_y = dir_y
      updateSnakeCell()

      if(snake_x[0]===foodPos_x && snake_y[0]===foodPos_y) {
        spawnFood()
        refSnakeSize += 1
      }
    }
  }

  requestAnimationFrame(animate)
}



// Calling functions at start.
clearCanvas()
spawnFood()
animate()
