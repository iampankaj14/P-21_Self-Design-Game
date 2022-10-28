var PLAY = 1;
var END = 0;
var gameState = PLAY;

var cyan, cyan_running, cyan_rest;
var ground, invisbleGround, groundImage;

var score;

var gameOver, gameOverImage, restart, restartImage;

var stonesGroup, stone1Image, stone2Image, stone3Image;

function preload() {
  cyan_run = loadAnimation("cyan_jump.png", "cyan_run.png");
  // cyan_jump = loadAnimation("cyan_run.png");
  cyan_rest = loadAnimation("cyan_rest.png");

  groundImage = loadImage("ground.png");

  gameOverImage = loadImage("game_over_.png");

  restartImage = loadImage("restart.png");

  stone1Image = loadImage("stone1.png");
  stone2Image = loadImage("stone2.png");
  stone3Image = loadImage("stone3.png");
}

function setup() {
  createCanvas(600, 200);

  cyan = createSprite(270, 170, 10, 10);
  cyan.addAnimation("run", cyan_run);
  //cyan.addAnimation("jump",cyan_jump);
  cyan.addAnimation("rest", cyan_rest);
  cyan.scale = 0.5;

  ground = createSprite(200, 200, 1000, 20);
  ground.addImage(groundImage);
  ground.scale = 0.5;
  ground.depth = cyan.depth;
  cyan.depth = cyan.depth + 1;

  restart = createSprite(300, 120);
  restart.addImage(restartImage);
  restart.scale = 0.04;
  restart.visible = false;

  gameOver = createSprite(300, 90);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.04;
  gameOver.visible = false;

  invisbleGround = createSprite(200, 190, 140, 10);
  invisbleGround.visible = false;

  stonesGroup = createGroup();

  //cyan.debug = true;
  cyan.setCollider("circle", 0, 0, 45);

  score = 0;
}

function draw() {
  background("white");

  text("Score:" + score, 520, 40);

  if (gameState === PLAY) {
    ground.velocityX = -(4 + score / 100);

    score = score + Math.round(getFrameRate() / 60);

    if (ground.x < 0) {
      ground.x = ground.width / 4;
    }

    if (keyDown("space") && cyan.y >= 150) {
      cyan.velocityY = -10;
    }

    cyan.velocityY = cyan.velocityY + 0.5;

    spawnStones();

    if (cyan.isTouching(stonesGroup)) {
      gameState = END;
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    cyan.changeAnimation("rest", cyan_rest);
    cyan.velocityX = 0;
    cyan.velocityY = 0;

    ground.velocityX = 0;

    stonesGroup.setVelocityXEach(0);
    stonesGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  }

  cyan.collide(invisbleGround);

  drawSprites();
}

function spawnStones() {
  if (frameCount % 60 === 0) {
    var stone = createSprite(600, 172, 10, 40);
    stone.velocityX = -(4 + score / 100);

    var rand = Math.round(random(1, 3));
    switch (rand) {
      case 1:
        stone.addImage(stone1Image);
        break;
      case 2:
        stone.addImage(stone2Image);
        break;
      case 3:
        stone.addImage(stone3Image);
        break;
      //default:
      //break;
    }

    stone.scale = 0.2;
    stone.lifetime = 300;

    stonesGroup.add(stone);
  }
}

function reset() {
  gameState = PLAY;
  score = 0;

  stonesGroup.destroyEach();

  gameOver.visible = false;
  restart.visible = false;

  cyan.changeAnimation("run", cyan_run);
}
