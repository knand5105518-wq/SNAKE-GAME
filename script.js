// ===== SETUP =====
const board = document.querySelector(".board");

// FIXED GRID
const cols = 20;
const rows = 20;
// const cols = Math.floor(board.clientWidth / blockSize);
// const rows = Math.floor(board.clientHeight / blockSize);

// grid create
for (let i = 0; i < cols * rows; i++) {
    let div = document.createElement("div");
    div.classList.add("block");
    board.appendChild(div);
}

const blocks = document.querySelectorAll(".block");

// ===== GAME DATA =====
let snake = [{ x: 5, y: 5 }];
let direction = { x: 0, y: 0 };

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

let seconds = 0;
let minutes = 0;

// UI
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const timeEl = document.getElementById("time");

scoreEl.innerText = 0;
highScoreEl.innerText = highScore;

// food
let food = randomFood();

// ===== FUNCTIONS =====

function randomFood() {
    return {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows)
    };
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
    if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
    if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
    if (e.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
});

function draw() {
    blocks.forEach(b => b.style.background = "");

    snake.forEach(p => {
        let i = p.y * cols + p.x;
        if (blocks[i]) blocks[i].style.background = "lime";
    });

    let fi = food.y * cols + food.x;
    if (blocks[fi]) blocks[fi].style.background = "red";
}

function move() {

    if (direction.x === 0 && direction.y === 0) return;

    let head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows) {
        return gameOver();
    }

    for (let p of snake) {
        if (p.x === head.x && p.y === head.y) {
            return gameOver();
        }
    }

    if (head.x === food.x && head.y === food.y) {
        snake.unshift(head);

        score++;
        scoreEl.innerText = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            highScoreEl.innerText = highScore;
        }

        food = randomFood();
    } else {
        snake.unshift(head);
        snake.pop();
    }
}

function timer() {
    if (direction.x === 0 && direction.y === 0) return;

    seconds++;
    if (seconds === 60) {
        minutes++;
        seconds = 0;
    }

    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;

    timeEl.innerText = `${m}-${s}`;
}

function gameOver() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);

    setTimeout(() => {
        if (confirm("Game Over! Restart?")) {
            location.reload();
        }
    }, 100);
}

let gameInterval = setInterval(() => {
    move();
    draw();
}, 400);

let timerInterval = setInterval(timer, 1000);
// loops
// setInterval(() => {
//     move();
//     draw();
// }, 400);

// setInterval(timer, 1000);