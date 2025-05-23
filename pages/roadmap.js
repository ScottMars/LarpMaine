import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Компоненты Header, DrawerMenu, Footer (предполагается, что они идентичны тем, что в leaderboard.js/winner.js)
// Если они вынесены в общий Layout, это будет еще лучше.
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
                <li data-mobile-disable className=""><Link href="/reward" className="px-1 w-full">Rewards</Link></li>
                <li data-mobile-disable className=""><Link href="/vote" className="px-1 w-full">Voting</Link></li>
                <li data-mobile-disable className=""><a target="_blank" rel="noopener noreferrer" className="px-1 w-full" href="https://memeotica.gitbook.io/memoticfun">Whitepaper</a></li>
                <li data-mobile-disable className=" text-white font-bold"><Link href="/roadmap" className="px-1 w-full">Roadmap</Link></li> {/* Активная ссылка */}
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
                <li className=""><Link href="/reward" className="px-1 py-4 block w-full">Rewards</Link></li>
                <li className=""><Link href="/vote" className="px-1 py-4 block w-full">Voting</Link></li>
                <li className=""><a target="_blank" rel="noopener noreferrer" className="px-1 py-4 block w-full" href="https://memeotica.gitbook.io/memoticfun">Whitepaper</a></li>
                <li className=" text-white font-bold"><Link href="/roadmap" className="px-1 py-4 block w-full">Roadmap</Link></li> {/* Активная ссылка */}
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

