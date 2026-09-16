/* =====================================================
   CYBER HUNTER
   GAMENOVA SPACE SHOOTER
   ===================================================== */


/* =====================================================
   CANVAS
===================================================== */

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


/* =====================================================
   GAME SIZE
===================================================== */

const GAME_WIDTH = 900;
const GAME_HEIGHT = 700;


/* =====================================================
   RESIZE
===================================================== */

function resizeCanvas() {

    const dpr =
        Math.min(window.devicePixelRatio || 1, 2);

    canvas.width =
        GAME_WIDTH * dpr;

    canvas.height =
        GAME_HEIGHT * dpr;

    canvas.style.aspectRatio =
        `${GAME_WIDTH} / ${GAME_HEIGHT}`;

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );
}


resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);


/* =====================================================
   DOM
===================================================== */

const scoreValue =
    document.getElementById("scoreValue");

const distanceValue =
    document.getElementById("distanceValue");

const enemyValue =
    document.getElementById("enemyValue");

const levelValue =
    document.getElementById("levelValue");

const healthBar =
    document.getElementById("healthBar");

const healthText =
    document.getElementById("healthText");

const startOverlay =
    document.getElementById("startOverlay");

const gameOverOverlay =
    document.getElementById("gameOverOverlay");

const pauseOverlay =
    document.getElementById("pauseOverlay");

const startButton =
    document.getElementById("startButton");

const restartButton =
    document.getElementById("restartButton");

const pauseButton =
    document.getElementById("pauseButton");

const resumeButton =
    document.getElementById("resumeButton");

const finalScore =
    document.getElementById("finalScore");

const finalDistance =
    document.getElementById("finalDistance");


/* =====================================================
   GAME STATE
===================================================== */

let gameRunning = false;
let gamePaused = false;

let score = 0;
let distance = 0;

let spawnTimer = 0;
let fireTimer = 0;

let lastTime = 0;

let shake = 0;


/* =====================================================
   PLAYER
===================================================== */

const player = {

    x: GAME_WIDTH / 2,

    y: GAME_HEIGHT - 120,

    width: 48,

    height: 72,

    speed: 6,

    health: 100,

    maxHealth: 100,

    shield: 0,

    boost: 100

};


/* =====================================================
   ARRAYS
===================================================== */

let enemies = [];
let bullets = [];
let enemyBullets = [];
let particles = [];
let stars = [];


/* =====================================================
   INPUT
===================================================== */

const keys = {};


/* Keyboard */

window.addEventListener(
    "keydown",
    event => {

        keys[event.key.toLowerCase()] = true;

        if (
            event.code === "Space" ||
            event.key === "ArrowUp" ||
            event.key === "ArrowDown" ||
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight"
        ) {
            event.preventDefault();
        }

    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[event.key.toLowerCase()] = false;

    }
);


/* =====================================================
   MOBILE INPUT
===================================================== */

let touchLeft = false;
let touchRight = false;
let touchFire = false;


function setupHoldButton(
    element,
    setter
) {

    element.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            setter(true);

        }
    );


    element.addEventListener(
        "pointerup",
        event => {

            event.preventDefault();

            setter(false);

        }
    );


    element.addEventListener(
        "pointercancel",
        () => {
            setter(false);
        }
    );


    element.addEventListener(
        "pointerleave",
        () => {
            setter(false);
        }
    );

}


setupHoldButton(
    document.getElementById("leftButton"),
    value => touchLeft = value
);


setupHoldButton(
    document.getElementById("rightButton"),
    value => touchRight = value
);


setupHoldButton(
    document.getElementById("fireButton"),
    value => touchFire = value
);


/* =====================================================
   STARS
===================================================== */

function createStars() {

    stars = [];

    for (
        let i = 0;
        i < 140;
        i++
    ) {

        stars.push({

            x: Math.random() * GAME_WIDTH,

            y: Math.random() * GAME_HEIGHT,

            size:
                Math.random() * 2 + 0.5,

            speed:
                Math.random() * 2 + 0.5,

            alpha:
                Math.random() * 0.8 + 0.2

        });

    }

}


