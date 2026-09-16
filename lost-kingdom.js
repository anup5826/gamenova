const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


/* =========================
   HUD
========================= */

const scoreText =
    document.getElementById("score");

const treasureText =
    document.getElementById("treasure");

const healthText =
    document.getElementById("health");

const gameOverScreen =
    document.getElementById("gameOverScreen");

const gameOverTitle =
    document.getElementById("gameOverTitle");

const finalScore =
    document.getElementById("finalScore");

const restartBtn =
    document.getElementById("restartBtn");


/* =========================
   GAME VARIABLES
========================= */

let score = 0;

let health = 100;

let gameOver = false;

let keys = {};

let treasures = [];

let enemies = [];

let collected = 0;


/* =========================
   PLAYER
========================= */

const player = {

    x: 100,

    y: 250,

    width: 34,

    height: 50,

    speed: 4

};


/* =========================
   KEYBOARD
========================= */

document.addEventListener(
    "keydown",
    function(e) {

        keys[
            e.key.toLowerCase()
        ] = true;

    }
);


document.addEventListener(
    "keyup",
    function(e) {

        keys[
            e.key.toLowerCase()
        ] = false;

    }
);


/* =========================
   TREASURE
========================= */

function createTreasures() {

    treasures = [

        {
            x: 180,
            y: 100,
            collected: false
        },

        {
            x: 620,
            y: 100,
            collected: false
        },

        {
            x: 700,
            y: 350,
            collected: false
        },

        {
            x: 350,
            y: 400,
            collected: false
        },

        {
            x: 520,
            y: 260,
            collected: false
        }

    ];

}


/* =========================
   ENEMIES
========================= */

function createEnemies() {

    enemies = [

        {
            x: 400,
            y: 120,
            width: 38,
            height: 38,
            speed: 1.2,
            direction: 1
        },

        {
            x: 650,
            y: 200,
            width: 38,
            height: 38,
            speed: 1,
            direction: -1
        },

        {
            x: 300,
            y: 330,
            width: 38,
            height: 38,
            speed: 1.3,
            direction: 1
        }

    ];

}


/* =========================
   COLLISION
========================= */

function collision(a, b) {

    return (

        a.x <
        b.x + b.width &&

        a.x + a.width >
        b.x &&

        a.y <
        b.y + b.height &&

        a.y + a.height >
        b.y

    );

}


/* =========================
   PLAYER MOVEMENT
========================= */

function updatePlayer() {

    let dx = 0;

    let dy = 0;


    if (
        keys["arrowleft"] ||
        keys["a"] ||
        keys["left"]
    ) {

        dx -= player.speed;

    }


    if (
        keys["arrowright"] ||
        keys["d"] ||
        keys["right"]
    ) {

        dx += player.speed;

    }


    if (
        keys["arrowup"] ||
        keys["w"] ||
        keys["up"]
    ) {

        dy -= player.speed;

    }


    if (
        keys["arrowdown"] ||
        keys["s"] ||
        keys["down"]
    ) {

        dy += player.speed;

    }


    player.x += dx;

    player.y += dy;


    /* MAP BOUNDARIES */

    if (player.x < 30) {

        player.x = 30;

    }

    if (
        player.x + player.width >
        canvas.width - 30
    ) {

        player.x =
            canvas.width -
            30 -
            player.width;

    }


    if (player.y < 30) {

        player.y = 30;

    }

    if (
        player.y + player.height >
        canvas.height - 30
    ) {

        player.y =
            canvas.height -
            30 -
            player.height;

    }

}


/* =========================
   UPDATE TREASURE
========================= */

function updateTreasures() {

    treasures.forEach(
        function(treasure) {

            if (
                !treasure.collected &&
                player.x <
                    treasure.x + 25 &&
                player.x +
                    player.width >
                    treasure.x &&
                player.y <
                    treasure.y + 25 &&
                player.y +
                    player.height >
                    treasure.y
            ) {

                treasure.collected = true;

                collected++;

                score += 100;

                treasureText.textContent =
                    collected + " / 5";

                scoreText.textContent =
                    score;

            }

        }
    );


    /* WIN */

    if (collected >= 5) {

        finishGame(
            "KINGDOM SAVED!"
        );

    }

}


/* =========================
   UPDATE ENEMIES
========================= */

function updateEnemies() {

    enemies.forEach(
        function(enemy) {

            enemy.x +=
                enemy.speed *
                enemy.direction;


            if (
                enemy.x < 80 ||
                enemy.x >
                    canvas.width - 100
            ) {

                enemy.direction *= -1;

            }


            if (
                collision(
                    player,
                    enemy
                )
            ) {

                health -= 1;

                healthText.textContent =
                    Math.max(0, health);


                /* Push player away */

                player.x -=
                    enemy.direction * 8;


                if (health <= 0) {

                    finishGame(
                        "GAME OVER"
                    );

                }

            }

        }
    );

}


