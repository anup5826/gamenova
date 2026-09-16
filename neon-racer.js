const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const speedText = document.getElementById("speed");

const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");


/* =========================
   GAME VARIABLES
========================= */

let score = 0;
let gameOver = false;

let roadSpeed = 5;
let roadOffset = 0;

let keys = {};

let spawnTimer = 0;


/* =========================
   PLAYER / CAR
========================= */

const player = {

    x: 225,
    y: 570,

    width: 50,
    height: 90,

    speed: 7

};


/* =========================
   ENEMIES
========================= */

let enemies = [];


/* =========================
   KEYBOARD
========================= */

document.addEventListener("keydown", function(e) {

    keys[e.key.toLowerCase()] = true;

});


document.addEventListener("keyup", function(e) {

    keys[e.key.toLowerCase()] = false;

});


/* =========================
   TOUCH BUTTONS
========================= */

function startLeft(e) {

    e.preventDefault();
    keys["left"] = true;

}

function stopLeft(e) {

    e.preventDefault();
    keys["left"] = false;

}


function startRight(e) {

    e.preventDefault();
    keys["right"] = true;

}

function stopRight(e) {

    e.preventDefault();
    keys["right"] = false;

}


/* LEFT BUTTON */

leftBtn.addEventListener("pointerdown", startLeft);
leftBtn.addEventListener("pointerup", stopLeft);
leftBtn.addEventListener("pointercancel", stopLeft);
leftBtn.addEventListener("pointerleave", stopLeft);


/* RIGHT BUTTON */

rightBtn.addEventListener("pointerdown", startRight);
rightBtn.addEventListener("pointerup", stopRight);
rightBtn.addEventListener("pointercancel", stopRight);
rightBtn.addEventListener("pointerleave", stopRight);


/* =========================
   RESET GAME
========================= */

function resetGame() {

    score = 0;

    gameOver = false;

    roadSpeed = 5;

    roadOffset = 0;

    spawnTimer = 0;

    player.x = canvas.width / 2 - player.width / 2;

    enemies = [];

    scoreText.textContent = "0";

    speedText.textContent = "1";

    gameOverScreen.style.display = "none";

}


/* =========================
   SPAWN ENEMY
========================= */

function spawnEnemy() {

    const laneWidth = 100;

    const lanes = [100, 200, 300];

    const lane = lanes[
        Math.floor(Math.random() * lanes.length)
    ];

    enemies.push({

        x: lane - 25,

        y: -100,

        width: 50,

        height: 90,

        speed: roadSpeed + 1 + Math.random() * 2,

        color: Math.random() > 0.5
            ? "#ff0055"
            : "#ff8c00"

    });

}


/* =========================
   COLLISION
========================= */

function collision(a, b) {

    return (

        a.x < b.x + b.width &&

        a.x + a.width > b.x &&

        a.y < b.y + b.height &&

        a.y + a.height > b.y

    );

}


/* =========================
   UPDATE
========================= */

function update() {

    if (gameOver) {
        return;
    }


    /* PLAYER LEFT */

    if (
        keys["arrowleft"] ||
        keys["a"] ||
        keys["left"]
    ) {

        player.x -= player.speed;

    }


    /* PLAYER RIGHT */

    if (
        keys["arrowright"] ||
        keys["d"] ||
        keys["right"]
    ) {

        player.x += player.speed;

    }


    /* KEEP PLAYER ON ROAD */

    const leftLimit = 70;

    const rightLimit =
        canvas.width - 70 - player.width;


    if (player.x < leftLimit) {

        player.x = leftLimit;

    }


    if (player.x > rightLimit) {

        player.x = rightLimit;

    }


    /* ROAD MOVEMENT */

    roadOffset += roadSpeed;

    if (roadOffset > 80) {

        roadOffset = 0;

    }


    /* SPAWN ENEMIES */

    spawnTimer++;

    if (spawnTimer > 70) {

        spawnEnemy();

        spawnTimer = 0;

    }


    /* MOVE ENEMIES */

    enemies.forEach(function(enemy) {

        enemy.y += enemy.speed;

    });


    /* COLLISION */

    enemies.forEach(function(enemy) {

        if (collision(player, enemy)) {

            endGame();

        }

    });


    /* REMOVE PASSED ENEMIES */

    enemies = enemies.filter(function(enemy) {

        if (enemy.y > canvas.height + 100) {

            score += 10;

            return false;

        }

        return true;

    });


    /* INCREASE SPEED */

    roadSpeed = 5 + Math.floor(score / 100);

    speedText.textContent =
        Math.floor(roadSpeed / 2);


    scoreText.textContent = score;

}


/* =========================
   DRAW BACKGROUND
========================= */

