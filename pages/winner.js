import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Временные компоненты Header и DrawerMenu (можно вынести в отдельные файлы)
const Header = () => (
    <header className=" sticky top-4 mt-4 z-40">
        <nav>
            <ul className=" flex items-center gap-10">
                <li id="menu" className="flex gap-4 md:hidden">
                    {/* SVG иконка меню */}
                    <svg className=" w-5 h-5" width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 10H17.5M2.5 5H17.5M2.5 15H12.5" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className=" w-px block bg-white/30"></span>
                </li>
                {/* Пункты меню для десктопа */}
                <li data-mobile-disable className=""><Link href="/" className="px-1 w-full">Home</Link></li>
                <li data-mobile-disable className=""><Link href="/rules" className="px-1 w-full">Rules</Link></li>
                <li data-mobile-disable className=""><Link href="/coming" className="px-1 w-full">Rewards</Link></li>
                <li data-mobile-disable className=""><Link href="/vote" className="px-1 w-full">Voting</Link></li>
                <li data-mobile-disable className=""><a target="_blank" rel="noopener noreferrer" className="px-1 w-full" href="https://memeotica.gitbook.io/memoticfun">Whitepaper</a></li>
                <li data-mobile-disable className=""><Link href="/roadmap" className="px-1 w-full">Roadmap</Link></li>
                <li data-mobile-disable className=""><Link href="/leaderboard" className="px-1 w-full">Leaderboard</Link></li>
                {/* Социальные иконки */}
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
                {/* SVG иконка закрытия */}
                <svg className="w-6 h-6" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 7L7 17M7 7L17 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Close
            </button>
            <ul className="divide-y divide-white/10">
                {/* Пункты меню для мобильных */}
                <li className=""><Link href="/" className="px-1 py-4 block w-full">Home</Link></li>
                <li className=""><Link href="/rules" className="px-1 py-4 block w-full">Rules</Link></li>
                <li className=""><Link href="/coming" className="px-1 py-4 block w-full">Rewards</Link></li>
                <li className=""><Link href="/vote" className="px-1 py-4 block w-full">Voting</Link></li>
                <li className=""><a target="_blank" rel="noopener noreferrer" className="px-1 py-4 block w-full" href="https://memeotica.gitbook.io/memoticfun">Whitepaper</a></li>
                <li className=""><Link href="/roadmap" className="px-1 py-4 block w-full">Roadmap</Link></li>
                <li className=""><Link href="/leaderboard" className="px-1 py-4 block w-full">Leaderboard</Link></li>
            </ul>
        </div>
        {/* Добавить скрипт для открытия/закрытия меню позже */}
    </div>
);

