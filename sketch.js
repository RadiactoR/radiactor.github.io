//set screen dimensions to easy-to-reach variables.
const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

//easy to reach, important variables.
var bird;
var pipes = [];
var gameOver = false;
var score = 0;

//loading sound below !!! HANGS ON 'LOADING...' !!!
function preload() {
    soundFormats('mp3', 'wav');
    startSound = loadSound('sound\start1.wav');
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

    //init hammer touch.
    var hammertime = new Hammer(canvasElement);
    hammertime.on('tap', function() {
        console.log("tap");
        loop();
        startText.hidden = true;
        scoreText.hidden = false;
        startSound.play();
        if (gameOver) {
            location.reload();
        }
    });
    
    //hide unrelevant text.
    endText.hidden = true;
    scoreText.hidden = true;

    //give birth to a new bird.
    bird = new Bird();
    pipes.push(new Pipe());

    //don't start the game until screen tapped.
    noLoop();
}

function draw() {
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
                document.getElementById("scoreText").innerHTML = score;
                x.cleared = true;
                console.log(score);
            }
        }

        //check if bird hits pipe.
        if (pipe.hits(bird)) {
            for (p of pipes) {
                gameOver = true
                p.speed = 0;
                endText.hidden = false;
            }
        }

        //when pipe is offscreen, remove it.
        if (pipe.offscreen()) {
            pipes.splice(index, 1);
        }
    }

    //if bird crashes into ground, end the game.
    if (bird.y >= (vh * 0.8)){
        gameOver = true
        for (pipe of pipes) {
            pipe.speed = 0;
        }
        endText.hidden = false;
    }

    //finally, draw the bird.
    bird.show(); 

}

//for easy play on pc, REMOVE BEFORE RELEASE.
function keyPressed() {
    if (key == ' ' && !gameOver) {
        bird.up();
        startText.hidden = true;
        scoreText.hidden = false;
        loop();
        if (gameOver) {
            //reload page.
            location.reload();
        }
    }
}