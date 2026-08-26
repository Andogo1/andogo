const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;


/* =========================
   VARIABLES
========================= */

let selectedCharacter = "ana";

let playing = false;

let score = 0;
let lives = 3;

let player = null;

let objects = [];
let particles = [];

let gameTime = 0;
let spawnTimer = 0;
let lastTime = 0;


/* A/D და ა/დ */

let keys = {
    left: false,
    right: false
};


/* =========================
   CHARACTER SELECT
========================= */

document.querySelectorAll(".character").forEach(button => {

    button.addEventListener("click", function () {

        selectedCharacter = this.dataset.character;

        document
            .querySelectorAll(".character")
            .forEach(b => {
                b.classList.remove("selected");
            });

        this.classList.add("selected");

    });

});


/* =========================
   KEYBOARD
========================= */

document.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();

    if (
        event.code === "KeyA" ||
        key === "ა"
    ) {

        keys.left = true;

        event.preventDefault();

    }

    if (
        event.code === "KeyD" ||
        key === "დ"
    ) {

        keys.right = true;

        event.preventDefault();

    }

});


document.addEventListener("keyup", function(event) {

    const key = event.key.toLowerCase();

    if (
        event.code === "KeyA" ||
        key === "ა"
    ) {

        keys.left = false;

        event.preventDefault();

    }

    if (
        event.code === "KeyD" ||
        key === "დ"
    ) {

        keys.right = false;

        event.preventDefault();

    }

});


/* =========================
   MOBILE BUTTONS
========================= */

const leftBtn =
    document.getElementById("leftBtn");

const rightBtn =
    document.getElementById("rightBtn");


leftBtn.addEventListener("touchstart", function(event) {

    event.preventDefault();

    keys.left = true;

});

leftBtn.addEventListener("touchend", function(event) {

    event.preventDefault();

    keys.left = false;

});

rightBtn.addEventListener("touchstart", function(event) {

    event.preventDefault();

    keys.right = true;

});

rightBtn.addEventListener("touchend", function(event) {

    event.preventDefault();

    keys.right = false;

});


leftBtn.addEventListener("mousedown", function() {
    keys.left = true;
});

leftBtn.addEventListener("mouseup", function() {
    keys.left = false;
});

rightBtn.addEventListener("mousedown", function() {
    keys.right = true;
});

rightBtn.addEventListener("mouseup", function() {
    keys.right = false;
});


/* =========================
   START BUTTON
========================= */

document
    .getElementById("startBtn")
    .addEventListener("click", startGame);

document
    .getElementById("againBtn")
    .addEventListener("click", startGame);


/* =========================
   START GAME
========================= */

function startGame() {

    score = 0;

    lives = 3;

    gameTime = 0;

    spawnTimer = 0;

    objects = [];

    particles = [];

    keys.left = false;
    keys.right = false;

    player = {

        x: W / 2,

        y: H - 60,

        size: 44

    };

    playing = true;

    document
        .getElementById("score")
        .textContent = score;

    document
        .getElementById("lives")
        .textContent = lives;

    showScreen("gameScreen");

    lastTime = performance.now();

    requestAnimationFrame(gameLoop);

}


/* =========================
   SCREEN
========================= */

function showScreen(id) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove("active");

        });

    document
        .getElementById(id)
        .classList.add("active");

}


/* =========================
   PLAYER LIMIT
========================= */

function keepPlayerInside() {

    player.x = Math.max(
        30,
        Math.min(W - 30, player.x)
    );

}


/* =========================
   SPAWN OBJECT
========================= */

function spawnObject() {

    const meteorChance =
        Math.min(
            0.20 + gameTime * 0.006,
            0.65
        );

    const isMeteor =
        Math.random() < meteorChance;

    const extraSpeed =
        Math.min(
            gameTime * 4,
            300
        );

    objects.push({

        x:
            35 +
            Math.random() *
            (W - 70),

        y: -35,

        size:
            isMeteor
                ? 23
                : 18,

        speed:
            isMeteor
                ? 190 +
                  Math.random() * 100 +
                  extraSpeed
                : 150 +
                  Math.random() * 70 +
                  extraSpeed * 0.4,

        type:
            isMeteor
                ? "meteor"
                : "star",

        rotation:
            Math.random() *
            Math.PI *
            2

    });

}


