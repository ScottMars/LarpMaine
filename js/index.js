import "./drawer.js";

export const vote_data = [
    {
        title: "Greenland Acquisition Will Greenland become the 51st state… or remain the crown jewel of Denmark?",
        left: {
            image: "public/images/vote/ping.png",
            name: "No, Denmark will hold the ice",
        },
        right: {
            image: "public/images/vote/trump.png",
            name: "Yes, US will acquire Greenland",
        },
        start_date: new Date(2025, 4, 8, 0, 0),
        end_date: new Date(2025, 4, 8, 18, 0),
        // end_date: new Date(2025, 4, 1, 9, 46),
        winner: "left",
        duration: new Date(2025, 4, 9, 0, 0),
        // duration: new Date(2025, 4, 1, 12),
        choices: {
            yes: 7222,
            no: 12344,
        },
        url_contract_address: "",
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
        url_contract_address: "",
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