createStars();


/* =====================================================
   RESET GAME
===================================================== */

function resetGame() {

    score = 0;
    distance = 0;

    spawnTimer = 0;
    fireTimer = 0;

    shake = 0;

    enemies = [];
    bullets = [];
    enemyBullets = [];
    particles = [];

    player.x =
        GAME_WIDTH / 2;

    player.y =
        GAME_HEIGHT - 120;

    player.health =
        player.maxHealth;

    player.shield = 0;

    player.boost = 100;

    gamePaused = false;

    updateHUD();

}


/* =====================================================
   START GAME
===================================================== */

function startGame() {

    resetGame();

    gameRunning = true;

    startOverlay.classList.add(
        "hidden"
    );

    gameOverOverlay.classList.add(
        "hidden"
    );

    pauseOverlay.classList.add(
        "hidden"
    );

    lastTime =
        performance.now();

    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   GAME OVER
===================================================== */

function gameOver() {

    gameRunning = false;

    gamePaused = false;

    finalScore.textContent =
        score;

    finalDistance.textContent =
        Math.floor(distance) + " m";

    gameOverOverlay.classList.remove(
        "hidden"
    );

}


/* =====================================================
   PAUSE
===================================================== */

function togglePause() {

    if (!gameRunning) {
        return;
    }

    gamePaused =
        !gamePaused;


    if (gamePaused) {

        pauseOverlay.classList.remove(
            "hidden"
        );

        pauseButton.textContent =
            "▶ RESUME";

    } else {

        pauseOverlay.classList.add(
            "hidden"
        );

        pauseButton.textContent =
            "⏸ PAUSE";

        lastTime =
            performance.now();

    }

}


pauseButton.addEventListener(
    "click",
    togglePause
);


resumeButton.addEventListener(
    "click",
    togglePause
);


startButton.addEventListener(
    "click",
    startGame
);


restartButton.addEventListener(
    "click",
    startGame
);


/* =====================================================
   DIFFICULTY
===================================================== */

function getDifficulty() {

    const level =
        Math.floor(
            distance / 1200
        ) + 1;


    return {

        level:
            Math.min(level, 10),

        enemySpeed:
            Math.min(
                2.2 +
                distance * 0.00035,
                6
            ),

        spawnRate:
            Math.max(
                58 -
                distance * 0.0025,
                22
            ),

        maxEnemies:
            Math.min(
                3 +
                Math.floor(distance / 1800),
                10
            )

    };

}


/* =====================================================
   CREATE ENEMY
===================================================== */

function createEnemy() {

    const difficulty =
        getDifficulty();


    const boss =
        distance > 3500 &&
        Math.random() < 0.10;


    const width =
        boss ? 95 : 54;

    const height =
        boss ? 82 : 58;


    const x =
        100 +
        Math.random() *
        (GAME_WIDTH - 200);


    enemies.push({

        x: x,

        y: -height - 20,

        width: width,

        height: height,

        speed:
            difficulty.enemySpeed +
            Math.random() * 1.4,

        hp:
            boss ? 6 : 1,

        maxHp:
            boss ? 6 : 1,

        boss: boss,

        shootTimer:
            70 +
            Math.random() * 100,

        phase:
            Math.random() *
            Math.PI * 2,

        hitFlash: 0

    });

}


/* =====================================================
   ENEMY COLOR
===================================================== */

function enemyColor() {

    const colors = [

        "#ff2bd6",
        "#ff416c",
        "#9b5cff",
        "#ff7a18"

    ];

    return colors[
        Math.floor(
            Math.random() *
            colors.length
        )
    ];

}


/* =====================================================
   FIRE BULLET
===================================================== */

function fireBullet() {

    let target = null;

    let nearestDistance =
        Infinity;


    for (const enemy of enemies) {

        if (enemy.y > GAME_HEIGHT) {
            continue;
        }


        const dx =
            enemy.x -
            player.x;

        const dy =
            enemy.y -
            player.y;

        const d =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (d < nearestDistance) {

            nearestDistance = d;

            target = enemy;

        }

    }


    let vx = 0;
    let vy = -10;


    if (target) {

        const dx =
            target.x -
            player.x;

        const dy =
            target.y -
            player.y;

        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        vx =
            (dx / length) * 9;

        vy =
            (dy / length) * 9;

    }


    bullets.push({

        x: player.x,

        y: player.y - 35,

        vx: vx,

        vy: vy,

        radius: 4,

        damage: 1

    });

}


/* =====================================================
   ENEMY FIRE
===================================================== */

function enemyFire(enemy) {

    const dx =
        player.x -
        enemy.x;

    const dy =
        player.y -
        enemy.y;

    const length =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    const speed =
        enemy.boss ? 4.2 : 3.2;


    enemyBullets.push({

        x: enemy.x,

        y: enemy.y + enemy.height / 2,

        vx:
            (dx / length) * speed,

        vy:
            (dy / length) * speed,

        radius:
            enemy.boss ? 6 : 4

    });

}


/* =====================================================
   PLAYER MOVEMENT
===================================================== */

function updatePlayer(delta) {

    let dx = 0;
    let dy = 0;


    if (
        keys["arrowleft"] ||
        keys["a"] ||
        touchLeft
    ) {
        dx -= 1;
    }


    if (
        keys["arrowright"] ||
        keys["d"] ||
        touchRight
    ) {
        dx += 1;
    }


    if (
        keys["arrowup"] ||
        keys["w"]
    ) {
        dy -= 1;
    }


    if (
        keys["arrowdown"] ||
        keys["s"]
    ) {
        dy += 1;
    }


    const boost =
        keys["shift"] &&
        player.boost > 0;


    const speed =
        boost ? 10 : player.speed;


    if (dx !== 0) {

        player.x +=
            dx * speed;

    }


    if (dy !== 0) {

        player.y +=
            dy * speed;

    }


    if (boost) {

        player.boost =
            Math.max(
                0,
                player.boost -
                0.6 * delta
            );

    } else {

        player.boost =
            Math.min(
                100,
                player.boost +
                0.15 * delta
            );

    }


    /* Bounds */

    const marginX = 55;
    const marginY = 80;


    player.x =
        Math.max(
            marginX,
            Math.min(
                GAME_WIDTH - marginX,
                player.x
            )
        );


    player.y =
        Math.max(
            170,
            Math.min(
                GAME_HEIGHT - marginY,
                player.y
            )
        );

}


/* =====================================================
   AUTO FIRE
===================================================== */

function updateAutoFire(delta) {

    fireTimer -= delta;


    const shooting =
        keys[" "] ||
        keys["enter"] ||
        touchFire;


    /*
       Automatic firing is always active.
       Holding Space / FIRE makes it faster.
    */

    const fireSpeed =
        shooting ? 7 : 13;


    if (fireTimer <= 0) {

        fireBullet();

        fireTimer =
            fireSpeed;

    }

}


/* =====================================================
   UPDATE BULLETS
===================================================== */

function updateBullets(delta) {

    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        const bullet =
            bullets[i];


        bullet.x +=
            bullet.vx * delta;

        bullet.y +=
            bullet.vy * delta;


        if (
            bullet.x < -30 ||
            bullet.x > GAME_WIDTH + 30 ||
            bullet.y < -30 ||
            bullet.y > GAME_HEIGHT + 30
        ) {

            bullets.splice(i, 1);

        }

    }

}


