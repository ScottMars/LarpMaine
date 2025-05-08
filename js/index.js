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
            name: "Yes, US will acquire Greenland and rename to PumplandÍ",
        },
        start_date: new Date(Date.UTC(2025, 4, 8, 0, 0)),
        end_date: new Date(Date.UTC(2025, 4, 8, 15, 0)),
        // end_date: new Date(2025, 4, 1, 9, 46),
        winner: "right",
        duration: new Date(Date.UTC(2025, 4, 9, 15, 0)),
        // duration: new Date(2025, 4, 1, 12),
        choices: {
            yes: 1000,
            no: 200,
        },
        url_contract_address: "https://dexscreener.com/solana/c3heoibwwjs2pfgqlbge9hdfs1ku7wujixyfvpjtaq3f",
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
        start_date: new Date(Date.UTC(2025, 4, 9, 12, 0)),
        end_date: new Date(Date.UTC(2025, 4, 10, 23, 43)),
        // end_date: new Date(2025, 4, 1, 9, 46),
        winner: "left",
        duration: new Date(Date.UTC(2025, 4, 11, 23, 50)),
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