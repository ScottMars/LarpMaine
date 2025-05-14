import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
// import { useRouter } from 'next/router'; // Пока не нужен, но может понадобиться для JS логики

// Временные компоненты Header, DrawerMenu и Footer (аналогично pages/winner.js)
// Если у вас есть общие компоненты Layout, их можно будет использовать позже.
const Header = () => (
    <header className=" sticky top-4 mt-4 z-40">
        <nav>
            <ul className=" flex items-center gap-10">
                <li id="menu" className="flex gap-4 md:hidden">
                    <svg className=" w-5 h-5" width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 10H17.5M2.5 5H17.5M2.5 15H12.5" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className=" w-px block bg-white/30"></span>
                </li>
                <li data-mobile-disable className=""><Link href="/" className="px-1 w-full">Home</Link></li>
                <li data-mobile-disable className=""><Link href="/rules" className="px-1 w-full">Rules</Link></li>
                <li data-mobile-disable className=""><Link href="/coming" className="px-1 w-full">Rewards</Link></li>
                <li data-mobile-disable className=""><Link href="/vote" className="px-1 w-full">Voting</Link></li>
                <li data-mobile-disable className=""><a target="_blank" rel="noopener noreferrer" className="px-1 w-full" href="https://memeotica.gitbook.io/memoticfun">Whitepaper</a></li>
                <li data-mobile-disable className=""><Link href="/roadmap" className="px-1 w-full">Roadmap</Link></li>
                <li data-mobile-disable className=" text-white font-bold"><Link href="/leaderboard" className="px-1 w-full">Leaderboard</Link></li> {/* Активная ссылка */}
                <li><a target="_blank" rel="noopener noreferrer" href="https://x.com/Memeotica_Game"><img src="/images/header/x.svg" alt="Twitter X" className="w-5 h-5"/></a></li>
                <li><a target="_blank" rel="noopener noreferrer" href="https://t.me/memeotica_game"><img src="/images/header/tg.svg" alt="Telegram" className="w-5 h-5"/></a></li>
            </ul>
        </nav>
    </header>
);

const DrawerMenu = () => (
    <div data-opened="false" id="drawer-menu" className="drawer fixed inset-0 z-50 pointer-events-none opacity-0 transition-opacity duration-300 md:hidden">
        <div className="drawer-overflow absolute inset-0 bg-black/50"></div>
        <div className=" drawer-content absolute bottom-0 left-0 right-0 text-xl bg-[#2D1E11] pt-4 px-6 pb-9 rounded-t-[3rem] transform translate-y-full transition-transform duration-300">
            <button className=" drawer-close absolute left-1/2 -translate-x-1/2 -top-12 flex gap-2 items-center py-1 pl-2 pr-3 rounded-full bg-[#7A5AF090]">
                <svg className="w-6 h-6" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 7L7 17M7 7L17 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Close
            </button>
            <ul className="divide-y divide-white/10">
                <li className=""><Link href="/" className="px-1 py-4 block w-full">Home</Link></li>
                <li className=""><Link href="/rules" className="px-1 py-4 block w-full">Rules</Link></li>
                <li className=""><Link href="/coming" className="px-1 py-4 block w-full">Rewards</Link></li>
                <li className=""><Link href="/vote" className="px-1 py-4 block w-full">Voting</Link></li>
                <li className=""><a target="_blank" rel="noopener noreferrer" className="px-1 py-4 block w-full" href="https://memeotica.gitbook.io/memoticfun">Whitepaper</a></li>
                <li className=""><Link href="/roadmap" className="px-1 py-4 block w-full">Roadmap</Link></li>
                <li className=" text-white font-bold"><Link href="/leaderboard" className="px-1 py-4 block w-full">Leaderboard</Link></li> {/* Активная ссылка */}
            </ul>
            {/* Здесь может потребоваться скрипт для открытия/закрытия меню, если он не глобальный */}
            {/* useEffect(() => {
                // Логика для открытия/закрытия меню из js/index.js
                // Например, document.getElementById('menu').onclick = ...
                // document.querySelector('.drawer-close').onclick = ...
                // document.querySelector('.drawer-overflow').onclick = ...
            // }, []); */}
        </div>
    </div>
);

const Footer = () => (
    <footer>
        <div className=" flex content text-right max-md:text-lg justify-between md:justify-center text-white/50 gap-10 items-center border-t border-white/20 mt-14 py-4 ">
            <p className=" max-md:hidden">Memeotica. 2025</p>
            {/* Убедитесь, что путь к логотипу правильный для Next.js (из папки public) */}
            <img src="/images/memoitica.svg" className="  w-24 h-24 " alt="Memeotica Logo"/>
            <div className=" ">
                <p className="max-md:mb-2 md:hidden">Memeotica. 2025</p>
                <p className=" ">© All rights reserved</p>
            </div>
        </div>
    </footer>
);

