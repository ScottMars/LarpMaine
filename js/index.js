import "./drawer.js";

export const vote_data = [
    {
        title: "TEST",
        left: {
            image: "public/images/vote/ping.png",
            name: "$TOKEN",
        },
        right: {
            image: "public/images/vote/trump.png",
            name: "$TEST",
        },
        start_date: new Date(2025, 4, 5, 13, 05),
        end_date: new Date(2025, 4, 5, 21, 00),
        // end_date: new Date(2025, 4, 1, 9, 46),
        winner: "left",
        duration: new Date(2025, 4, 5, 21, 30),
        // duration: new Date(2025, 4, 1, 12),
        choices: {
            yes: 7422,
            no: 11241,
        },
    },

    {
        title: "TEST1",
        left: {
            image: "public/images/vote/ping.png",
            name: "$TOKEN1",
        },
        right: {
            image: "public/images/vote/trump.png",
            name: "$TEST2",
        },
        start_date: new Date(2025, 4, 5, 21, 31),
        end_date: new Date(2025, 4, 6, 15, 00),
        // end_date: new Date(2025, 4, 1, 9, 46),
        winner: "left",
        duration: new Date(2025, 4, 6, 23, 50),
        // duration: new Date(2025, 4, 1, 12),
        choices: {
            yes: 522,
            no: 1844,
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