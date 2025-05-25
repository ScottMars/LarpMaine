import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Компоненты Header, DrawerMenu, Footer 
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
                {/* При необходимости, обновите активную ссылку для /reward здесь */}
                <li data-mobile-disable className="text-white font-bold"><Link href="/reward" className="px-1 w-full">Rewards</Link></li> 
                <li data-mobile-disable className=""><Link href="/vote" className="px-1 w-full">Voting</Link></li>
                <li data-mobile-disable className=""><a target="_blank" rel="noopener noreferrer" className="px-1 w-full" href="https://memeotica.gitbook.io/memoticfun">Whitepaper</a></li>
                <li data-mobile-disable className=""><Link href="/roadmap" className="px-1 w-full">Roadmap</Link></li>
                <li data-mobile-disable className=""><Link href="/leaderboard" className="px-1 w-full">Leaderboard</Link></li>
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
                 {/* При необходимости, обновите активную ссылку для /reward здесь */}
                <li className="text-white font-bold"><Link href="/reward" className="px-1 py-4 block w-full">Rewards</Link></li>
                <li className=""><Link href="/vote" className="px-1 py-4 block w-full">Voting</Link></li>
                <li className=""><a target="_blank" rel="noopener noreferrer" className="px-1 py-4 block w-full" href="https://memeotica.gitbook.io/memoticfun">Whitepaper</a></li>
                <li className=""><Link href="/roadmap" className="px-1 py-4 block w-full">Roadmap</Link></li>
                <li className=""><Link href="/leaderboard" className="px-1 py-4 block w-full">Leaderboard</Link></li>
            </ul>
        </div>
    </div>
);

const Footer = () => (
    <footer>
        <div className=" flex content text-right max-md:text-lg justify-between md:justify-center text-white/50 gap-10 items-center border-t border-white/20 mt-14 py-4 ">
            <p className=" max-md:hidden">Memeotica. 2025</p>
            <img src="/images/memoitica.svg" className="w-24 h-24" alt="Memeotica Logo"/>
            <div className="">
                <p className="max-md:mb-2 md:hidden">Memeotica. 2025</p>
                <p className="">© All rights reserved</p>
            </div>
        </div>
    </footer>
);

export default function RewardPage() { // Изменено имя функции
    return (
        <>
            <Head>
                <title>Rewards - Memeotica</title> {/* Изменен заголовок */}
                <link rel="icon" type="image/png" href="/images/Favicon memeotica.png" />
                {/* css/index.css и css/home.css подключены глобально в _document.js */}
                {/* Если для этой страницы нужны специфичные стили, которых нет в home.css, их можно добавить тут */}
            </Head>

            <Header />
            <DrawerMenu />

            <main className="min-h-screen">
                <section>
                    <div className="h-[calc(100vh-16rem)] flex justify-center relative items-center">
                        {/* Путь к изображению исправлен */}
                        <img className="md:w-[32rem] md:h-[32rem] w-80 h-80 relative z-10" src="/images/coming/coming.svg" alt="Coming Soon" />
                        <div className="absolute w-56 h-56 left-1/2 blur-[10rem] bg-[#FF9D00]"></div>
                        <div className="absolute w-56 h-56 right-1/2 blur-[10rem] bg-[#A001E7]"></div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
} 