/* =====================================================
   UPDATE ENEMY BULLETS
===================================================== */

function updateEnemyBullets(delta) {

    for (
        let i = enemyBullets.length - 1;
        i >= 0;
        i--
    ) {

        const bullet =
            enemyBullets[i];


        bullet.x +=
            bullet.vx * delta;

        bullet.y +=
            bullet.vy * delta;


        if (
            bullet.x < -50 ||
            bullet.x > GAME_WIDTH + 50 ||
            bullet.y < -50 ||
            bullet.y > GAME_HEIGHT + 50
        ) {

            enemyBullets.splice(i, 1);

        }

    }

}


/* =====================================================
   UPDATE ENEMIES
===================================================== */

function updateEnemies(delta) {

    const difficulty =
        getDifficulty();


    for (
        let i = enemies.length - 1;
        i >= 0;
        i--
    ) {

        const enemy =
            enemies[i];


        enemy.y +=
            enemy.speed * delta;


        /*
           Smooth horizontal movement
        */

        enemy.x +=
            Math.sin(
                distance * 0.02 +
                enemy.phase
            ) *
            0.7 *
            delta;


        enemy.x =
            Math.max(
                60,
                Math.min(
                    GAME_WIDTH - 60,
                    enemy.x
                )
            );


        /*
           Enemy shooting
        */

        enemy.shootTimer -=
            delta;


        if (
            enemy.shootTimer <= 0 &&
            enemy.y > 50 &&
            enemy.y < GAME_HEIGHT - 150
        ) {

            enemyFire(enemy);

            enemy.shootTimer =
                enemy.boss
                    ? 55 + Math.random() * 60
                    : 100 + Math.random() * 120;

        }


        if (enemy.hitFlash > 0) {

            enemy.hitFlash -= delta;

        }


        /*
           Enemy escaped
        */

        if (
            enemy.y >
            GAME_HEIGHT + 120
        ) {

            enemies.splice(i, 1);

            continue;

        }

    }


    /*
       Spawn enemies
    */

    spawnTimer -= delta;


    if (
        spawnTimer <= 0 &&
        enemies.length <
        difficulty.maxEnemies
    ) {

        createEnemy();

        spawnTimer =
            difficulty.spawnRate;

    }

}