/* =========================
   DRAW BACKGROUND
========================= */

function drawBackground() {

    /* GRASS */

    ctx.fillStyle = "#19351d";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* GRASS DETAILS */

    ctx.fillStyle = "#214923";

    for (
        let x = 0;
        x < canvas.width;
        x += 45
    ) {

        for (
            let y = 0;
            y < canvas.height;
            y += 45
        ) {

            ctx.fillRect(
                x + 10,
                y + 15,
                3,
                8
            );

        }

    }


    /* PATH */

    ctx.fillStyle = "#715b3c";

    ctx.beginPath();

    ctx.moveTo(0, 210);

    ctx.lineTo(800, 170);

    ctx.lineTo(800, 290);

    ctx.lineTo(0, 330);

    ctx.closePath();

    ctx.fill();


    /* CASTLE */

    ctx.fillStyle = "#555565";

    ctx.fillRect(
        335,
        45,
        130,
        80
    );


    /* CASTLE TOWERS */

    ctx.fillRect(
        320,
        25,
        35,
        100
    );

    ctx.fillRect(
        445,
        25,
        35,
        100
    );


    /* TOWER TOPS */

    ctx.fillStyle = "#8b8ba0";

    ctx.beginPath();

    ctx.moveTo(315, 25);
    ctx.lineTo(337, 5);
    ctx.lineTo(360, 25);

    ctx.closePath();

    ctx.fill();


    ctx.beginPath();

    ctx.moveTo(440, 25);
    ctx.lineTo(462, 5);
    ctx.lineTo(485, 25);

    ctx.closePath();

    ctx.fill();


    /* CASTLE DOOR */

    ctx.fillStyle = "#241a18";

    ctx.fillRect(
        385,
        80,
        30,
        45
    );


    /* TREES */

    drawTree(100, 100);

    drawTree(700, 100);

    drawTree(100, 400);

    drawTree(700, 420);

}


/* =========================
   TREE
========================= */

