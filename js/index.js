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
        start_date: new Date(2025, 4, 30, 17, 0),
        end_date: new Date(2025, 4, 30, 17, 15),
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