/* =========================
   PARTICLES
========================= */

function createParticles(x, y, type) {

    for (let i = 0; i < 15; i++) {

        particles.push({

            x: x,

            y: y,

            vx:
                (Math.random() - 0.5) *
                200,

            vy:
                (Math.random() - 0.5) *
                200,

            life:
                0.5 +
                Math.random() *
                0.5,

            type: type

        });

    }

}


/* =========================
   UPDATE
========================= */

function update(dt) {

    gameTime += dt;

    let direction = 0;

    if (keys.left) {
        direction = -1;
    }

    if (keys.right) {
        direction = 1;
    }

    const playerSpeed =
        Math.min(
            400 +
            gameTime * 1.5,
            520
        );

    player.x +=
        direction *
        playerSpeed *
        dt;

    keepPlayerInside();


    /* SPAWN */

    spawnTimer += dt;

    const spawnDelay =
        Math.max(
            0.16,
            0.60 -
            gameTime * 0.004
        );

    if (spawnTimer >= spawnDelay) {

        let amount = 1;

        if (gameTime >= 20) {
            amount = 2;
        }

        if (gameTime >= 45) {
            amount = 3;
        }

        if (gameTime >= 75) {
            amount = 4;
        }

        for (let i = 0; i < amount; i++) {

            spawnObject();

        }

        spawnTimer = 0;

    }


    /* OBJECTS */

    for (
        let i = objects.length - 1;
        i >= 0;
        i--
    ) {

        const object = objects[i];

        object.y +=
            object.speed *
            dt;

        object.rotation +=
            dt * 3;

        const distanceX =
            Math.abs(
                object.x -
                player.x
            );

        const distanceY =
            Math.abs(
                object.y -
                player.y
            );


        /* COLLISION */

        if (
            distanceX <
                object.size + 22 &&
            distanceY <
                object.size + 22
        ) {

            /* STAR */

            if (
                object.type === "star"
            ) {

                score += 10;

                document
                    .getElementById("score")
                    .textContent = score;

                createParticles(
                    object.x,
                    object.y,
                    "star"
                );

            }


            /* METEOR */

            else {

                lives--;

                document
                    .getElementById("lives")
                    .textContent = lives;

                createParticles(
                    object.x,
                    object.y,
                    "meteor"
                );

                if (lives <= 0) {

                    endGame(
                        "მეტეორმა დაგიჭირა! ☄️",
                        "კიდევ ერთხელ სცადე და მეტი ვარსკვლავი შეაგროვე!"
                    );

                    return;

                }

            }

            objects.splice(i, 1);

        }

        else if (
            object.y >
            H + 50
        ) {

            objects.splice(i, 1);

        }

    }


    /* PARTICLES */

    for (
        let i = particles.length - 1;
        i >= 0;
        i--
    ) {

        const particle =
            particles[i];

        particle.x +=
            particle.vx *
            dt;

        particle.y +=
            particle.vy *
            dt;

        particle.vy +=
            100 *
            dt;

        particle.life -= dt;

        if (
            particle.life <= 0
        ) {

            particles.splice(i, 1);

        }

    }

}


/* =========================
   BACKGROUND
========================= */