/* =====================================================
   COLLISION HELPER
===================================================== */

function circleRectCollision(
    circle,
    rect
) {

    const closestX =
        Math.max(
            rect.x - rect.width / 2,
            Math.min(
                circle.x,
                rect.x + rect.width / 2
            )
        );


    const closestY =
        Math.max(
            rect.y - rect.height / 2,
            Math.min(
                circle.y,
                rect.y + rect.height / 2
            )
        );


    const dx =
        circle.x -
        closestX;

    const dy =
        circle.y -
        closestY;


    return (
        dx * dx +
        dy * dy
        <
        circle.radius *
        circle.radius
    );

}


/* =====================================================
   BULLET VS ENEMY
===================================================== */

function bulletEnemyCollision() {

    for (
        let b = bullets.length - 1;
        b >= 0;
        b--
    ) {

        const bullet =
            bullets[b];


        for (
            let e = enemies.length - 1;
            e >= 0;
            e--
        ) {

            const enemy =
                enemies[e];


            const dx =
                bullet.x -
                enemy.x;

            const dy =
                bullet.y -
                enemy.y;


            const hitDistance =
                enemy.boss
                    ? 48
                    : 32;


            if (
                dx * dx +
                dy * dy
                <
                hitDistance *
                hitDistance
            ) {

                enemy.hp -=
                    bullet.damage;

                enemy.hitFlash =
                    6;


                createParticles(
                    enemy.x,
                    enemy.y,
                    enemy.boss
                        ? 12
                        : 7
                );


                bullets.splice(
                    b,
                    1
                );


                if (
                    enemy.hp <= 0
                ) {

                    score +=
                        enemy.boss
                            ? 500
                            : 100;


                    createParticles(
                        enemy.x,
                        enemy.y,
                        enemy.boss
                            ? 30
                            : 18
                    );


                    enemies.splice(
                        e,
                        1
                    );

                }


                break;

            }

        }

    }

}


/* =====================================================
   PLAYER VS ENEMY BULLETS
===================================================== */

function playerBulletCollision() {

    for (
        let i = enemyBullets.length - 1;
        i >= 0;
        i--
    ) {

        const bullet =
            enemyBullets[i];


        const dx =
            bullet.x -
            player.x;

        const dy =
            bullet.y -
            player.y;


        if (
            dx * dx +
            dy * dy
            <
            32 * 32
        ) {

            damagePlayer(
                8
            );


            enemyBullets.splice(
                i,
                1
            );

        }

    }

}


