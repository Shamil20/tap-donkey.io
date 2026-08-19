/*
==========================================
СИСТЕМА УРОВНЕЙ (LEVELS.JS)
Каждый следующий уровень требует в 3 раза больше кликов
==========================================
*/

const LEVEL_TITLES = [
    "Обычный осел",       // Level 1
    "Золотой осел",       // Level 2
    "Алмазный осел",      // Level 3
    "Конфетный осел",     // Level 4
    "Кровавый осел",      // Level 5
    "Дивайновский осел",  // Level 6
    "Шоколадный осел",    // Level 7
    "Крипто осел",        // Level 8
    "Изумрудный осел",    // Level 9
    "Сорвиголова осел",   // Level 10
    "Сумашедший осел",    // Level 11
    "Ужастный осел",      // Level 12
    "Громкий осел",       // Level 13
    "Брилиантовый осел",  // Level 14
    "Железный осел",      // Level 15
    "Титановый осел",     // Level 16
    "Лорд осел",          // Level 17
    "Donkey Legend",      // Level 18
    "Принц осел",         // Level 19
    "Король осел"         // Level 20
];

const MAX_LEVEL = 20;

function generateLevels() {
    const levels = [];
    let currentRequired = 100; // Цель для 2-го уровня

    levels.push({
        level: 1,
        clicksRequired: 0,
        title: LEVEL_TITLES[0]
    });

    for (let i = 2; i <= MAX_LEVEL; i++) {
        levels.push({
            level: i,
            clicksRequired: currentRequired,
            title: LEVEL_TITLES[i - 1] || `Level ${i} Master`
        });
        currentRequired *= 3; // Умножение на 3
    }

    return levels;
}

const GAME_LEVELS = generateLevels();

/*
 * Проверка и расчет уровня игрока
 */
function checkAndUpdateLevel(player) {
    if (!player) return;

    if (typeof player.totalClicks !== 'number') {
        player.totalClicks = 0;
    }

    const currentClicks = player.totalClicks;
    let oldLevel = player.level || 1;
    let newLevel = 1;

    for (let i = GAME_LEVELS.length - 1; i >= 0; i--) {
        if (currentClicks >= GAME_LEVELS[i].clicksRequired) {
            newLevel = GAME_LEVELS[i].level;
            break;
        }
    }

    player.level = newLevel;

    if (newLevel > oldLevel) {
        showLevelUpMessage(newLevel, GAME_LEVELS[newLevel - 1].title);
    }

    const currentLevelConfig = GAME_LEVELS[newLevel - 1];
    const nextLevelConfig = GAME_LEVELS[newLevel] || null;

    let progressPercent = 100;
    let targetClicksForNext = "Max";

    if (nextLevelConfig) {
        const startClicks = currentLevelConfig.clicksRequired;
        const targetClicks = nextLevelConfig.clicksRequired;

        const clicksInCurrentLevel = currentClicks - startClicks;
        const totalClicksForLevel = targetClicks - startClicks;

        progressPercent = Math.min(100, Math.max(0, (clicksInCurrentLevel / totalClicksForLevel) * 100));
        targetClicksForNext = targetClicks;
    }

    player.levelProgress = progressPercent;
    
    // Записываем целевые клики прямо в объект игрока
    player.coinsForUpgrade = targetClicksForNext;

    updateLevelUI(player, currentLevelConfig, targetClicksForNext);
}

/*
 * Обновление элементов в HTML
 */
function updateLevelUI(player, currentLevelConfig, targetClicks) {
    const playerLevelName = document.getElementById("playerLevelName");
    const levelCurrent = document.getElementById("levelCurrent");
    const levelProgress = document.getElementById("levelProgress");
    const coinsForUpgrade = document.getElementById("coinsForUpgrade");

    if (playerLevelName) {
        playerLevelName.textContent = currentLevelConfig.title;
    }

    if (levelCurrent) {
        const levelMaxSpan = levelCurrent.parentElement;
        if (levelMaxSpan) {
            levelMaxSpan.innerHTML = `<span id="levelCurrent">${player.totalClicks}</span>/${targetClicks}`;
        }
    }

    if (levelProgress) {
        levelProgress.style.width = player.levelProgress + "%";
    }

    if (coinsForUpgrade) {
        coinsForUpgrade.textContent = targetClicks;
    }
}

function showLevelUpMessage(levelNumber, title) {
    // Звук поднятия уровня
    const levelSound = new Audio("sounds/level_up-effect.mp3");
    levelSound.currentTime = 0;
    levelSound.play().catch(() => {});

    const message = document.createElement("div");
    message.className = "level-up-message";
    message.innerHTML = `
        <strong>УРОВЕНЬ ${levelNumber}!</strong>
        <span>${title}</span>
    `;

    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 1800);
}