function drawBackground() {

    /* SKY */

    ctx.fillStyle = "#050510";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* ROAD */

    ctx.fillStyle = "#20202d";

    ctx.fillRect(
        60,
        0,
        380,
        canvas.height
    );


    /* LEFT BORDER */

    ctx.fillStyle = "#00ffff";

    ctx.fillRect(
        55,
        0,
        5,
        canvas.height
    );


    /* RIGHT BORDER */

    ctx.fillRect(
        440,
        0,
        5,
        canvas.height
    );


    /* ROAD LINES */

    ctx.fillStyle = "#ffffff";


    for (
        let y = -80 + roadOffset;
        y < canvas.height;
        y += 120
    ) {

        ctx.fillRect(
            180,
            y,
            8,
            65
        );

        ctx.fillRect(
            312,
            y,
            8,
            65
        );

    }


    /* SIDE NEON LIGHTS */

    for (
        let y = -50 + roadOffset;
        y < canvas.height;
        y += 100
    ) {

        ctx.fillStyle = "#ff00ff";

        ctx.fillRect(
            25,
            y,
            12,
            45
        );


        ctx.fillStyle = "#00ffff";

        ctx.fillRect(
            463,
            y,
            12,
            45
        );

    }

}


/* =========================
   DRAW PLAYER CAR
========================= */

function drawPlayer() {

    const x = player.x;
    const y = player.y;


    /* NEON GLOW */

    ctx.shadowBlur = 25;
    ctx.shadowColor = "#00ffff";


    /* CAR BODY */

    ctx.fillStyle = "#00eaff";

    ctx.beginPath();

    ctx.roundRect(
        x,
        y,
        player.width,
        player.height,
        12
    );

    ctx.fill();


    ctx.shadowBlur = 0;


    /* DARK WINDOW */

    ctx.fillStyle = "#07111d";

    ctx.beginPath();

    ctx.roundRect(
        x + 8,
        y + 12,
        player.width - 16,
        27,
        7
    );

    ctx.fill();


    /* WINDOW HIGHLIGHT */

    ctx.fillStyle = "#183d4a";

    ctx.fillRect(
        x + 12,
        y + 16,
        26,
        5
    );


    /* FRONT */

    ctx.fillStyle = "#bfffff";

    ctx.fillRect(
        x + 8,
        y + 45,
        12,
        8
    );

    ctx.fillRect(
        x + 30,
        y + 45,
        12,
        8
    );


    /* REAR LIGHTS */

    ctx.fillStyle = "#ff0055";

    ctx.fillRect(
        x + 5,
        y + 72,
        13,
        8
    );

    ctx.fillRect(
        x + 32,
        y + 72,
        13,
        8
    );


    /* CENTER LINE */

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        x + 23,
        y + 45,
        4,
        25
    );


    /* WHEELS */

    ctx.fillStyle = "#080808";

    ctx.fillRect(
        x - 6,
        y + 18,
        8,
        22
    );

    ctx.fillRect(
        x + player.width - 2,
        y + 18,
        8,
        22
    );

    ctx.fillRect(
        x - 6,
        y + 60,
        8,
        22
    );

    ctx.fillRect(
        x + player.width - 2,
        y + 60,
        8,
        22
    );

}


/* =========================
   DRAW ENEMY CAR
========================= */

function drawEnemy(enemy) {

    const x = enemy.x;
    const y = enemy.y;


    /* GLOW */

    ctx.shadowBlur = 18;

    ctx.shadowColor = enemy.color;


    /* BODY */

    ctx.fillStyle = enemy.color;

    ctx.beginPath();

    ctx.roundRect(
        x,
        y,
        enemy.width,
        enemy.height,
        10
    );

    ctx.fill();


    ctx.shadowBlur = 0;


    /* WINDOW */

    ctx.fillStyle = "#111827";

    ctx.beginPath();

    ctx.roundRect(
        x + 8,
        y + 12,
        enemy.width - 16,
        28,
        7
    );

    ctx.fill();


    /* HEAD LIGHTS */

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        x + 7,
        y + 45,
        13,
        8
    );

    ctx.fillRect(
        x + 30,
        y + 45,
        13,
        8
    );


    /* TAIL */

    ctx.fillStyle = "#ff0033";

    ctx.fillRect(
        x + 6,
        y + 72,
        13,
        8
    );

    ctx.fillRect(
        x + 31,
        y + 72,
        13,
        8
    );


    /* WHEELS */

    ctx.fillStyle = "#050505";

    ctx.fillRect(
        x - 5,
        y + 18,
        7,
        22
    );

    ctx.fillRect(
        x + enemy.width - 2,
        y + 18,
        7,
        22
    );

    ctx.fillRect(
        x - 5,
        y + 60,
        7,
        22
    );

    ctx.fillRect(
        x + enemy.width - 2,
        y + 60,
        7,
        22
    );

}


/* =========================
   DRAW
========================= */

function draw() {

    drawBackground();


    /* ENEMY CARS */

    enemies.forEach(function(enemy) {

        drawEnemy(enemy);

    });


    /* PLAYER CAR */

    drawPlayer();

}


/* =========================
   GAME OVER
========================= */

function endGame() {

    gameOver = true;

    finalScore.textContent = score;

    gameOverScreen.style.display = "flex";

}


/* =========================
   GAME LOOP
========================= */

function gameLoop() {

    update();

    draw();

    requestAnimationFrame(gameLoop);

}


/* =========================
   RESTART
========================= */

restartBtn.addEventListener(
    "click",
    function() {

        resetGame();

    }
);


/* =========================
   START GAME
========================= */

resetGame();

gameLoop();