function drawTree(x, y) {

    /* Trunk */

    ctx.fillStyle = "#704522";

    ctx.fillRect(
        x - 8,
        y + 20,
        16,
        35
    );


    /* Leaves */

    ctx.fillStyle = "#0c641e";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        30,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle = "#16852b";

    ctx.beginPath();

    ctx.arc(
        x - 15,
        y - 10,
        20,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =========================
   DRAW PLAYER
========================= */

function drawPlayer() {

    const x = player.x;

    const y = player.y;


    /* SHADOW */

    ctx.fillStyle =
        "rgba(0,0,0,.35)";

    ctx.beginPath();

    ctx.ellipse(
        x + 17,
        y + 49,
        20,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* GLOW */

    ctx.shadowBlur = 12;

    ctx.shadowColor = "#00d9ff";


    /* BODY / ARMOR */

    ctx.fillStyle = "#2467a8";

    ctx.beginPath();

    ctx.roundRect(
        x + 5,
        y + 19,
        24,
        27,
        6
    );

    ctx.fill();


    ctx.shadowBlur = 0;


    /* CAPE */

    ctx.fillStyle = "#6e1835";

    ctx.beginPath();

    ctx.moveTo(
        x + 6,
        y + 23
    );

    ctx.lineTo(
        x - 5,
        y + 48
    );

    ctx.lineTo(
        x + 30,
        y + 48
    );

    ctx.lineTo(
        x + 27,
        y + 23
    );

    ctx.closePath();

    ctx.fill();


    /* HEAD */

    ctx.fillStyle = "#f0b27a";

    ctx.beginPath();

    ctx.arc(
        x + 17,
        y + 13,
        12,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* HAIR */

    ctx.fillStyle = "#301b13";

    ctx.beginPath();

    ctx.arc(
        x + 17,
        y + 9,
        12,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /* HELMET */

    ctx.strokeStyle = "#d8e8f0";

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.arc(
        x + 17,
        y + 11,
        13,
        Math.PI,
        Math.PI * 2
    );

    ctx.stroke();


    /* EYES */

    ctx.fillStyle = "#111";

    ctx.fillRect(
        x + 12,
        y + 12,
        3,
        3
    );

    ctx.fillRect(
        x + 20,
        y + 12,
        3,
        3
    );


    /* SWORD */

    ctx.strokeStyle = "#e8f8ff";

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.moveTo(
        x + 30,
        y + 27
    );

    ctx.lineTo(
        x + 43,
        y + 12
    );

    ctx.stroke();


    /* SWORD HANDLE */

    ctx.strokeStyle = "#8b5a2b";

    ctx.lineWidth = 5;

    ctx.beginPath();

    ctx.moveTo(
        x + 27,
        y + 30
    );

    ctx.lineTo(
        x + 34,
        y + 35
    );

    ctx.stroke();

}


/* =========================
   DRAW TREASURE
========================= */

function drawTreasure(treasure) {

    if (treasure.collected) {
        return;
    }


    const x = treasure.x;

    const y = treasure.y;


    /* GLOW */

    ctx.shadowBlur = 20;

    ctx.shadowColor = "#ffd700";


    /* BOX */

    ctx.fillStyle = "#8b5a16";

    ctx.fillRect(
        x,
        y + 7,
        25,
        18
    );


    /* GOLD */

    ctx.fillStyle = "#ffd700";

    ctx.fillRect(
        x + 3,
        y + 10,
        19,
        8
    );


    /* LID */

    ctx.fillStyle = "#c58b1a";

    ctx.fillRect(
        x,
        y + 2,
        25,
        7
    );


    /* LOCK */

    ctx.fillStyle = "#fff2a8";

    ctx.fillRect(
        x + 10,
        y + 9,
        5,
        8
    );


    ctx.shadowBlur = 0;

}


/* =========================
   DRAW ENEMY
========================= */

function drawEnemy(enemy) {

    const x = enemy.x;

    const y = enemy.y;


    /* Shadow */

    ctx.fillStyle =
        "rgba(0,0,0,.3)";

    ctx.beginPath();

    ctx.ellipse(
        x + 19,
        y + 38,
        20,
        6,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* BODY */

    ctx.fillStyle = "#7a1e2b";

    ctx.beginPath();

    ctx.arc(
        x + 19,
        y + 23,
        16,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* HEAD */

    ctx.fillStyle = "#a84b3c";

    ctx.beginPath();

    ctx.arc(
        x + 19,
        y + 13,
        12,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* HORNS */

    ctx.fillStyle = "#ddd";

    ctx.beginPath();

    ctx.moveTo(
        x + 10,
        y + 7
    );

    ctx.lineTo(
        x + 5,
        y - 5
    );

    ctx.lineTo(
        x + 15,
        y + 4
    );

    ctx.closePath();

    ctx.fill();


    ctx.beginPath();

    ctx.moveTo(
        x + 28,
        y + 7
    );

    ctx.lineTo(
        x + 33,
        y - 5
    );

    ctx.lineTo(
        x + 23,
        y + 4
    );

    ctx.closePath();

    ctx.fill();


    /* EYES */

    ctx.fillStyle = "#ffff00";

    ctx.fillRect(
        x + 12,
        y + 12,
        4,
        3
    );

    ctx.fillRect(
        x + 22,
        y + 12,
        4,
        3
    );

}


/* =========================
   DRAW
========================= */

function draw() {

    drawBackground();


    /* TREASURES */

    treasures.forEach(
        drawTreasure
    );


    /* ENEMIES */

    enemies.forEach(
        drawEnemy
    );


    /* PLAYER */

    drawPlayer();

}


/* =========================
   FINISH GAME
========================= */

function finishGame(title) {

    if (gameOver) {
        return;
    }

    gameOver = true;

    gameOverTitle.textContent =
        title;

    finalScore.textContent =
        score;

    gameOverScreen.style.display =
        "flex";

}


/* =========================
   RESTART
========================= */

function restartGame() {

    score = 0;

    health = 100;

    collected = 0;

    gameOver = false;

    player.x = 100;

    player.y = 250;

    createTreasures();

    createEnemies();

    scoreText.textContent = "0";

    healthText.textContent = "100";

    treasureText.textContent = "0 / 5";

    gameOverScreen.style.display =
        "none";

}


/* =========================
   MOBILE CONTROLS
========================= */

function setupButton(
    id,
    key
) {

    const button =
        document.getElementById(id);


    button.addEventListener(
        "pointerdown",
        function(e) {

            e.preventDefault();

            keys[key] = true;

        }
    );


    button.addEventListener(
        "pointerup",
        function(e) {

            e.preventDefault();

            keys[key] = false;

        }
    );


    button.addEventListener(
        "pointerleave",
        function() {

            keys[key] = false;

        }
    );


    button.addEventListener(
        "pointercancel",
        function() {

            keys[key] = false;

        }
    );

}


setupButton(
    "upBtn",
    "up"
);

setupButton(
    "downBtn",
    "down"
);

setupButton(
    "leftBtn",
    "left"
);

setupButton(
    "rightBtn",
    "right"
);


/* =========================
   RESTART BUTTON
========================= */

restartBtn.addEventListener(
    "click",
    restartGame
);


/* =========================
   GAME LOOP
========================= */

function gameLoop() {

    if (!gameOver) {

        updatePlayer();

        updateTreasures();

        updateEnemies();

    }

    draw();

    requestAnimationFrame(
        gameLoop
    );

}


/* =========================
   START
========================= */

restartGame();

gameLoop();