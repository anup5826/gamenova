const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let health = 100;
let gameOver = false;

const player = {
    x: 120,
    y: 375,
    w: 45,
    h: 75,
    speed: 6,
    attacking: false
};

let enemies = [];
const keys = {};

/* =========================
   KEYBOARD CONTROLS
========================= */

document.addEventListener("keydown", (e) => {

    const key = e.key.toLowerCase();

    keys[key] = true;

    // Stop browser scrolling
    if (
        key === "arrowleft" ||
        key === "arrowright" ||
        key === " " ||
        key === "arrowup" ||
        key === "arrowdown"
    ) {
        e.preventDefault();
    }

    // Attack
    if (e.code === "Space") {
        attack();
    }

    // Restart
    if (gameOver && key === "r") {
        restartGame();
    }
});


document.addEventListener("keyup", (e) => {

    const key = e.key.toLowerCase();

    keys[key] = false;
});


/* =========================
   ATTACK
========================= */

function attack() {

    if (gameOver) return;

    player.attacking = true;

    enemies.forEach(enemy => {

        const distance = Math.abs(enemy.x - player.x);

        if (distance < 120) {

            enemy.hp -= 50;

            if (enemy.hp <= 0 && !enemy.dead) {
                enemy.dead = true;
                score += 10;
            }
        }
    });

    setTimeout(() => {
        player.attacking = false;
    }, 180);
}


/* =========================
   SPAWN ENEMY
========================= */

function spawnEnemy() {

    if (gameOver) return;

    enemies.push({

        x: canvas.width + 50,

        y: 375,

        w: 45,

        h: 75,

        speed: 1.5 + Math.random() * 1.5,

        hp: 100,

        dead: false
    });
}


/* =========================
   ENEMY SPAWN TIMER
========================= */

setInterval(() => {

    if (!gameOver) {
        spawnEnemy();
    }

}, 1400);


/* =========================
   UPDATE GAME
========================= */