/* =====================================================
   PLAYER VS ENEMY
===================================================== */

function playerEnemyCollision() {

    for (
        let i = enemies.length - 1;
        i >= 0;
        i--
    ) {

        const enemy =
            enemies[i];


        const dx =
            enemy.x -
            player.x;

        const dy =
            enemy.y -
            player.y;


        const collisionDistance =
            enemy.boss
                ? 62
                : 45;


        if (
            dx * dx +
            dy * dy
            <
            collisionDistance *
            collisionDistance
        ) {

            damagePlayer(
                enemy.boss
                    ? 25
                    : 18
            );


            createParticles(
                enemy.x,
                enemy.y,
                14
            );


            enemies.splice(
                i,
                1
            );

        }

    }

}


/* =====================================================
   DAMAGE PLAYER
===================================================== */

function damagePlayer(amount) {

    /*
       Shield absorbs first.
    */

    if (player.shield > 0) {

        const absorbed =
            Math.min(
                player.shield,
                amount
            );

        player.shield -=
            absorbed;

        amount -=
            absorbed;

    }


    if (amount > 0) {

        player.health =
            Math.max(
                0,
                player.health -
                amount
            );

    }


    shake = 10;


    createParticles(
        player.x,
        player.y,
        10
    );


    updateHealth();


    if (
        player.health <= 0
    ) {

        gameOver();

    }

}


/* =====================================================
   PARTICLES
===================================================== */

function createParticles(
    x,
    y,
    amount
) {

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI * 2;


        const speed =
            Math.random() *
            4 + 1;


        particles.push({

            x: x,

            y: y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            life:
                25 +
                Math.random() * 25,

            maxLife:
                50,

            size:
                Math.random() *
                4 + 1

        });

    }

}


/* =====================================================
   UPDATE PARTICLES
===================================================== */

function updateParticles(delta) {

    for (
        let i = particles.length - 1;
        i >= 0;
        i--
    ) {

        const p =
            particles[i];


        p.x +=
            p.vx * delta;

        p.y +=
            p.vy * delta;


        p.vx *=
            0.97;

        p.vy *=
            0.97;


        p.life -=
            delta;


        if (
            p.life <= 0
        ) {

            particles.splice(
                i,
                1
            );

        }

    }

}


/* =====================================================
   UPDATE STARS
===================================================== */

function updateStars(delta) {

    for (const star of stars) {

        star.y +=
            star.speed * delta;


        if (
            star.y >
            GAME_HEIGHT
        ) {

            star.y = 0;

            star.x =
                Math.random() *
                GAME_WIDTH;

        }

    }

}


/* =====================================================
   UPDATE DISTANCE
===================================================== */

function updateDistance(delta) {

    distance +=
        0.55 * delta;

}


/* =====================================================
   UPDATE HEALTH UI
===================================================== */

function updateHealth() {

    const percentage =
        Math.max(
            0,
            player.health /
            player.maxHealth *
            100
        );


    healthBar.style.width =
        percentage + "%";


    healthText.textContent =
        `${Math.ceil(player.health)} / ${player.maxHealth}`;

}


/* =====================================================
   UPDATE HUD
===================================================== */

function updateHUD() {

    const difficulty =
        getDifficulty();


    scoreValue.textContent =
        score;


    distanceValue.textContent =
        Math.floor(distance) +
        " m";


    enemyValue.textContent =
        enemies.length;


    levelValue.textContent =
        difficulty.level;


    updateHealth();

}


/* =====================================================
   DRAW BACKGROUND
===================================================== */

