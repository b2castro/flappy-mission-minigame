// current state of the game
let game_state = 0;
var theme_music = document.getElementById("myAudio");
let game_sound = 0;

// player elemets: current score, health, and max health
let score = 0;
let hp = 1;
const maxhp = 1;

// ball elements: current coordinates, color, and size
let ball_X_coordinates, ball_Y_coordinates;
let ballColor = 0;
const ball_size = 20;

// wall elements: pace, wall gaps, wall widths, and color
let add_time = 0;
let wallColors;
let walls = [];
const min_wall_gap_height = 50;
const max_wall_gap_height = 30;
var wall_velocity = 4.5;
const interval = 1600;
const width_wall = 80; 

/**** Initial Game Setups *****/
function setup() {
  createCanvas(500, 500);
  ballColor = color(random(100, 253),random(100, 255),random(100, 255));
  wallColors = color(random(100, 253),random(100, 255),random(100, 255));
}

function draw() {
  if (game_state == 0) { 
    smooth();
    background(254,255,255);
    textAlign(CENTER);  
    fill(255,100,150); 
    textSize(20); 
    text("Use Your Mouse To Dodge The Walls!", width/2, height/1.8);
    textSize(50);
    text("Mission Impossible", width/2, height/4);
    textSize(20);
    text("Click to start", width/2, height/1.6);
  } else if (game_state == 1) { 
    gameplayScreen();
    ball_X_coordinates = mouseX;
    ball_Y_coordinates = mouseY;   
  } else if (game_state == 2) { 
    game_over();
  }
}

function add_wall_to_array() {
  if (millis()-add_time > interval) {
    let randHeight = round(random(min_wall_gap_height, max_wall_gap_height));
    let randY = round(random(0, height-randHeight));
    // {gapWallX, gapWallY, gapwidth_wall, gapWallHeight, scored}
    let randWall = [width, randY, width_wall, randHeight, 0]; 
    walls.push(randWall);
    add_time = millis();
  }
}
function handler_wall_states() {
  for (let i = 0; i < walls.length; i++) {
    remove_wall(i);
    move_wall(i);
    wall_draw(i);
    collision_check(i);
  }
}

function wall_draw(index) {
  let wall = walls[index];
  let gapWallX = wall[0];
  let gapWallY = wall[1];
  let gapwidth_wall = wall[2];
  let gapWallHeight = wall[3];
  noStroke(1);
  fill(wallColors);
  rect(gapWallX, 0, gapwidth_wall, gapWallY, 0, 0, 0, 0);
  rect(gapWallX, gapWallY+gapWallHeight, gapwidth_wall, height-(gapWallY+gapWallHeight), 0, 0, 0, 0);
}

function move_wall(index) {
  let wall = walls[index];
  wall[0] -= wall_velocity;
}

function remove_wall(index) {
  let wall = walls[index];
  if (wall[0]+wall[2] <= 0) {
    walls.splice(index, 1);
  }
}

function collision_check(index) {
  let wall = walls[index];
  let gapWallX = wall[0];
  let gapWallY = wall[1];
  let gapwidth_wall = wall[2];
  let gapWallHeight = wall[3];
  let wallScored = wall[4];
  let wallTopX = gapWallX;
  let wallTopY = 0;
  let wallTopWidth = gapwidth_wall;
  let wallTopHeight = gapWallY;
  let wallBottomX = gapWallX;
  let wallBottomY = gapWallY+gapWallHeight;
  let wallBottomWidth = gapwidth_wall;
  let wallBottomHeight = height-(gapWallY+gapWallHeight);

  if (
    (ball_X_coordinates+(ball_size/2)>wallTopX) &&
    (ball_X_coordinates-(ball_size/2)<wallTopX+wallTopWidth) &&
    (ball_Y_coordinates+(ball_size/2)>wallTopY) &&
    (ball_Y_coordinates-(ball_size/2)<wallTopY+wallTopHeight)
    ) {
    dead();
  }
  if (
    (ball_X_coordinates+(ball_size/2)>wallBottomX) &&
    (ball_X_coordinates-(ball_size/2)<wallBottomX+wallBottomWidth) &&
    (ball_Y_coordinates+(ball_size/2)>wallBottomY) &&
    (ball_Y_coordinates-(ball_size/2)<wallBottomY+wallBottomHeight)
    ) {
    dead();
  }
  if (ball_X_coordinates > gapWallX+(gapwidth_wall/2) && wallScored==0) {
    wallScored=1;
    wall[4]=1;
    score++;
  }
}

function dead() {
  hp--;
  if (hp <= 0) {
    game_over_state();
  }
}


/******* Game State Handlers ******/
function mousePressed() {
  // if we are on the initial screen when clicked, start the game 
  if (game_state==0) { 
    startGame();
    theme_music.play();
    game_sound = 1;
  }
  if (game_state==2) {
    restart();
    theme_music.play();
  }
}

function startGame() {
  game_state=1;
}
function game_over_state() {
  game_state=2;
  theme_music.pause();
}

function restart() {
  score = 0;
  hp = maxhp;
  add_time = 0;
  walls = [];
  game_state = 1;
  setup();

}

function gameplayScreen() {
  background(254, 255, 255);
  add_wall_to_array();
  handler_wall_states();
  
  //Print Score    
  textAlign(CENTER);
  fill(0);
  textSize(30); 
  text(score, width/2, 50 );    
    
  //Draw Ball       
  fill(ballColor);
  ellipse(ball_X_coordinates, ball_Y_coordinates, ball_size, ball_size);
}

function game_over() {
  textAlign(CENTER);
  fill(255,100,150);
  smooth();
  textSize(50);
  text("GAME OVER", width/2, height/2 - 90);
  textSize(30);
  text("Click to Restart :)", width/2, height/1.6);
}