export default function LeaderboardPage() {
    // Стейты для данных таблицы лидеров, загрузки, ошибок - по аналогии с WinnerPage, если нужно
    // const [leaderboardData, setLeaderboardData] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);

    // useEffect для загрузки данных таблицы лидеров (аналогично js/page/leaderboard.js)
    // useEffect(() => {
    //    async function fetchLeaderboardData() {
    //        // ... логика загрузки
    //    }
    //    fetchLeaderboardData();
    // }, []);

    return (
        <>
            <Head>
                <title>Leaderboard - Memeotica</title>
                {/* Если нужен favicon, добавьте его сюда, как в winner.js */}
                <link rel="icon" type="image/png" href="/images/Favicon memeotica.png" />
                {/* Ссылки на CSS из leaderboard.html (css/index.css, css/leaderboard.css) */}
                {/* index.css уже подключен глобально в _document.js */}
                {/* Подключаем leaderboard.css специфично для этой страницы */}
                <link rel="stylesheet" href="/css/leaderboard.css" />
            </Head>

            <Header />
            <DrawerMenu />

            <main className="min-h-screen"> {/* Базовый контейнер для контента */}
                {/* Сюда будем переносить HTML-содержимое из leaderboard.html */}
                {/* <div className="text-center py-10">
                    <h1 className="text-4xl font-bold">Leaderboard</h1>
                    <p className="mt-4">Содержимое страницы таблицы лидеров будет здесь.</p>
                    Placeholder для секций из leaderboard.html
                </div> */}

                <section className="relative -translate-y-16 max-md:overflow-hidden">
                    {/* В Next.js пути к изображениям из папки public начинаются с / */}
                    <img src="/images/leaderboard/welcome.svg" className="w-full left-1/2 -translate-x-1/2 max-md:max-w-[200%] absolute inset-0" alt="Welcome Background" />
                    <div className="relative z-10 pt-20">
                        <img src="/images/memoitica.svg" className="w-72 h-64 object-cover mx-auto" alt="Memeotica Logo" />
                        <h1 className="text-5xl md:text-[4.5rem] leading-none text-center font-light">Leaderboard</h1>
                        <h2 className="max-md:text-xl max-w-[28rem] text-center mt-4 mx-auto">Climb to the first places and get extra rewards during the competitions and special events</h2>
                    </div>
                </section>

                <section className="">
                    <div className="content grid gap-6 text-center grid-cols-1 md:grid-cols-3">
                        <div className="px-10 py-6 pt-4 bg-[#0602131A] rounded-[4rem] shadow-card">
                            <div className="relative">
                                <img src="/images/leaderboard/gold.svg" className="w-56 transition-all hover:-translate-y-5 h-56 mx-auto relative z-10" alt="Gold Medal" />
                                <img src="/images/leaderboard/gold.svg" className="blur-[4rem] absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" alt="Gold Medal Blur" />
                            </div>
                            <div className="relative z-10">
                                <p className="font-semibold max-md:text-xl text-[#FDB022] mt-5">9c2...xCV</p>
                                <p className="mt-4 text-2xl md:text-xl">74 393</p>
                                <p className="max-md:text-xl mt-3">Every season event will get extra lootbox and coins aidrop</p>
                            </div>
                        </div>
                        <div className="px-10 py-6 pt-4 bg-[#0602131A] rounded-[4rem] shadow-card">
                            <div className="relative">
                                <img src="/images/leaderboard/silver.svg" className="w-56 transition-all hover:-translate-y-5 h-56 mx-auto relative z-10" alt="Silver Medal" />
                                <img src="/images/leaderboard/silver.svg" className="blur-[4rem] absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" alt="Silver Medal Blur" />
                            </div>
                            <div className="relative z-10">
                                <p className="font-semibold max-md:text-xl text-[#98A2B3] mt-5">Bqp...ad</p>
                                <p className="mt-4 text-2xl md:text-xl">53 417</p>
                                <p className="max-md:text-xl mt-3">Every season event will get extra lootbox and coins aidrop</p>
                            </div>
                        </div>
                        <div className="px-10 py-6 pt-4 bg-[#0602131A] rounded-[4rem] shadow-card">
                            <div className="relative">
                                <img src="/images/leaderboard/bronze.svg" className="w-56 transition-all hover:-translate-y-5 h-56 mx-auto relative z-10" alt="Bronze Medal" />
                                <img src="/images/leaderboard/bronze.svg" className="blur-[4rem] absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" alt="Bronze Medal Blur" />
                            </div>
                            <div className="relative z-10">
                                <p className="font-semibold max-md:text-xl text-[#D27B21] mt-5">EBU...vcF</p>
                                <p className="mt-4 text-2xl md:text-xl">Compete in the Arena</p> { /* Оригинальный текст был "Compete in the Arena", оставил как есть. Если это должно быть число, нужно уточнить */}
                                <p className="max-md:text-xl mt-3">Every season event will get extra lootbox and coins aidrop</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="content mt-12">
                        <table className="border-spacing-y-2 border-separate w-full">
                            <thead className="max-md:hidden text-[#ffa500]">
                                <tr>
                                    <th className="w-11 h-11"></th>
                                    <th>Wallet</th>
                                    <th>Votes</th>
                                    <th>Hold amount</th>
                                    <th>Cards</th>
                                    <th>Battle wins</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            {/* id="table-body" будет управляться React состоянием и JSX маппингом */}
                            <tbody className="text-center" id="table-body">
                                {/* Сюда будут рендериться строки таблицы лидеров из leaderboardData */}
                                {/* Пример одной строки (позже будет генерироваться динамически):
                                <tr>
                                    <td>1</td>
                                    <td>0x123...abc</td>
                                    <td>1500</td>
                                    <td>10000 MEME</td>
                                    <td>5</td>
                                    <td>20</td>
                                    <td>12345</td>
                                </tr>
                                */} 
                            </tbody>
                        </table>
                        {/* id="card-list" для мобильных, также будет управляться React */}
                        <div className="card-list max-md:flex max-md:flex-col max-md:gap-4 hidden" id="card-list">
                            {/* Сюда будут рендериться карточки для мобильной версии */}
                        </div>
                        {/* id="pagination" для пагинации, также будет управляться React */}
                        <div className="pagination mt-12" id="pagination">
                            {/* Компонент пагинации или логика */}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
} 