function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            GAME_HEIGHT
        );


    gradient.addColorStop(
        0,
        "#02030a"
    );

    gradient.addColorStop(
        0.5,
        "#070b19"
    );

    gradient.addColorStop(
        1,
        "#04050e"
    );


    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    /*
       Space grid
    */

    ctx.strokeStyle =
        "rgba(0,229,255,0.035)";

    ctx.lineWidth = 1;


    const gridSize = 50;


    for (
        let x = 0;
        x < GAME_WIDTH;
        x += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            GAME_HEIGHT
        );

        ctx.stroke();

    }


    for (
        let y = 0;
        y < GAME_HEIGHT;
        y += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            GAME_WIDTH,
            y
        );

        ctx.stroke();

    }


    /*
       Stars
    */

    for (const star of stars) {

        ctx.globalAlpha =
            star.alpha;

        ctx.fillStyle =
            "#b9f8ff";

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    ctx.globalAlpha = 1;

}


/* =====================================================
   DRAW PLAYER SPACESHIP
===================================================== */

function drawPlayer() {

    ctx.save();

    ctx.translate(
        player.x,
        player.y
    );


    /*
       Engine glow
    */

    const engineGradient =
        ctx.createRadialGradient(
            0,
            42,
            2,
            0,
            42,
            32
        );


    engineGradient.addColorStop(
        0,
        "rgba(0,229,255,0.9)"
    );

    engineGradient.addColorStop(
        1,
        "rgba(0,229,255,0)"
    );


    ctx.fillStyle =
        engineGradient;

    ctx.beginPath();

    ctx.arc(
        0,
        42,
        32,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
       Engine flame
    */

    ctx.fillStyle =
        "#00e5ff";

    ctx.beginPath();

    ctx.moveTo(
        -10,
        28
    );

    ctx.lineTo(
        0,
        60 +
        Math.random() * 10
    );

    ctx.lineTo(
        10,
        28
    );

    ctx.closePath();

    ctx.fill();


    /*
       Main ship body
    */

    const bodyGradient =
        ctx.createLinearGradient(
            -25,
            -35,
            25,
            35
        );


    bodyGradient.addColorStop(
        0,
        "#bffcff"
    );

    bodyGradient.addColorStop(
        0.25,
        "#00e5ff"
    );

    bodyGradient.addColorStop(
        0.65,
        "#147b9d"
    );

    bodyGradient.addColorStop(
        1,
        "#07192d"
    );


    ctx.fillStyle =
        bodyGradient;

    ctx.beginPath();

    ctx.moveTo(
        0,
        -48
    );

    ctx.lineTo(
        21,
        -10
    );

    ctx.lineTo(
        28,
        32
    );

    ctx.lineTo(
        10,
        25
    );

    ctx.lineTo(
        0,
        42
    );

    ctx.lineTo(
        -10,
        25
    );

    ctx.lineTo(
        -28,
        32
    );

    ctx.lineTo(
        -21,
        -10
    );

    ctx.closePath();

    ctx.fill();


    /*
       Wings
    */

    ctx.fillStyle =
        "#0c334b";

    ctx.strokeStyle =
        "#00e5ff";

    ctx.lineWidth = 2;


    ctx.beginPath();

    ctx.moveTo(
        -18,
        0
    );

    ctx.lineTo(
        -48,
        27
    );

    ctx.lineTo(
        -24,
        22
    );

    ctx.closePath();

    ctx.fill();

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        18,
        0
    );

    ctx.lineTo(
        48,
        27
    );

    ctx.lineTo(
        24,
        22
    );

    ctx.closePath();

    ctx.fill();

    ctx.stroke();


    /*
       Cockpit
    */

    const cockpit =
        ctx.createLinearGradient(
            0,
            -35,
            0,
            0
        );


    cockpit.addColorStop(
        0,
        "#ffffff"
    );

    cockpit.addColorStop(
        0.3,
        "#67f4ff"
    );

    cockpit.addColorStop(
        1,
        "#074d6b"
    );


    ctx.fillStyle =
        cockpit;


    ctx.beginPath();

    ctx.moveTo(
        0,
        -35
    );

    ctx.lineTo(
        11,
        -5
    );

    ctx.lineTo(
        0,
        4
    );

    ctx.lineTo(
        -11,
        -5
    );

    ctx.closePath();

    ctx.fill();


    /*
       Weapon glow
    */

    ctx.fillStyle =
        "#ff2bd6";

    ctx.shadowColor =
        "#ff2bd6";

    ctx.shadowBlur = 15;


    ctx.fillRect(
        -22,
        20,
        6,
        12
    );


    ctx.fillRect(
        16,
        20,
        6,
        12
    );


    ctx.shadowBlur = 0;


    /*
       Shield
    */

    if (player.shield > 0) {

        ctx.strokeStyle =
            "rgba(0,229,255,0.55)";

        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            55,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }


    ctx.restore();

}


