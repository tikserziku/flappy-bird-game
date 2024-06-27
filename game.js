const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const birdImg = new Image();
birdImg.src = 'A_cute_cartoon_bird_suitable_for_a_game,_with_a_si.png';

const backgroundImg = new Image();
backgroundImg.src = 'A_serene_forest_scene_with_a_lake,_showing_lush_gr.png';

const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 60,
    height: 60,
    gravity: 0.5,
    lift: -10,
    velocity: 0
};

const pipes = [];
const pipeWidth = 80;
const pipeGap = 200;
let pipeSpeed = 3;
let score = 0;
let gameOver = false;

function generatePipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - pipeGap - minHeight;
    const height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    pipes.push({
        x: canvas.width,
        y: height,
        width: pipeWidth,
        topHeight: height,
        bottomHeight: canvas.height - height - pipeGap
    });
}

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipe.width, pipe.bottomHeight);
    });
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
    }
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
    });

    if (pipes.length > 0 && pipes[0].x + pipeWidth < 0) {
        pipes.shift();
        score++;
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 250) {
        generatePipe();
    }
}

function checkCollision() {
    const bx = bird.x + bird.width / 2;
    const by = bird.y + bird.height / 2;

    pipes.forEach(pipe => {
        if (
            bx > pipe.x &&
            bx < pipe.x + pipe.width &&
            (by < pipe.topHeight || by > canvas.height - pipe.bottomHeight)
        ) {
            gameOver = true;
        }
    });

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    
    updateBird();
    updatePipes();
    checkCollision();

    drawPipes();
    drawBird();
    drawScore();

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        ctx.font = '24px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 70, canvas.height / 2 + 40);
    }
}

document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        if (gameOver) {
            resetGame();
        } else {
            bird.velocity = bird.lift;
        }
    }
});

canvas.addEventListener('click', () => {
    if (gameOver) {
        resetGame();
    } else {
        bird.velocity = bird.lift;
    }
});

function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    gameOver = false;
    gameLoop();
}

document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'none';
    resetGame();
});

window.onload = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};