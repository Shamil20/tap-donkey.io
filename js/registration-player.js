document.addEventListener("DOMContentLoaded", () => {

    let player = JSON.parse(localStorage.getItem("donkeyPlayer"));

    if (player) {
        if (!player.upgrades) {
            player.upgrades = { multiclick: 100, passive: 500, megaclick: 1000 };
        }
    }

    // Предзагрузка звуков для работы без задержек
    const clickSound = new Audio("sounds/click-donkey_2.mp3");
    const buySound = new Audio("sounds/buy-effect.mp3");

    const registrationOverlay = document.getElementById("registrationOverlay");
    const registrationForm = document.getElementById("registrationForm");
    const nicknameInput = document.getElementById("nickname");
    const robloxInput = document.getElementById("robloxUsername");
    const registrationError = document.getElementById("registrationError");

    if (!player) {
        if (registrationOverlay) registrationOverlay.classList.remove("hidden");
    } else {
        if (registrationOverlay) registrationOverlay.classList.add("hidden");
    }

    function createNewPlayer(nickname, robloxUsername) {
        return {
            nickname: nickname,
            robloxUsername: robloxUsername,

            coins: 0,
            coinsPerClick: 1,
            incomePerHour: 0,
            coinsForUpgrade: 100,

            upgrades: { multiclick: 100, passive: 500, megaclick: 1000 },

            level: 1,
            levelProgress: 0,

            totalClicks: 0,
            createdAt: Date.now()
        };
    }

    if (registrationForm) {
        registrationForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const nickname = nicknameInput.value.trim();
            const robloxUsername = robloxInput.value.trim();

            if (nickname.length < 3) {
                registrationError.textContent = "Никнейм должен содержать минимум 3 символа.";
                return;
            }

            if (robloxUsername.length < 3) {
                registrationError.textContent = "Username Roblox должен содержать минимум 3 символа.";
                return;
            }

            player = createNewPlayer(nickname, robloxUsername);
            savePlayer();

            if (registrationOverlay) registrationOverlay.classList.add("hidden");
            updateUI();
        });
    }

    function savePlayer() {
        if (player) {
            localStorage.setItem("donkeyPlayer", JSON.stringify(player));
        }
    }

    const playerName = document.getElementById("playerName");
    const playerRoblox = document.getElementById("playerRoblox");

    const coinBalance = document.getElementById("coinBalance");
    const clickReward = document.getElementById("clickReward");

    const profitPerClick = document.getElementById("profitPerClick");
    const coinsForUpgrade = document.getElementById("coinsForUpgrade");
    const incomePerHour = document.getElementById("incomePerHour");
    const buyButtons = document.querySelectorAll(".buy-button");
    const donkeyButton = document.getElementById("donkeyButton");

    function updateUI() {
        if (!player) return;

        if (typeof checkAndUpdateLevel === "function") {
            checkAndUpdateLevel(player);
        }

        if (playerName) playerName.textContent = player.nickname;
        if (playerRoblox) playerRoblox.textContent = "@" + player.robloxUsername;

        if (profitPerClick) profitPerClick.textContent = player.coinsPerClick;
        if (coinsForUpgrade) coinsForUpgrade.textContent = player.coinsForUpgrade;
        if (incomePerHour) incomePerHour.textContent = player.incomePerHour;

        if (coinBalance) coinBalance.textContent = player.coins.toFixed(2);
        if (clickReward) clickReward.textContent = player.coinsPerClick;

        updateUpgradesUI();
    }

    function updateUpgradesUI() {
        if (!player || !player.upgrades) return;

        buyButtons.forEach(button => {
            const id = button.dataset.id;
            if (id && player.upgrades[id] !== undefined) {
                const currentCost = player.upgrades[id];
                button.dataset.cost = currentCost;

                const costSpan = button.querySelector(".cost-val");
                if (costSpan) {
                    costSpan.textContent = currentCost;
                }
            }
        });
    }

    /*
     * БЕСКОНЕЧНЫЙ КЛИК ПО ОСЛУ
     */
    const clickEffects = document.getElementById("clickEffects");

    function clickDonkey(e) {
        if (e) e.preventDefault();
        if (!player) return;

        player.coins += player.coinsPerClick;
        player.totalClicks++;

        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});

        if (typeof checkAndUpdateLevel === "function") {
            checkAndUpdateLevel(player);
        }

        updateUI();
        showClickEffect();
    }

    if (donkeyButton) {
        donkeyButton.addEventListener("click", clickDonkey);
    }

    function showClickEffect() {
        if (!clickEffects) return;

        const number = document.createElement("div");
        number.className = "click-number";
        number.textContent = "+" + player.coinsPerClick;

        number.style.left = (120 + Math.random() * 120) + "px";
        number.style.top = (180 + Math.random() * 100) + "px";

        clickEffects.appendChild(number);

        setTimeout(() => {
            number.remove();
        }, 800);
    }

    /*
     * ПОКУПКА В МАГАЗИНЕ
     */
    buyButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (!player) return;

            const id = button.dataset.id;
            const type = button.dataset.type;
            const amount = parseFloat(button.dataset.amount);
            let cost = parseFloat(button.dataset.cost);

            if (player.coins >= cost) {
                buySound.currentTime = 0;
                buySound.play().catch(() => {});

                player.coins -= cost;

                if (type === "click") {
                    player.coinsPerClick += amount;
                } else if (type === "income") {
                    player.incomePerHour += amount;
                }

                const newCost = Math.round(cost * 1.5);
                player.upgrades[id] = newCost;

                savePlayer();
                updateUI();
            } else {
                alert("Недостаточно монет для покупки!");
            }
        });
    });

    /*
     * ТАЙМЕР: ПАССИВНЫЙ ДОХОД И ФОНОВОЕ СОХРАНЕНИЕ
     */
    setInterval(() => {
        if (!player) return;

        if (player.incomePerHour > 0) {
            player.coins += player.incomePerHour / 3600;
        }

        savePlayer();
        updateUI();
    }, 1000);

    window.addEventListener("beforeunload", savePlayer);

    updateUI();
});