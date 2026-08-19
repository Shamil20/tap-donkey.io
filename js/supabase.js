const SUPABASE_URL = "https://vdyltqkrpsrucexgepav.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_unIvuf8B5egi6Tf1Emq8cg_QYinIwe2";


const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// console.log("Supabase подключен!");
// console.log(supabaseClient);

/*
 * Синхронизация монет с Supabase
 */
async function syncPlayerToLeaderboard(player) {
    if (!player || !player.robloxUsername) return;

    try {
        await supabaseClient
            .from('leaderboard')
            .upsert({
                roblox_username: player.robloxUsername,
                nickname: player.nickname,
                coins: Math.floor(player.coins),
                updated_at: new Date().toISOString()
            }, { onConflict: 'roblox_username' });
    } catch (err) {
        console.error("Ошибка отправки данных в Supabase:", err);
    }
}

/*
 * Загрузка Лидерборда
 */
async function loadLeaderboard() {
    const player = JSON.parse(localStorage.getItem("donkeyPlayer"));
    const container = document.getElementById("leaderboardList");
    const myRankCard = document.getElementById("myRankCard");

    if (!container) return;

    // 1. Отправляем свежие данные игрока
    if (player) {
        await syncPlayerToLeaderboard(player);
    }

    // 2. Получаем Топ-20
    const { data: topPlayers, error } = await supabaseClient
        .from('leaderboard')
        .select('*')
        .order('coins', { ascending: false })
        .limit(20);

    if (error) {
        container.innerHTML = `<div class="loading-text">Ошибка загрузки данных</div>`;
        return;
    }

    container.innerHTML = "";
    let isPlayerInTop20 = false;

    topPlayers.forEach((item, index) => {
        const rank = index + 1;
        let rankBadge = rank;
        if (rank === 1) rankBadge = "🥇 1";
        else if (rank === 2) rankBadge = "🥈 2";
        else if (rank === 3) rankBadge = "🥉 3";

        // Проверяем, является ли эта строка текущим игроком
        const isMe = player && item.roblox_username === player.robloxUsername;
        if (isMe) {
            isPlayerInTop20 = true;
        }

        const displayName = isMe ? `${item.nickname} (Вы)` : item.nickname;

        const row = document.createElement("div");
        row.className = `leader-item ${rank <= 3 ? 'top-' + rank : ''} ${isMe ? 'my-rank-item' : ''}`;
        row.innerHTML = `
            <span class="rank">${rankBadge}</span>
            <span class="nickname">${displayName}</span>
            <div class="score">
                <span>${Math.floor(item.coins).toLocaleString()}</span>
                <img src="images/donkey-coin.png" alt="Coin" class="leader-coin">
            </div>
        `;
        container.appendChild(row);
    });

    // 3. Отображаем нижний блок, только если игрок НЕ попал в Топ-20
    if (player && myRankCard) {
        if (isPlayerInTop20) {
            myRankCard.classList.add("hidden");
        } else {
            myRankCard.classList.remove("hidden");
            const myRankNick = document.getElementById("myRankNickname");
            const myRankCoins = document.getElementById("myRankCoins");

            if (myRankNick) myRankNick.textContent = `${player.nickname} (Вы)`;
            if (myRankCoins) myRankCoins.textContent = Math.floor(player.coins).toLocaleString();
        }
    }
}