//set screen dimensions to easy-to-reach variables.
const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

//easy to reach, important variables.
var bird;
var pipes = [];
var gameOver = false;
var gameStarted = false;
var score = 0;

var start_sound = new Audio("sound/start1.wav");
var cleared_sound = new Audio("sound/cleared2.wav");
var die_sound = new Audio("sound/die.wav");
var end_sound = new Audio("sound/flappydie.wav")

var birdCanJump = true;

var allowReload = false;

function sleep(ms) { // Universal sleep function
    return new Promise(resolve => setTimeout(resolve, ms));
}

function calculateAspectRadioFit(vw, vh, maxWidth = 1920, maxHeight = 1080) {
    var ratio = Math.min(maxWidth / vw, maxHeight / vh);
    console.log((vw * ratio)/(vh * ratio));
    return vw * ratio;
}

async function gameOverLogic() {
    gameOver = true;
    birdCanJump = false;
    for (p of pipes) {
        p.speed = 0;
    }
    die_sound.play();
    await sleep(500); // Sleep for .5 seconds before playing end jingle
    end_sound.play();
    await sleep(850); // Sleep for 0.85 seconds before displaying end text (sync with jingle :3)
    allowReload = true
    endText.hidden = false;
    endText.hidden = false;
}

function setup() {
    //init game.
    var canvas = createCanvas(vw, (vh * 0.8));
    canvas.parent("canvas-container");

    //getting html elements.
    var canvasElement = document.getElementById("canvas-container");
    var startText = document.getElementById("startText");
    var endText = document.getElementById("endText");
    var scoreText = document.getElementById("scoreText");

    //init hammer touch, for use with touchscreens.
    var hammertime = new Hammer(canvasElement);
    hammertime.on('tap', function() {
        pressed();
    });
    
    //hide unrelevant text.
    endText.hidden = true;
    scoreText.hidden = true;

    //give birth to a new bird.
    bird = new Bird();

    //build new pipe
    pipes.push(new Pipe());

    //play the start jingle
    start_sound.play();

    //don't start the game until screen tapped.
    noLoop();
}

async function draw() {
    noStroke(); //no black borders on graphics.
    background(100, 100, 255); //blue sky background.
  
    bird.update(); //each frame, update the bird's velocity.

    //spawn new pipe every 80th frame.
    if (frameCount % 80 == 0 && !gameOver) {
        pipes.push(new Pipe());
    }

    //update pipes.
    for (var [index, pipe] of pipes.entries()) {
        //draw and update pipe location.
        pipe.show();
        pipe.update();
        
        //if bird cleares pipe, add a score.
        for (x of pipes) {
            if ((x.x + (x.w / 2)) <= bird.x && x.cleared == false) {
                score++;
                cleared_sound.cloneNode(true).play();
                document.getElementById("scoreText").innerHTML = score;
                x.cleared = true;
                console.log(score);
            }
        }

        //end game if bird crashes into pipe
        if (pipe.hits(bird)) {
            if (!gameOver){
                gameOverLogic()
            }
        }

        //end game if bird crashes into ground
        if (bird.y >= (vh * 0.8)){
            if (!gameOver){
                gameOverLogic()
            }
        }

        //when pipe is offscreen, remove it.
        if (pipe.offscreen()) {
            pipes.splice(index, 1);
        }
    }

    //finally, draw the bird.
    bird.show(); 
}

//defines [SPACE] as jump key on PC
async function keyPressed() {
    if (key == ' ') {
        pressed();
    }
}

function pressed() {
    if (!gameStarted){
        start_sound.play();
    }
    gameStarted = true;
    if (birdCanJump) {
        bird.up();
    }
    startText.hidden = true;
    scoreText.hidden = false;
    loop();
    if (gameOver && allowReload) {
        //reload page.
        location.reload();
    }
}