function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            H
        );

    gradient.addColorStop(
        0,
        "#080b23"
    );

    gradient.addColorStop(
        1,
        "#15102e"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    /* STARS */

    for (
        let i = 0;
        i < 80;
        i++
    ) {

        const x =
            (i * 137) %
            W;

        const y =
            (i * 83) %
            H;

        const size =
            i % 3 === 0
                ? 2
                : 1;

        ctx.globalAlpha =
            0.4 +
            (i % 5) / 10;

        ctx.fillStyle =
            "white";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            size,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

    ctx.globalAlpha = 1;

}


/* =========================
   PLAYER
========================= */

function drawPlayer() {

    if (!player) return;

    ctx.save();

    ctx.translate(
        player.x,
        player.y
    );

    let color;
    let letter;

    if (
        selectedCharacter ===
        "ana"
    ) {

        color = "#ff79c6";
        letter = "A";

    }

    else if (
        selectedCharacter ===
        "gio"
    ) {

        color = "#55d94b";
        letter = "G";

    }

    else {

        color = "#ff9d4d";
        letter = "D";

    }

    ctx.shadowBlur = 25;

    ctx.shadowColor =
        color;

    ctx.fillStyle =
        color;

    ctx.beginPath();

    ctx.roundRect(
        -22,
        -22,
        44,
        44,
        14
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle =
        "white";

    ctx.font =
        "900 22px Arial";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.fillText(
        letter,
        0,
        1
    );

    ctx.restore();

}


/* =========================
   OBJECT DRAW
========================= */

function drawObject(object) {

    ctx.save();

    ctx.translate(
        object.x,
        object.y
    );

    ctx.rotate(
        object.rotation
    );


    /* STAR */

    if (
        object.type ===
        "star"
    ) {

        ctx.shadowBlur = 22;

        ctx.shadowColor =
            "#ffe66d";

        ctx.fillStyle =
            "#ffe66d";

        ctx.beginPath();

        for (
            let i = 0;
            i < 10;
            i++
        ) {

            const radius =
                i % 2 === 0
                    ? 18
                    : 7;

            const angle =
                -Math.PI / 2 +
                i * Math.PI / 5;

            ctx.lineTo(
                Math.cos(angle) *
                    radius,

                Math.sin(angle) *
                    radius
            );

        }

        ctx.closePath();

        ctx.fill();

    }


    /* METEOR */

    else {

        ctx.shadowBlur = 20;

        ctx.shadowColor =
            "#ff475d";

        ctx.fillStyle =
            "#ff5365";

        ctx.beginPath();

        ctx.moveTo(-20, -5);

        ctx.lineTo(-8, -20);

        ctx.lineTo(15, -14);

        ctx.lineTo(22, 5);

        ctx.lineTo(7, 19);

        ctx.lineTo(-16, 14);

        ctx.closePath();

        ctx.fill();

    }

    ctx.restore();

}


/* =========================
   PARTICLES DRAW
========================= */

function drawParticles() {

    particles.forEach(
        particle => {

            ctx.globalAlpha =
                Math.max(
                    0,
                    particle.life
                );

            ctx.fillStyle =
                particle.type ===
                "star"
                    ? "#ffe66d"
                    : "#ff5365";

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                3,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }
    );

    ctx.globalAlpha = 1;

}


/* =========================
   DRAW
========================= */

function draw() {

    drawBackground();

    objects.forEach(
        drawObject
    );

    drawPlayer();

    drawParticles();

    ctx.fillStyle =
        "white";

    ctx.font =
        "bold 15px Arial";

    ctx.textAlign =
        "left";

    ctx.fillText(
        "⭐ ვარსკვლავი +10     ☄️ მეტეორებს აარიდე თავი!",
        20,
        32
    );

}


/* =========================
   GAME LOOP
========================= */

function gameLoop(currentTime) {

    if (!playing) {
        return;
    }

    const dt =
        Math.min(
            (currentTime -
                lastTime) /
                1000,
            0.033
        );

    lastTime =
        currentTime;

    update(dt);

    draw();

    if (playing) {

        requestAnimationFrame(
            gameLoop
        );

    }

}


/* =========================
   END GAME
========================= */

function endGame(
    title,
    text
) {

    playing = false;

    document
        .getElementById("resultIcon")
        .textContent =
        score >= 200
            ? "🏆"
            : "✨";

    document
        .getElementById("resultTitle")
        .textContent =
        title;

    let name;

    if (
        selectedCharacter ===
        "ana"
    ) {

        name = "ანას";

    }

    else if (
        selectedCharacter ===
        "gio"
    ) {

        name = "გიოს";

    }

    else {

        name = "დათას";

    }

    document
        .getElementById("resultText")
        .textContent =
        text +
        " " +
        name +
        " საბოლოო ქულა:";

    document
        .getElementById("finalScore")
        .textContent =
        score;

    showScreen(
        "endScreen"
    );

}


/* =========================
   INITIAL DRAW
========================= */

drawBackground();