export default function RoadmapPage() {
    return (
        <>
            <Head>
                <title>Roadmap - Memeotica</title>
                <link rel="icon" type="image/png" href="/images/Favicon memeotica.png" />
                {/* index.css уже подключен глобально в _document.js */}
                {/* Подключаем roadmap.css специфично для этой страницы */}
                <link rel="stylesheet" href="/css/roadmap.css" />
            </Head>

            <Header />
            <DrawerMenu />

            <main className="min-h-screen">
                <section className="relative -translate-y-16 max-md:overflow-hidden">
                    <img src="/images/roadmap/welcome.svg" className="w-full left-1/2 -translate-x-1/2 max-md:max-w-[200%] absolute inset-0" alt="Welcome Background" />
                    <div className="relative z-10 pt-20">
                        <img src="/images/memoitica.svg" className="w-72 h-64 object-cover mx-auto" alt="Memeotica Logo" />
                        <h1 className="text-5xl md:text-[4.5rem] leading-none text-center font-light">Roadmap</h1>
                    </div>
                </section>

                <section className="">
                    <div className="relative z-10 mx-auto md:max-w-[60%] flex gap-4 max-md:px-5 md:gap-8">
                        <div className="h-full">
                            <img className="md:w-20 md:h-20 w-12 h-12" src="/images/roadmap/star.svg" alt="star" />
                            <div className="w-0.5 line h-56 md:h-28"></div>
                            <img className="md:w-20 md:h-20 w-12 h-12" src="/images/roadmap/star.svg" alt="star" />
                            <div className="w-0.5 line h-72 md:h-44"></div>
                            <img className="md:w-20 md:h-20 w-12 h-12" src="/images/roadmap/star.svg" alt="star" />
                            <div className="w-0.5 line h-72 md:h-48"></div>
                            <img className="md:w-20 md:h-20 w-12 h-12" src="/images/roadmap/star.svg" alt="star" />
                        </div>
                        <div className="space-y-10">
                            {/* Этап 1: 2025 – Q2 */}
                            <div className="py-6 px-8 rounded-[2.5rem] shadow-card">
                                <p className="text-2xl font-semibold">2025 – Q2</p>
                                <div className="grid mt-6 gap-y-6 grid-cols-1 md:grid-cols-2">
                                    <div className="transition-all hover:-translate-y-5 flex items-center gap-4">
                                        <div className="min-w-12 h-12 flex justify-center items-center border border-[#9B8AFB] bg-[#7A5AF8] rounded-lg">
                                            <svg className="w-6 h-6" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2V22M19.0711 4.92893L4.92893 19.0711M22 12H2M19.0711 19.0711L4.92893 4.92893" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <p>MVP launch: voting, meme tokens, lootboxes</p>
                                    </div>
                                    <div className="transition-all hover:-translate-y-5 flex items-center gap-4">
                                        <div className="w-12 h-12 flex justify-center items-center border border-[#9B8AFB] bg-[#7A5AF8] rounded-lg">
                                            <svg className="w-6 h-6" width="100%" height="100%"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.49954 9H21.4995M9.99954 3L7.99954 9L11.9995 20.5L15.9995 9L13.9995 3M12.6141 20.2625L21.5727 9.51215C21.7246 9.32995 21.8005 9.23885 21.8295 9.13717C21.8551 9.04751 21.8551 8.95249 21.8295 8.86283C21.8005 8.76114 21.7246 8.67005 21.5727 8.48785L17.2394 3.28785C17.1512 3.18204 17.1072 3.12914 17.0531 3.09111C17.0052 3.05741 16.9518 3.03238 16.8953 3.01717C16.8314 3 16.7626 3 16.6248 3H7.37424C7.2365 3 7.16764 3 7.10382 3.01717C7.04728 3.03238 6.99385 3.05741 6.94596 3.09111C6.89192 3.12914 6.84783 3.18204 6.75966 3.28785L2.42633 8.48785C2.2745 8.67004 2.19858 8.76114 2.16957 8.86283C2.144 8.95249 2.144 9.04751 2.16957 9.13716C2.19858 9.23885 2.2745 9.32995 2.42633 9.51215L11.385 20.2625C11.596 20.5158 11.7015 20.6424 11.8279 20.6886C11.9387 20.7291 12.0603 20.7291 12.1712 20.6886C12.2975 20.6424 12.4031 20.5158 12.6141 20.2625Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <p>First airdrops and UI rollout</p>
                                    </div>
                                </div>
                            </div>

                            {/* Этап 2: 2025 – Q3 */}
                            <div className="py-6 px-8 rounded-[2.5rem] shadow-card">
                                <p className="text-2xl font-semibold">2025 – Q3</p>
                                <div className="grid mt-6 gap-y-6 grid-cols-1 md:grid-cols-2">
                                    <div className="transition-all hover:-translate-y-5 flex items-center gap-4">
                                        <div className="w-12 h-12 flex justify-center items-center border border-[#9B8AFB] bg-[#7A5AF8] rounded-lg">
                                            <svg className="w-6 h-6" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="3" y="2" width="13" height="18" rx="3" stroke="white" strokeWidth="2"/>
                                                <path d="M20.4678 4.24707L20.666 4.30469C22.6795 4.95527 23.8506 7.07851 23.2969 9.14551L20.1904 20.7363L20.1328 20.9346C19.5032 22.883 17.4944 24.0432 15.4922 23.6143L15.292 23.5654L8.53027 21.7539L8.33203 21.6953C7.40155 21.3946 6.65147 20.7789 6.16797 20H9.71484L15.8096 21.6338L16.0098 21.6768C17.0103 21.8387 17.9908 21.2188 18.2588 20.2188L21.3643 8.62793C21.6501 7.561 21.0171 6.46459 19.9502 6.17871L16 5.12012V3.04883L20.4678 4.24707Z" fill="white"/>
                                            </svg>
                                        </div>
                                        <p>Card collection features</p>
                                    </div>
                                    <div className="transition-all hover:-translate-y-5 flex items-center gap-4">
                                        <div className="w-12 h-12 flex justify-center items-center border border-[#9B8AFB] bg-[#7A5AF8] rounded-lg">
                                            <svg className="w-6 h-6" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 15C8.68629 15 6 12.3137 6 9V3.44444C6 3.0306 6 2.82367 6.06031 2.65798C6.16141 2.38021 6.38021 2.16141 6.65798 2.06031C6.82367 2 7.0306 2 7.44444 2H16.5556C16.9694 2 17.1763 2 17.342 2.06031C17.6198 2.16141 17.8386 2.38021 17.9397 2.65798C18 2.82367 18 3.0306 18 3.44444V9C18 12.3137 15.3137 15 12 15ZM12 15V18M18 4H20.5C20.9659 4 21.1989 4 21.3827 4.07612C21.6277 4.17761 21.8224 4.37229 21.9239 4.61732C22 4.80109 22 5.03406 22 5.5V6C22 6.92997 22 7.39496 21.8978 7.77646C21.6204 8.81173 20.8117 9.62038 19.7765 9.89778C19.395 10 18.93 10 18 10M6 4H3.5C3.03406 4 2.80109 4 2.61732 4.07612C2.37229 4.17761 2.17761 4.37229 2.07612 4.61732C2 4.80109 2 5.03406 2 5.5V6C2 6.92997 2 7.39496 2.10222 7.77646C2.37962 8.81173 3.18827 9.62038 4.22354 9.89778C4.60504 10 5.07003 10 6 10M7.44444 22H16.5556C16.801 22 17 21.801 17 21.5556C17 19.5919 15.4081 18 13.4444 18H10.5556C8.59188 18 7 19.5919 7 21.5556C7 21.801 7.19898 22 7.44444 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <p>Leaderboard + profile system</p>
                                    </div>
                                    <div className="transition-all hover:-translate-y-5 flex items-center gap-4">
                                        <div className="w-12 h-12 flex justify-center items-center border border-[#9B8AFB] bg-[#7A5AF8] rounded-lg">
                                            <svg className="w-6 h-6" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.86866 15.4599L7 22L11.5884 19.247C11.7381 19.1572 11.8129 19.1123 11.8928 19.0947C11.9634 19.0792 12.0366 19.0792 12.1072 19.0947C12.1871 19.1123 12.2619 19.1572 12.4116 19.247L17 22L16.1319 15.4571M16.4259 4.24888C16.5803 4.6224 16.8768 4.9193 17.25 5.0743L18.5589 5.61648C18.9325 5.77121 19.2292 6.06799 19.384 6.44154C19.5387 6.81509 19.5387 7.23481 19.384 7.60836L18.8422 8.91635C18.6874 9.29007 18.6872 9.71021 18.8427 10.0837L19.3835 11.3913C19.4602 11.5764 19.4997 11.7747 19.4997 11.975C19.4998 12.1752 19.4603 12.3736 19.3837 12.5586C19.3071 12.7436 19.1947 12.9118 19.0531 13.0534C18.9114 13.195 18.7433 13.3073 18.5582 13.3839L17.2503 13.9256C16.8768 14.0801 16.5799 14.3765 16.4249 14.7498L15.8827 16.0588C15.728 16.4323 15.4312 16.7291 15.0577 16.8838C14.6841 17.0386 14.2644 17.0386 13.8909 16.8838L12.583 16.342C12.2094 16.1877 11.7899 16.188 11.4166 16.3429L10.1077 16.8843C9.73434 17.0387 9.31501 17.0386 8.94178 16.884C8.56854 16.7293 8.27194 16.4329 8.11711 16.0598L7.57479 14.7504C7.42035 14.3769 7.12391 14.08 6.75064 13.925L5.44175 13.3828C5.06838 13.2282 4.77169 12.9316 4.61691 12.5582C4.46213 12.1849 4.46192 11.7654 4.61633 11.3919L5.1581 10.0839C5.31244 9.71035 5.31213 9.29079 5.15722 8.91746L4.61623 7.60759C4.53953 7.42257 4.50003 7.22426 4.5 7.02397C4.49997 6.82369 4.5394 6.62536 4.61604 6.44032C4.69268 6.25529 4.80504 6.08716 4.94668 5.94556C5.08832 5.80396 5.25647 5.69166 5.44152 5.61508L6.74947 5.07329C7.12265 4.91898 7.41936 4.6229 7.57448 4.25004L8.11664 2.94111C8.27136 2.56756 8.56813 2.27078 8.94167 2.11605C9.3152 1.96132 9.7349 1.96132 10.1084 2.11605L11.4164 2.65784C11.7899 2.81218 12.2095 2.81187 12.5828 2.65696L13.8922 2.11689C14.2657 1.96224 14.6853 1.96228 15.0588 2.11697C15.4322 2.27167 15.729 2.56837 15.8837 2.94182L16.426 4.25115L16.4259 4.24888Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <p>Daily quests</p>
                                    </div>
                                </div>
                            </div>

                            {/* Этап 3: 2025 – Q4 */}
                            <div className="py-6 px-8 rounded-[2.5rem] shadow-card">
                                <p className="text-2xl font-semibold">2025 – Q4</p>
                                <div className="grid mt-6 gap-y-6 grid-cols-1 md:grid-cols-2">
                                    <div className="transition-all hover:-translate-y-5 flex items-center gap-4">
                                        <div className="w-12 h-12 flex justify-center items-center border border-[#9B8AFB] bg-[#7A5AF8] rounded-lg">
                                            <svg className="w-6 h-6" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22 14.0833C22 13.3933 21.4408 12.8333 20.75 12.8333C20.3075 12.8333 19.4042 13.09 18.3583 13.6367L16.7217 12L18.4942 10.2325C20.0492 8.68167 21.2333 6.75833 21.9175 4.67083C22.41 3.16333 20.8367 1.59833 19.3308 2.105C17.2542 2.78583 15.3392 3.9625 13.7925 5.505L12.0067 7.28583L10.235 5.51333C8.695 3.97333 6.78833 2.79833 4.71917 2.11417C3.20917 1.5775 1.60583 3.16167 2.11083 4.67917C2.79333 6.76 3.97333 8.68 5.5225 10.2283L7.28833 11.9942L5.64167 13.6367C4.595 13.09 3.69167 12.8333 3.25 12.8333C2.55917 12.8333 2 13.3933 2 14.0833C2 14.7492 2.52083 15.2933 3.1775 15.3308C3.45833 15.3808 4.49667 15.7242 5.64417 16.5808L3.19833 19.0333C2.71083 19.5225 2.71167 20.3142 3.20083 20.8017C3.68917 21.2892 4.48083 21.2875 4.96833 20.7992L7.4125 18.3483C8.27333 19.4992 8.61833 20.5408 8.66917 20.8233C8.7075 21.4792 9.25167 21.9992 9.9175 21.9992C10.6083 21.9992 11.1675 21.4392 11.1675 20.7492C11.1675 20.3058 10.9083 19.3992 10.3575 18.3475L12.0025 16.7067L13.6433 18.3475C13.0925 19.3983 12.8333 20.3058 12.8333 20.7492C12.8333 21.4392 13.3925 21.9992 14.0833 21.9992C14.7492 21.9992 15.2933 21.4792 15.3317 20.8233C15.3825 20.5408 15.7275 19.4992 16.5883 18.3483L19.0325 20.7992C19.52 21.2867 20.3117 21.2892 20.8 20.8017C21.2892 20.3142 21.29 19.5225 20.8025 19.0333L18.3567 16.5808C19.5042 15.7233 20.5425 15.3808 20.8233 15.3308C21.48 15.2933 22 14.7492 22 14.0833ZM7.29 8.46083C6.2475 7.41833 5.40917 6.1725 4.835 4.82833C6.1875 5.40583 7.42917 6.2425 8.46833 7.28167L10.2383 9.05167L9.05833 10.2292L7.29 8.46083ZM8.3625 15.63C8.16083 15.4283 7.95417 15.2467 7.74667 15.0683L15.5592 7.27417C16.5908 6.24583 17.8217 5.41583 19.1875 4.83C18.6083 6.1825 17.7692 7.42333 16.7283 8.4625L8.925 16.2458C8.74667 16.0383 8.56417 15.8308 8.3625 15.6292V15.63ZM13.7717 14.9425L14.9517 13.7658L16.2533 15.0675C15.8367 15.415 15.4225 15.8292 15.075 16.2458L13.7717 14.9425Z" fill="white"/>
                                            </svg>
                                        </div>
                                        <p>PvP battles unlocked</p>
                                    </div>
                                    <div className="transition-all hover:-translate-y-5 flex items-center gap-4">
                                        <div className="w-12 h-12 flex justify-center items-center border border-[#9B8AFB] bg-[#7A5AF8] rounded-lg">
                                            <svg className="w-6 h-6" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 13V17.8C20 18.9201 20 19.4802 19.782 19.908C19.5903 20.2843 19.2843 20.5903 18.908 20.782C18.4802 21 17.9201 21 16.8 21H7.2C6.0799 21 5.51984 21 5.09202 20.782C4.71569 20.5903 4.40973 20.2843 4.21799 19.908C4 19.4802 4 18.9201 4 17.8V13M9 10H15M9.28571 14H14.7143C16.8467 14 17.913 14 18.7355 13.6039C19.552 13.2107 20.2107 12.552 20.6039 11.7355C21 10.913 21 9.84674 21 7.71429C21 6.11494 21 5.31527 20.7029 4.69835C20.408 4.08603 19.914 3.59197 19.3017 3.29709C18.6847 3 17.8851 3 16.2857 3H7.71429C6.11494 3 5.31527 3 4.69835 3.29709C4.08603 3.59197 3.59197 4.08603 3.29709 4.69835C3 5.31527 3 6.11494 3 7.71429C3 9.84674 3 10.913 3.39612 11.7355C3.7893 12.552 4.44803 13.2107 5.26447 13.6039C6.08703 14 7.15326 14 9.28571 14Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <p>Battle Pass system</p>
                                    </div>
                                    <div className="transition-all hover:-translate-y-5 flex items-center gap-4">
                                        <div className="w-12 h-12 flex justify-center items-center border border-[#9B8AFB] bg-[#7A5AF8] rounded-lg">
                                            <svg className="w-6 h-6" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15 2V3.4C15 3.96005 15 4.24008 14.891 4.45399C14.7951 4.64215 14.6422 4.79513 14.454 4.89101C14.2401 5 13.9601 5 13.4 5H10.6C10.0399 5 9.75992 5 9.54601 4.89101C9.35785 4.79513 9.20487 4.64215 9.10899 4.45399C9 4.24008 9 3.96005 9 3.4V2M8.2 22H15.8C16.9201 22 17.4802 22 17.908 21.782C18.2843 21.5903 18.5903 21.2843 18.782 20.908C19 20.4802 19 19.9201 19 18.8V5.2C19 4.07989 19 3.51984 18.782 3.09202C18.5903 2.71569 18.2843 2.40973 17.908 2.21799C17.4802 2 16.9201 2 15.8 2H8.2C7.0799 2 6.51984 2 6.09202 2.21799C5.71569 2.40973 5.40973 2.71569 5.21799 3.09202C5 3.51984 5 4.0799 5 5.2V18.8C5 19.9201 5 20.4802 5.21799 20.908C5.40973 21.2843 5.71569 21.5903 6.09202 21.782C6.51984 22 7.07989 22 8.2 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <p>Mobile web optimization</p>
                                    </div>
                                </div>
                            </div>

                            {/* Этап 4: 2026 – Q1 */}
                            <div className="py-6 px-8 rounded-[2.5rem] shadow-card">
                                <p className="text-2xl font-semibold">2026 – Q1</p>
                                <div className="grid mt-6 gap-y-6 grid-cols-1 md:grid-cols-2">
                                    <div className="transition-all hover:-translate-y-5 flex items-center gap-4">
                                        <div className="w-12 h-12 flex justify-center items-center border border-[#9B8AFB] bg-[#7A5AF8] rounded-lg">
                                            <svg className="w-6 h-6" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.5 7.5H13.75C14.9926 7.5 16 8.50736 16 9.75C16 10.9926 14.9926 12 13.75 12H9.5H14.25C15.4926 12 16.5 13.0074 16.5 14.25C16.5 15.4926 15.4926 16.5 14.25 16.5H9.5M9.5 7.5H8M9.5 7.5V16.5M9.5 16.5H8M10 6V7.5M10 16.5V18M13 6V7.5M13 16.5V18M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <p>$MEMEOTICA token launch</p>
                                    </div>
                                    <div className="transition-all hover:-translate-y-5 flex items-center gap-4">
                                        <div className="w-12 h-12 flex justify-center items-center border border-[#9B8AFB] bg-[#7A5AF8] rounded-lg">
                                            <svg className="w-6 h-6" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 12L11 14L15.5 9.5M7.33377 3.8187C8.1376 3.75455 8.90071 3.43846 9.51447 2.91542C10.9467 1.69486 13.0533 1.69486 14.4855 2.91542C15.0993 3.43846 15.8624 3.75455 16.6662 3.8187C18.5421 3.96839 20.0316 5.45794 20.1813 7.33377C20.2455 8.1376 20.5615 8.90071 21.0846 9.51447C22.3051 10.9467 22.3051 13.0533 21.0846 14.4855C20.5615 15.0993 20.2455 15.8624 20.1813 16.6662C20.0316 18.5421 18.5421 20.0316 16.6662 20.1813C15.8624 20.2455 15.0993 20.5615 14.4855 21.0846C13.0533 22.3051 10.9467 22.3051 9.51447 21.0846C8.90071 20.5615 8.1376 20.2455 7.33377 20.1813C5.45794 20.0316 3.96839 18.5421 3.8187 16.6662C3.75455 15.8624 3.43846 15.0993 2.91542 14.4855C1.69486 13.0533 1.69486 10.9467 2.91542 9.51447C3.43846 8.90071 3.75455 8.1376 3.8187 7.33377C3.96839 5.45794 5.45794 3.96839 7.33377 3.8187Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <p>DAO voting on events</p>
                                    </div>
                                    <div className="transition-all hover:-translate-y-5 flex items-center gap-4">
                                        <div className="w-12 h-12 flex justify-center items-center border border-[#9B8AFB] bg-[#7A5AF8] rounded-lg">
                                            <svg className="w-6 h-6" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10 17.6586V20C10 21.1046 10.8954 22 12 22C13.1046 22 14 21.1046 14 20V17.6586M12 2V3M3 12H2M5.5 5.5L4.8999 4.8999M18.5 5.5L19.1002 4.8999M22 12H21M18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <p>Partnerships with civic orgs and influencers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
} 