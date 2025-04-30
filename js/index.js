import "./drawer.js";

export const vote_data = [
    {
        title: "TEST",
        left: {
            image: "public/images/image-2.png",
            name: "$TOKEN",
        },
        right: {
            image: "public/images/image-6.png",
            name: "$TEST",
        },
        start_date: new Date(2025, 3, 30, 19, 30),
        end_date: new Date(2025, 3, 30, 21, 30),
        // end_date: new Date(2025, 4, 1, 9, 46),
        winner: "left",
        duration: new Date(2025, 4, 1, 0, 0),
        // duration: new Date(2025, 4, 1, 12),
        choices: {
            yes: 7222,
            no: 12344,
        },
    },

    {
        title: "TEST1",
        left: {
            image: "public/images/image-6.png",
            name: "$TOKEN1",
        },
        right: {
            image: "public/images/image-2.png",
            name: "$TEST2",
        },
        start_date: new Date(2025, 3, 29, 23, 41),
        end_date: new Date(2025, 3, 29, 23, 43),
        // end_date: new Date(2025, 4, 1, 9, 46),
        winner: "left",
        duration: new Date(2025, 3, 29, 23, 50),
        // duration: new Date(2025, 4, 1, 12),
        choices: {
            yes: 7222,
            no: 12344,
        },
    },

];

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

document.addEventListener('DOMContentLoaded', () => {
    // Создаем попап
    const popup = document.createElement('div');
    popup.className = 'coming-soon-popup';
    popup.textContent = 'Coming Soon';
    document.body.appendChild(popup);

    // Функция для показа попапа
    function showComingSoonPopup() {
        popup.classList.remove('hide');
        popup.classList.add('show');
        setTimeout(() => {
            popup.classList.remove('show');
            popup.classList.add('hide');
        }, 2000);
    }

    // Обработчик кликов для кнопок без ссылок
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showComingSoonPopup();
        });
    });

    // Обработчик кликов для кнопок без href
    document.querySelectorAll('button:not([href])').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            showComingSoonPopup();
        });
    });
});