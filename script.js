/* =====================================================
   GAMENOVA DYNAMIC GAME SYSTEM
   ===================================================== */


/* =====================================================
   ADD YOUR GAMES HERE
   =====================================================

   New game add karne ke liye sirf ek object copy karo.

   Example:

   {
       name: "New Game",
       file: "games/new-game.html",
       category: "ACTION",
       icon: "🎮",
       description: "Your game description.",
       meta1: "Action",
       meta2: "Combat"
   }

===================================================== */


const games = [

    {
        name: "Shadow Strike",
        file: "games/shadow-strike.html",
        category: "ACTION",
        icon: "🥷",
        description:
            "Enter the shadows, defeat enemies and survive the battlefield.",
        meta1: "⚔️ Action",
        meta2: "🔥 Combat"
    },

    {
        name: "Neon Racer",
        file: "games/neon-racer.html",
        category: "RACING",
        icon: "🏎️",
        description:
            "Speed through futuristic roads, avoid traffic and chase the highest score.",
        meta1: "🏎️ Racing",
        meta2: "⚡ Speed"
    },

    {
        name: "Lost Kingdom",
        file: "games/lost-kingdom.html",
        category: "ADVENTURE",
        icon: "🏰",
        description:
            "Explore a mysterious kingdom, fight enemies and face powerful bosses.",
        meta1: "🏰 Adventure",
        meta2: "⚔️ Sword"
    },

    {
        name: "War Lords",
        file: "games/war-lords.html",
        category: "BATTLE",
        icon: "⚔️",
        description:
            "Lead your warrior through dangerous battlefields and defeat enemy armies.",
        meta1: "⚔️ Battle",
        meta2: "🏆 Boss"
    },

    {
        name: "Cyber Hunter",
        file: "games/cyber-hunter.html",
        category: "SHOOTER",
        icon: "🚀",
        description:
            "Control your futuristic spaceship, destroy enemies and survive the galaxy.",
        meta1: "🚀 Space",
        meta2: "🔫 Shooter"
    },

    {
        name: "Turbo Drive",
        file: "games/turbo-drive.html",
        category: "BIKE RACING",
        icon: "🏍️",
        description:
            "Ride your bike through dangerous traffic, increase your distance and survive.",
        meta1: "🏍️ Bike",
        meta2: "⚡ Boost"
    }

    /* =================================================
       FUTURE GAME EXAMPLE

    ,
    {
        name: "Trap Run",
        file: "games/trap-run.html",
        category: "ACTION",
        icon: "🏃",
        description:
            "Run, dodge dangerous traps and survive as long as possible.",
        meta1: "🏃 Run",
        meta2: "🔥 Challenge"
    }

    ================================================= */
];



/* =====================================================
   CATEGORY INFORMATION
   ===================================================== */

const categoryInfo = {

    "ACTION": {
        icon: "⚔️",
        description: "Fast combat and intense battles."
    },

    "RACING": {
        icon: "🏎️",
        description: "Speed, traffic and endless roads."
    },

    "ADVENTURE": {
        icon: "🏰",
        description: "Explore mysterious worlds."
    },

    "SHOOTER": {
        icon: "🚀",
        description: "Destroy enemies and survive."
    },

    "BATTLE": {
        icon: "⚔️",
        description: "Fight enemies and defeat powerful bosses."
    },

    "BIKE RACING": {
        icon: "🏍️",
        description: "Ride fast and survive dangerous roads."
    }

};



/* =====================================================
   DOM ELEMENTS
   ===================================================== */

const gameGrid = document.getElementById("gameGrid");
const categoryGrid = document.getElementById("categoryGrid");
const gameCount = document.getElementById("gameCount");



/* =====================================================
   SHOW GAME COUNT
   ===================================================== */

function updateGameCount() {

    const count = games.length;

    gameCount.textContent =
        count < 10 ? "0" + count : count;
}



/* =====================================================
   CREATE GAME CARDS
   ===================================================== */

function displayGames() {

    gameGrid.innerHTML = "";

    games.forEach((game, index) => {

        const card = document.createElement("article");

        card.className = "game-card";

        const gameNumber =
            String(index + 1).padStart(2, "0");

        card.innerHTML = `

            <div class="game-icon">
                ${game.icon}
            </div>

            <div class="game-number">
                GAME ${gameNumber}
            </div>

            <div class="game-category">
                ${game.category}
            </div>

            <h3>
                ${game.name}
            </h3>

            <p>
                ${game.description}
            </p>

            <div class="game-meta">

                <span>
                    ${game.meta1}
                </span>

                <span>
                    ${game.meta2}
                </span>

            </div>

            <a
                href="${game.file}"
                class="play-btn"
            >
                PLAY NOW →
            </a>

        `;

        gameGrid.appendChild(card);

    });

}



/* =====================================================
   CREATE CATEGORY CARDS
   ===================================================== */

function displayCategories() {

    categoryGrid.innerHTML = "";

    const categories = {};

    games.forEach(game => {

        if (!categories[game.category]) {
            categories[game.category] = 0;
        }

        categories[game.category]++;

    });


    Object.keys(categories).forEach(category => {

        const info =
            categoryInfo[category] || {

                icon: "🎮",

                description:
                    "Explore exciting games and challenges."

            };


        const count =
            categories[category];


        const card =
            document.createElement("div");

        card.className =
            "category-card";


        card.innerHTML = `

            <div class="category-icon">
                ${info.icon}
            </div>

            <h3>
                ${category}
            </h3>

            <p>
                ${info.description}
            </p>

            <span class="category-count">
                ${String(count).padStart(2, "0")}
                ${count === 1 ? "GAME" : "GAMES"}
            </span>

        `;


        categoryGrid.appendChild(card);

    });

}



/* =====================================================
   MOBILE MENU
   ===================================================== */

const menuBtn =
    document.getElementById("menuBtn");

const nav =
    document.querySelector(".navbar nav");


menuBtn.addEventListener("click", () => {

    nav.classList.toggle("active");

});


/* Mobile menu click ke baad close */

document.querySelectorAll(".navbar nav a")
.forEach(link => {

    link.addEventListener("click", () => {

        nav.classList.remove("active");

    });

});



/* =====================================================
   INITIALIZE GAMENOVA
   ===================================================== */

function initializeGameNova() {

    updateGameCount();

    displayGames();

    displayCategories();

}


/* Start website */

initializeGameNova();