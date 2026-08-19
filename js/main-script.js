document.addEventListener("DOMContentLoaded", () => {

    const donkeyButton = document.getElementById("donkeyButton");

    /*
     * Анимация осла при клике
     */
    if (donkeyButton) {
        donkeyButton.addEventListener("click", () => {
            donkeyButton.animate(
                [
                    { transform: "scale(1)" },
                    { transform: "scale(0.93)" },
                    { transform: "scale(1.03)" },
                    { transform: "scale(1)" }
                ],
                {
                    duration: 180,
                    easing: "ease-out"
                }
            );
        });
    }

    /*
     * Переключение экранов (FARM / UPGRADES / LEADERBOARD)
     */
    const tabs = document.querySelectorAll(".game-tab");
    const tabFarm = document.getElementById("tabFarm");
    const tabUpgrades = document.getElementById("tabUpgrades");
    const tabLeaderboard = document.getElementById("tabLeaderboard");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Звук переключения вкладок
            const navSound = new Audio("sounds/nav-effect.mp3");
            navSound.currentTime = 0;
            navSound.play().catch(() => {});

            const currentTab = tab.dataset.tab;

            // Выделение активной кнопки в меню
            tabs.forEach(item => item.classList.remove("active"));
            tab.classList.add("active");

            // Скрываем все экраны
            if (tabFarm) tabFarm.classList.add("hidden");
            if (tabUpgrades) tabUpgrades.classList.add("hidden");
            if (tabLeaderboard) tabLeaderboard.classList.add("hidden");

            // Показываем нужный экран
            if (currentTab === "farm" && tabFarm) {
                tabFarm.classList.remove("hidden");
            } else if (currentTab === "upgrades" && tabUpgrades) {
                tabUpgrades.classList.remove("hidden");
            } else if (currentTab === "quests" && tabLeaderboard) {
                tabLeaderboard.classList.remove("hidden");
                if (typeof loadLeaderboard === "function") {
                    loadLeaderboard();
                }
            }
        });
    });

});

/*
 * МОБИЛЬНОЕ БУРГЕР-МЕНЮ
 */
document.addEventListener("DOMContentLoaded", () => {
    const burgerBtn = document.getElementById("burgerBtn");
    const headerNav = document.getElementById("headerNav");
    const navLinks = document.querySelectorAll(".list_nav-links");

    if (burgerBtn && headerNav) {
        burgerBtn.addEventListener("click", () => {
            burgerBtn.classList.toggle("active");
            headerNav.classList.toggle("active");
        });

        // Закрывать меню при клике на любую ссылку
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                burgerBtn.classList.remove("active");
                headerNav.classList.remove("active");
            });
        });
    }
});