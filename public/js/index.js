// import "./drawer.js";

let currentVoteData = null;
let nextFetchTimeout = null;

async function fetchVoteData(lastVoteDisplayUntil = null) {
    clearTimeout(nextFetchTimeout); // Очищаем предыдущий таймаут, если он был

    try {
        // Формируем URL для запроса к бэкенду
        // Бэкенд должен вернуть следующее доступное голосование
        // Он может использовать 'after' параметр, чтобы найти голосование, идущее после указанной даты
        let apiUrl = '/api/next-vote'; // Замените на ваш реальный эндпоинт
        if (lastVoteDisplayUntil) {
            apiUrl += `?after=${lastVoteDisplayUntil.toISOString()}`;
        }

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const voteData = await response.json();

        if (!voteData || Object.keys(voteData).length === 0) {
            console.log("Больше голосований нет.");
            displayNoMoreVotes(); // Отображаем сообщение, что голосования закончились
            return;
        }

        // --- Обработка данных ---
        // Преобразуем строки дат в объекты Date
        const startDate = new Date(voteData.start_date);
        const endDate = new Date(voteData.end_date);
        const displayUntilDate = new Date(voteData.display_until_date);

        currentVoteData = {
            ...voteData,
            start_date: startDate,
            end_date: endDate,
            display_until_date: displayUntilDate // Сохраняем объект Date
        };

        // --- Обновление UI ---
        updateUI(currentVoteData); // Функция для обновления DOM

        // --- Планирование следующего запроса ---
        const now = Date.now();
        const delay = displayUntilDate.getTime() - now;

        if (delay > 0) {
            console.log(`Планируем следующий запрос через ${delay / 1000} секунд.`);
            nextFetchTimeout = setTimeout(() => {
                fetchVoteData(displayUntilDate); // Передаем дату окончания показа текущего голосования
            }, delay);
        } else {
            // Если время показа уже прошло, запрашиваем следующее немедленно
            console.log("Время показа текущего голосования истекло. Запрашиваем следующее.");
            // Передаем displayUntilDate, чтобы бэкенд мог найти корректное *следующее* голосование
            fetchVoteData(displayUntilDate);
        }

    } catch (error) {
        console.error("Ошибка при получении данных голосования:", error);
        displayError(); // Отображаем ошибку в UI
        // Можно добавить логику повторного запроса через некоторое время
        // nextFetchTimeout = setTimeout(fetchVoteData, 10000); // Попробовать снова через 10 секунд
    }
}

function updateUI(data) {
    // !!! ВАЖНО: Реализуйте эту функцию для обновления вашего HTML !!!
    // Пример:
    // document.getElementById('vote-title').textContent = data.title;
    // document.getElementById('left-image').src = data.left_image;
    // document.getElementById('left-name').textContent = data.left_name;
    // document.getElementById('right-image').src = data.right_image;
    // document.getElementById('right-name').textContent = data.right_name;
    // ... и так далее для всех элементов
    // Также здесь нужно обрабатывать состояние голосования (активно, завершено)
    console.log("Обновление UI данными:", data);

    // Пример простой установки заголовка (замените на реальную логику)
    const titleElement = document.querySelector('h1'); // Найдите ваш элемент заголовка
    if (titleElement) {
        titleElement.textContent = data.title || 'Голосование';
    }
    // Добавьте код для обновления остальных частей интерфейса...
}

function displayNoMoreVotes() {
    // !!! ВАЖНО: Реализуйте эту функцию для отображения сообщения !!!
    console.log("Отображение сообщения 'Больше голосований нет'.");
    // Пример:
    // const container = document.getElementById('vote-container'); // Найдите контейнер
    // if (container) container.innerHTML = '<p>Новых голосований пока нет. Загляните позже!</p>';
}

function displayError() {
    // !!! ВАЖНО: Реализуйте эту функцию для отображения ошибки !!!
    console.log("Отображение ошибки загрузки.");
    // Пример:
    // const container = document.getElementById('vote-container'); // Найдите контейнер
    // if (container) container.innerHTML = '<p>Не удалось загрузить данные голосования. Пожалуйста, попробуйте обновить страницу.</p>';
}

// --- Начальная загрузка ---
// Запускаем получение первого голосования после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    fetchVoteData();
});

export function setCookie(name, value, days = 100) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

export function getCookie(name) {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='))
        ?.split('=')[1];
}

async function loadVotingData() {
    const voting = await votingAPI.getCurrentVoting();
    if (!voting) {
        // обработка ошибки
        return;
    }
    // Используйте voting.title, voting.no_option_image_url, voting.yes_option_image_url и т.д.
}