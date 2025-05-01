// Данные для таблицы лидерборда
const leaderboardData = [
    { rank: 4, wallet: '68u...RTE', votes: 24, holdAmount: '2.3 M', cards: 24, battleWins: 58, total: '34 981' },
    { rank: 5, wallet: '68u...RTE', votes: 24, holdAmount: '2.3 M', cards: 24, battleWins: 58, total: '34 981' },
    { rank: 6, wallet: '68u...RTE', votes: 24, holdAmount: '2.3 M', cards: 24, battleWins: 58, total: '34 981' },
    { rank: 7, wallet: '68u...RTE', votes: 24, holdAmount: '2.3 M', cards: 24, battleWins: 58, total: '34 981' },
    { rank: 8, wallet: '68u...RTE', votes: 24, holdAmount: '2.3 M', cards: 24, battleWins: 58, total: '34 981' },
    { rank: 9, wallet: '68u...RTE', votes: 24, holdAmount: '2.3 M', cards: 24, battleWins: 58, total: '34 981' },
    { rank: 10, wallet: '68u...RTE', votes: 24, holdAmount: '2.3 M', cards: 24, battleWins: 58, total: '34 981' },
];

// Функция для создания строки таблицы
function createLeaderboardRow(data) {
    return `
        <div class="leaderboard-row">
            <div class="rank-container">
                <img src="public/images/ellipse-2.svg" alt="Rank background" class="rank-bg">
                <span class="rank">${data.rank}</span>
            </div>
            <span class="wallet">${data.wallet}</span>
            <span>${data.votes}</span>
            <span>${data.holdAmount}</span>
            <span>${data.cards}</span>
            <span>${data.battleWins}</span>
            <span>${data.total}</span>
        </div>
    `;
}

// Заполнение таблицы данными
function populateLeaderboard() {
    const leaderboardRows = document.querySelector('.leaderboard-rows');
    leaderboardRows.innerHTML = leaderboardData.map(data => createLeaderboardRow(data)).join('');
}

// Обработчики для пагинации
function setupPagination() {
    const prevButton = document.querySelector('.prev-btn');
    const nextButton = document.querySelector('.next-btn');
    const pageNumbers = document.querySelectorAll('.page-numbers span');

    let currentPage = 1;
    const totalPages = 56;

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
        }
    });

    pageNumbers.forEach(number => {
        number.addEventListener('click', () => {
            const page = number.textContent;
            if (page !== '...') {
                currentPage = parseInt(page);
                updatePagination();
            }
        });
    });

    function updatePagination() {
        pageNumbers.forEach(number => {
            const page = number.textContent;
            if (page !== '...') {
                number.classList.toggle('active', parseInt(page) === currentPage);
            }
        });

        // Здесь можно добавить логику загрузки данных для соответствующей страницы
        console.log('Loading page:', currentPage);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    populateLeaderboard();
    setupPagination();
}); 