const Footer = () => (
    <footer>
        <div className=" flex content text-right max-md:text-lg justify-between md:justify-center text-white/50 gap-10 items-center border-t border-white/20 mt-14 py-4 ">
            <p className=" max-md:hidden">Memeotica. 2025</p>
            <img src="/images/memoitica.svg" className="  w-24 h-24 " alt="Memeotica Logo"/>
            <div className=" ">
                <p className="max-md:mb-2 md:hidden">Memeotica. 2025</p>
                <p className=" ">© All rights reserved</p>
            </div>
        </div>
    </footer>
);

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function WinnerPage() {
    const [voteData, setVoteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countdown, setCountdown] = useState('');
    const router = useRouter();
    const { voteId } = router.query;

    // Эффект для загрузки данных голосования по voteId
    useEffect(() => {
        if (!router.isReady) return;

        async function fetchVoteById() {
            if (!voteId) {
                setError("Vote ID not specified in URL.");
                setLoading(false);
                setVoteData(null);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                console.log(`WinnerPage: Fetching /api/vote/${voteId}`);
                const response = await fetch(`/api/vote/${voteId}`);
                console.log(`WinnerPage: Response status for vote ${voteId}: ${response.status}`);

                if (response.status === 404) {
                    console.log(`WinnerPage: Vote with ID ${voteId} not found.`);
                    setError(`Vote with ID ${voteId} not found or results are unavailable.`);
                    setVoteData(null);
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
                    console.error(`WinnerPage: API error for vote ${voteId}:`, errorData);
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(`WinnerPage: Received vote data for ID ${voteId}:`, data);
                setVoteData(data);

            } catch (err) {
                console.error(`WinnerPage: Error fetching vote ${voteId}:`, err);
                setError(err.message || 'Failed to load winner data.');
                setVoteData(null);
            } finally {
                setLoading(false);
            }
        }

        fetchVoteById();
    }, [router.isReady, voteId]);

    // Эффект для таймера обратного отсчета до display_until_date
    useEffect(() => {
        if (!voteData) return;

        const displayUntilDate = new Date(voteData.display_until_date);
        let intervalId;

        const updateCountdown = () => {
            const now = new Date();
            const remainingSeconds = Math.floor((displayUntilDate - now) / 1000);

            if (remainingSeconds > 0) {
                setCountdown(formatTime(remainingSeconds));
            } else {
                setCountdown('00:00:00');
                clearInterval(intervalId);
                console.log("WinnerPage: Display time ended, redirecting to /vote");
                router.push('/vote'); // Перенаправление на страницу голосования (или главную)
            }
        };

        updateCountdown();
        intervalId = setInterval(updateCountdown, 1000);

        return () => clearInterval(intervalId);
    }, [voteData, router]);

    // Определение данных победителя на основе voteData
    let winnerName = 'Winner not determined';
    let winnerImageUrl = '/images/image-2.png'; // Дефолтное изображение
    let winnerVotesDisplay = '--';
    let winnerVotesColor = 'text-white';

    if (voteData) {
        if (voteData.winner === 'left') {
            winnerName = voteData.left_name || 'Left Side';
            winnerImageUrl = voteData.left_image || '/images/image-2.png';
            winnerVotesDisplay = voteData.choices_no; // choices_no для левой стороны
            winnerVotesColor = 'text-[#FF3030]'; // Пример цвета для левой стороны
        } else if (voteData.winner === 'right') {
            winnerName = voteData.right_name || 'Right Side';
            winnerImageUrl = voteData.right_image || '/images/image-2.png';
            winnerVotesDisplay = voteData.choices_yes; // choices_yes для правой стороны
            winnerVotesColor = 'text-[#12B76A]'; // Пример цвета для правой стороны
        }
    }

    return (
        <>
            <Head>
                <title>{winnerName && winnerName !== 'Winner not determined' ? `${winnerName} - ` : ''}Voting Results - Memeotica</title>
                <link rel="icon" type="image/png" href="/images/Favicon memeotica.png" />
            </Head>

            <Header />
            <DrawerMenu />

            <main className="min-h-screen"> {/* Добавил min-h-screen для лучшего вида при ошибках */}
                {loading && <p className="text-center text-xl mt-10">Loading winner data...</p>}
                {error && (
                    <div className="text-center text-xl mt-10 text-red-500">
                        <p>Error: {error}</p>
                        <Link href="/" className="text-blue-500 underline mt-4 inline-block">Back to Home</Link>
                    </div>
                )}

                {voteData && !loading && !error && (
                    <>
                        <div className="text-center pt-10"> {/* Добавляем pt-10 как в winner.html, убираем pb-10 */}
                            <div className="mx-auto relative w-fit h-fit md:-translate-x-12">
                                <img src={winnerImageUrl} alt={winnerName || 'Winner'} className="w-64 h-64 md:w-[32rem] md:h-[32rem] object-contain winner-image" /> {/* object-contain */}
                                <img src="/images/winner.png" alt="WINNER" className="w-full h-auto max-h-64 md:max-h-80 object-contain md:translate-x-12 -bottom-24 md:-bottom-20 absolute" /> {/* Исправляем позиционирование и размер картинки "winner" */}
                            </div>
                            <p className="winner-name text-4xl mt-3 font-bold">{winnerName}</p> {/* Уменьшаем mt с 8 до 3 */}
                            <p className={`winner-votes text-2xl font-semibold ${winnerVotesColor} mt-1`}>{winnerVotesDisplay} VOTES</p> {/* Уменьшаем mt с 2 до 1 */}
                            <div className="w-fit mx-auto flex gap-2 items-center px-4 py-2 bg-black/40 rounded-full mt-4 text-[#32D583] text-lg font-semibold">
                                <svg className="w-6 h-6" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.9277 6.85706L9.92773 17.8571L4.92773 12.8571" stroke="#32D583" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Coin launched
                            </div>
                            <a href={voteData.url_contract_address || '#'} target="_blank" rel="noopener noreferrer" className="block mt-1 text-sm text-gray-400 hover:underline">Contract Address</a>
                        </div>
                        <div className="flex flex-col items-center mt-12 mb-16"> {/* Добавляем mt-12 */}
                            <p className="text-3xl font-medium" id="countdown">{countdown}</p>
                            <p className="mt-1 text-gray-300">Until the next vote</p>
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </>
    );
} 