/* =====================================================
   DRAW ENEMY
===================================================== */

function drawEnemy(enemy) {

    ctx.save();

    ctx.translate(
        enemy.x,
        enemy.y
    );


    if (enemy.boss) {

        drawBoss(enemy);

    } else {

        drawNormalEnemy(enemy);

    }


    ctx.restore();

}


/* =====================================================
   NORMAL ENEMY
===================================================== */

function drawNormalEnemy(enemy) {

    const color =
        enemy.hitFlash > 0
            ? "#ffffff"
            : enemyColor();


    /*
       Glow
    */

    ctx.shadowColor =
        color;

    ctx.shadowBlur = 18;


    /*
       Main body
    */

    ctx.fillStyle =
        "#170c27";

    ctx.strokeStyle =
        color;

    ctx.lineWidth = 2;


    ctx.beginPath();

    ctx.moveTo(
        0,
        -29
    );

    ctx.lineTo(
        27,
        10
    );

    ctx.lineTo(
        16,
        26
    );

    ctx.lineTo(
        0,
        18
    );

    ctx.lineTo(
        -16,
        26
    );

    ctx.lineTo(
        -27,
        10
    );

    ctx.closePath();

    ctx.fill();

    ctx.stroke();


    /*
       Enemy core
    */

    ctx.fillStyle =
        color;

    ctx.beginPath();

    ctx.arc(
        0,
        2,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
       Side weapons
    */

    ctx.fillStyle =
        "#33113e";

    ctx.fillRect(
        -31,
        13,
        8,
        18
    );

    ctx.fillRect(
        23,
        13,
        8,
        18
    );


    ctx.shadowBlur = 0;

}


/* =====================================================
   BOSS
===================================================== */

function drawBoss(enemy) {

    const color =
        enemy.hitFlash > 0
            ? "#ffffff"
            : "#ff1744";


    ctx.shadowColor =
        color;

    ctx.shadowBlur = 30;


    /*
       Boss wings
    */

    ctx.fillStyle =
        "#250816";

    ctx.strokeStyle =
        color;

    ctx.lineWidth = 3;


    ctx.beginPath();

    ctx.moveTo(
        0,
        -42
    );

    ctx.lineTo(
        50,
        10
    );

    ctx.lineTo(
        35,
        36
    );

    ctx.lineTo(
        10,
        25
    );

    ctx.lineTo(
        0,
        45
    );

    ctx.lineTo(
        -10,
        25
    );

    ctx.lineTo(
        -35,
        36
    );

    ctx.lineTo(
        -50,
        10
    );

    ctx.closePath();

    ctx.fill();

    ctx.stroke();


    /*
       Boss core
    */

    ctx.fillStyle =
        color;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        13,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
       Boss eyes
    */

    ctx.fillStyle =
        "#ffffff";

    ctx.fillRect(
        -23,
        -4,
        13,
        5
    );

    ctx.fillRect(
        10,
        -4,
        13,
        5
    );


    /*
       Boss health bar
    */

    ctx.shadowBlur = 0;


    const barWidth = 90;

    ctx.fillStyle =
        "rgba(0,0,0,0.7)";

    ctx.fillRect(
        -barWidth / 2,
        -58,
        barWidth,
        6
    );


    ctx.fillStyle =
        "#ff1744";

    ctx.fillRect(
        -barWidth / 2,
        -58,
        barWidth *
        (enemy.hp / enemy.maxHp),
        6
    );

}


/* =====================================================
   DRAW PLAYER BULLETS
===================================================== */

function drawBullets() {

    for (const bullet of bullets) {

        ctx.save();

        ctx.strokeStyle =
            "#00e5ff";

        ctx.shadowColor =
            "#00e5ff";

        ctx.shadowBlur = 15;

        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.moveTo(
            bullet.x -
            bullet.vx * 0.5,
            bullet.y -
            bullet.vy * 0.5
        );

        ctx.lineTo(
            bullet.x,
            bullet.y
        );

        ctx.stroke();

        ctx.restore();

    }

}


/* =====================================================
   DRAW ENEMY BULLETS
===================================================== */

function drawEnemyBullets() {

    for (
        const bullet
        of enemyBullets
    ) {

        ctx.save();

        ctx.fillStyle =
            "#ff2bd6";

        ctx.shadowColor =
            "#ff2bd6";

        ctx.shadowBlur = 15;

        ctx.beginPath();

        ctx.arc(
            bullet.x,
            bullet.y,
            bullet.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();

    }

}


/* =====================================================
   DRAW PARTICLES
===================================================== */

function drawParticles() {

    for (const p of particles) {

        const alpha =
            Math.max(
                0,
                p.life /
                p.maxLife
            );


        ctx.globalAlpha =
            alpha;


        ctx.fillStyle =
            "#00e5ff";


        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    ctx.globalAlpha = 1;

}


/* =====================================================
   DRAW CROSSHAIR
===================================================== */

function drawTargetIndicator() {

    let target = null;

    let nearest =
        Infinity;


    for (const enemy of enemies) {

        const dx =
            enemy.x -
            player.x;

        const dy =
            enemy.y -
            player.y;


        const d =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            d < nearest &&
            enemy.y > 0 &&
            enemy.y < GAME_HEIGHT
        ) {

            nearest = d;

            target = enemy;

        }

    }


    if (!target) {
        return;
    }


    ctx.save();

    ctx.strokeStyle =
        "rgba(255,43,214,0.45)";

    ctx.lineWidth = 1;

    ctx.setLineDash([
        5,
        7
    ]);


    ctx.beginPath();

    ctx.moveTo(
        player.x,
        player.y - 35
    );

    ctx.lineTo(
        target.x,
        target.y
    );

    ctx.stroke();


    ctx.setLineDash([]);


    ctx.beginPath();

    ctx.arc(
        target.x,
        target.y,
        target.boss
            ? 55
            : 35,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    ctx.restore();

}


/* =====================================================
   DRAW EVERYTHING
===================================================== */

function draw() {

    ctx.save();


    if (shake > 0) {

        ctx.translate(
            (Math.random() - 0.5) *
            shake,

            (Math.random() - 0.5) *
            shake
        );

    }


    drawBackground();

    drawTargetIndicator();

    drawBullets();

    drawEnemyBullets();


    for (
        const enemy
        of enemies
    ) {

        drawEnemy(enemy);

    }


    drawPlayer();

    drawParticles();


    ctx.restore();


    if (shake > 0) {

        shake *= 0.88;

        if (shake < 0.2) {
            shake = 0;
        }

    }

}


/* =====================================================
   GAME UPDATE
===================================================== */

function update(delta) {

    updatePlayer(delta);

    updateAutoFire(delta);

    updateBullets(delta);

    updateEnemyBullets(delta);

    updateEnemies(delta);

    bulletEnemyCollision();

    playerBulletCollision();

    playerEnemyCollision();

    updateParticles(delta);

    updateStars(delta);

    updateDistance(delta);

    updateHUD();

}


/* =====================================================
   GAME LOOP
===================================================== */

function gameLoop(timestamp) {

    if (!gameRunning) {

        draw();

        return;

    }


    if (gamePaused) {

        draw();

        requestAnimationFrame(
            gameLoop
        );

        return;

    }


    let delta =
        (timestamp - lastTime) /
        16.67;


    delta =
        Math.min(
            delta,
            2
        );


    lastTime =
        timestamp;


    update(delta);

    draw();


    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   INITIAL DRAW
===================================================== */

draw();


console.log(
    "🚀 Cyber Hunter loaded successfully."
);