function update() {

    if (gameOver) return;


    /* PLAYER MOVEMENT */

    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {
        player.x -= player.speed;
    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {
        player.x += player.speed;
    }


    /* KEEP PLAYER INSIDE CANVAS */

    player.x = Math.max(
        20,
        Math.min(
            canvas.width - player.w - 20,
            player.x
        )
    );


    /* ENEMY MOVEMENT */

    enemies.forEach(enemy => {

        enemy.x -= enemy.speed;


        /* COLLISION WITH PLAYER */

        if (
            enemy.x < player.x + player.w &&
            enemy.x + enemy.w > player.x
        ) {

            health -= 1;

            enemy.x = canvas.width + 100;
        }


        /* REMOVE ENEMY IF FAR LEFT */

        if (enemy.x < -100) {
            enemy.dead = true;
        }

    });


    /* REMOVE DEAD ENEMIES */

    enemies = enemies.filter(
        enemy => !enemy.dead
    );


    /* GAME OVER */

    if (health <= 0) {

        health = 0;

        gameOver = true;
    }


    /* UPDATE UI */

    const scoreElement =
        document.getElementById("score");

    const healthElement =
        document.getElementById("health");


    if (scoreElement) {
        scoreElement.textContent = score;
    }


    if (healthElement) {
        healthElement.textContent = health;
    }
}


/* =========================
   BACKGROUND
========================= */

function drawBackground() {

    /* SKY */

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            canvas.height
        );

    gradient.addColorStop(
        0,
        "#070b20"
    );

    gradient.addColorStop(
        1,
        "#15152e"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* MOON */

    ctx.fillStyle = "#f5f1c7";

    ctx.beginPath();

    ctx.arc(
        750,
        90,
        45,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* MOON SHADOW */

    ctx.fillStyle = "#15152e";

    ctx.beginPath();

    ctx.arc(
        730,
        75,
        45,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* GROUND */

    ctx.fillStyle = "#101018";

    ctx.fillRect(
        0,
        450,
        canvas.width,
        100
    );


    /* GROUND LINE */

    ctx.strokeStyle = "#444";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(0, 450);

    ctx.lineTo(
        canvas.width,
        450
    );

    ctx.stroke();


    /* MOUNTAINS */

    ctx.fillStyle = "#0d1020";

    ctx.beginPath();

    ctx.moveTo(0, 450);

    ctx.lineTo(150, 250);

    ctx.lineTo(300, 450);

    ctx.closePath();

    ctx.fill();


    ctx.beginPath();

    ctx.moveTo(250, 450);

    ctx.lineTo(450, 220);

    ctx.lineTo(650, 450);

    ctx.closePath();

    ctx.fill();


    /* STARS */

    ctx.fillStyle = "#ffffff";

    const stars = [
        [80, 70],
        [180, 110],
        [300, 60],
        [420, 100],
        [550, 55],
        [650, 130],
        [850, 70]
    ];

    stars.forEach(star => {

        ctx.beginPath();

        ctx.arc(
            star[0],
            star[1],
            2,
            0,
            Math.PI * 2
        );

        ctx.fill();

    });
}


/* =========================
   DRAW NINJA
========================= */

function drawNinja(
    x,
    y,
    attacking
) {

    ctx.save();

    ctx.translate(x, y);


    /* SHADOW */

    ctx.fillStyle =
        "rgba(0,0,0,0.5)";

    ctx.beginPath();

    ctx.ellipse(
        22,
        76,
        30,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* LEGS */

    ctx.strokeStyle =
        "#17171f";

    ctx.lineWidth = 12;

    ctx.lineCap = "round";


    ctx.beginPath();

    ctx.moveTo(18, 52);

    ctx.lineTo(8, 72);

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(30, 52);

    ctx.lineTo(42, 72);

    ctx.stroke();


    /* BODY */

    ctx.fillStyle =
        "#202532";

    ctx.beginPath();

    ctx.moveTo(10, 25);

    ctx.lineTo(36, 25);

    ctx.lineTo(42, 55);

    ctx.lineTo(5, 55);

    ctx.closePath();

    ctx.fill();


    /* BELT */

    ctx.fillStyle =
        "#c8a84e";

    ctx.fillRect(
        7,
        45,
        34,
        6
    );


    /* HEAD */

    ctx.fillStyle =
        "#b87958";

    ctx.beginPath();

    ctx.arc(
        23,
        17,
        14,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* NINJA MASK */

    ctx.fillStyle =
        "#11131a";

    ctx.beginPath();

    ctx.arc(
        23,
        17,
        14,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillRect(
        10,
        17,
        27,
        9
    );


    /* EYES */

    ctx.fillStyle =
        "#ffffff";

    ctx.fillRect(
        15,
        17,
        5,
        3
    );

    ctx.fillRect(
        27,
        17,
        5,
        3
    );


    /* SCARF */

    ctx.fillStyle =
        "#9b1c31";

    ctx.beginPath();

    ctx.moveTo(10, 27);

    ctx.lineTo(-5, 36);

    ctx.lineTo(12, 35);

    ctx.closePath();

    ctx.fill();


    /* NORMAL ARM */

    ctx.strokeStyle =
        "#202532";

    ctx.lineWidth = 10;


    ctx.beginPath();

    ctx.moveTo(10, 30);

    ctx.lineTo(-2, 48);

    ctx.stroke();


    /* ATTACK ARM */

    ctx.beginPath();

    ctx.moveTo(36, 30);

    ctx.lineTo(
        attacking ? 72 : 48,
        25
    );

    ctx.stroke();


    /* SWORD */

    if (attacking) {

        ctx.strokeStyle =
            "#e9eef5";

        ctx.lineWidth = 5;

        ctx.beginPath();

        ctx.moveTo(65, 25);

        ctx.lineTo(105, 8);

        ctx.stroke();


        /* SWORD HANDLE */

        ctx.strokeStyle =
            "#c8a84e";

        ctx.lineWidth = 7;

        ctx.beginPath();

        ctx.moveTo(60, 27);

        ctx.lineTo(70, 22);

        ctx.stroke();
    }


    ctx.restore();
}


/* =========================
   DRAW ENEMY
========================= */

function drawEnemy(x, y) {

    ctx.save();

    ctx.translate(x, y);


    /* SHADOW */

    ctx.fillStyle =
        "rgba(0,0,0,0.5)";

    ctx.beginPath();

    ctx.ellipse(
        22,
        76,
        30,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* LEGS */

    ctx.strokeStyle =
        "#151515";

    ctx.lineWidth = 12;

    ctx.lineCap = "round";


    ctx.beginPath();

    ctx.moveTo(18, 52);

    ctx.lineTo(8, 72);

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(30, 52);

    ctx.lineTo(42, 72);

    ctx.stroke();


    /* BODY */

    ctx.fillStyle =
        "#451b25";

    ctx.fillRect(
        7,
        25,
        32,
        32
    );


    /* HEAD */

    ctx.fillStyle =
        "#7a4938";

    ctx.beginPath();

    ctx.arc(
        23,
        17,
        14,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* MASK */

    ctx.fillStyle =
        "#151515";

    ctx.fillRect(
        10,
        17,
        27,
        9
    );


    /* RED EYES */

    ctx.fillStyle =
        "#ff3333";

    ctx.fillRect(
        15,
        18,
        5,
        3
    );

    ctx.fillRect(
        27,
        18,
        5,
        3
    );


    /* ARM */

    ctx.strokeStyle =
        "#451b25";

    ctx.lineWidth = 10;

    ctx.beginPath();

    ctx.moveTo(10, 30);

    ctx.lineTo(-5, 48);

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(36, 30);

    ctx.lineTo(52, 48);

    ctx.stroke();


    /* SWORD */

    ctx.strokeStyle =
        "#cccccc";

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.moveTo(45, 48);

    ctx.lineTo(75, 25);

    ctx.stroke();


    ctx.restore();
}


/* =========================
   DRAW GAME
========================= */

function draw() {

    drawBackground();


    /* DRAW ENEMIES */

    enemies.forEach(enemy => {

        drawEnemy(
            enemy.x,
            enemy.y
        );

    });


    /* DRAW PLAYER */

    drawNinja(
        player.x,
        player.y,
        player.attacking
    );


    /* SCORE */

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "bold 24px Arial";

    ctx.fillText(
        "Score: " + score,
        20,
        35
    );


    /* HEALTH */

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "bold 20px Arial";

    ctx.fillText(
        "Health: " + health,
        20,
        65
    );


    /* CONTROL HELP */

    ctx.fillStyle =
        "rgba(255,255,255,0.7)";

    ctx.font =
        "14px Arial";

    ctx.fillText(
        "A / D or ← / → = Move",
        20,
        520
    );

    ctx.fillText(
        "SPACE = Attack",
        700,
        520
    );


    /* GAME OVER */

    if (gameOver) {

        ctx.fillStyle =
            "rgba(0,0,0,0.75)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle =
            "#ff3333";

        ctx.font =
            "bold 50px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "GAME OVER",
            canvas.width / 2,
            220
        );


        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "24px Arial";

        ctx.fillText(
            "Score: " + score,
            canvas.width / 2,
            270
        );


        ctx.font =
            "18px Arial";

        ctx.fillText(
            "Press R to Restart",
            canvas.width / 2,
            320
        );


        ctx.textAlign =
            "left";
    }
}


/* =========================
   RESTART
========================= */

function restartGame() {

    score = 0;

    health = 100;

    gameOver = false;

    player.x = 120;

    player.attacking = false;

    enemies = [];

    update();
}


/* =========================
   MOBILE BUTTON FUNCTIONS
========================= */

function moveLeft() {

    if (!gameOver) {
        player.x -= player.speed * 2;
    }
}


function moveRight() {

    if (!gameOver) {
        player.x += player.speed * 2;
    }
}


/* =========================
   CONNECT MOBILE BUTTONS
========================= */

const leftButton =
    document.getElementById("leftBtn");

const rightButton =
    document.getElementById("rightBtn");

const attackButton =
    document.getElementById("attackBtn");


if (leftButton) {

    leftButton.addEventListener(
        "pointerdown",
        (e) => {
            e.preventDefault();
            moveLeft();
        }
    );
}


if (rightButton) {

    rightButton.addEventListener(
        "pointerdown",
        (e) => {
            e.preventDefault();
            moveRight();
        }
    );
}


if (attackButton) {

    attackButton.addEventListener(
        "pointerdown",
        (e) => {
            e.preventDefault();
            attack();
        }
    );
}


/* =========================
   GAME LOOP
========================= */

function gameLoop() {

    update();

    draw();

    requestAnimationFrame(
        gameLoop
    );
}


/* =========================
   START GAME
========================= */

gameLoop();