import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link'; // Для внутренних ссылок
import Head from 'next/head'; // Для управления <head>
import Script from 'next/script'; // Для подключения Tailwind CSS
import { useRouter } from 'next/router'; // Для программного редиректа
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react'; // <-- Добавлено

// Это базовый компонент главной страницы.
// Вам нужно будет перенести сюда HTML-структуру из вашего index.html
// и интегрировать логику из js/index.js (например, вызов fetchVoteData)
// Используйте хуки React (useState, useEffect) для управления состоянием и жизненным циклом.

// --- Вспомогательная функция форматирования времени ---
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00:00';
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    let timeString = '';
    if (days > 0) {
        timeString += `${days}d `;
    }
    timeString += `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    return timeString;
}

// --- Компонент Header (можно вынести в отдельный файл) ---
function Header({ isDrawerOpen, setDrawerOpen }) {
    return (
        <>
            <header className="sticky top-4 mt-4 z-40">
                <nav>
                    <ul className="flex items-center gap-10">
                        <li id="menu" className="flex gap-4 md:hidden">
                            <button onClick={() => setDrawerOpen(true)} aria-label="Открыть меню" className="flex items-center">
                                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.5 10H17.5M2.5 5H17.5M2.5 15H12.5" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <span className="w-px block bg-white/30"></span>
                        </li>
                        {/* Используем Link для навигации внутри Next.js приложения */}
                        <li data-mobile-disable className="hidden md:block">
                            <Link href="/" className="px-1 w-full">Home</Link>
                        </li>
                        <li data-mobile-disable className="hidden md:block">
                            <Link href="/rules" className="px-1 w-full">Rules</Link>
                        </li>
                        <li data-mobile-disable className="hidden md:block">
                            <Link href="/reward" className="px-1 w-full">Rewards</Link>
                        </li>
                        <li data-mobile-disable className="hidden md:block">
                            <Link href="/vote" className="px-1 w-full">Voting</Link>
                        </li>
                        <li data-mobile-disable className="hidden md:block">
                            <a target="_blank" rel="noopener noreferrer" className="px-1 w-full" href="https://memeotica.gitbook.io/memoticfun">Whitepaper</a>
                        </li>
                        <li data-mobile-disable className="hidden md:block">
                            <Link href="/roadmap" className="px-1 w-full">Roadmap</Link>
                        </li>
                        <li data-mobile-disable className="hidden md:block">
                            <Link href="/leaderboard" className="px-1 w-full">Leaderboard</Link>
                        </li>
                        <li>
                            <a target="_blank" rel="noopener noreferrer" href="https://x.com/Memeotica_Game">
                                <img src="/images/header/x.svg" alt="Twitter X" className="w-5 h-5" />
                            </a>
                        </li>
                        <li>
                            <a target="_blank" rel="noopener noreferrer" href="https://t.me/memeotica_game">
                                <img src="/images/header/tg.svg" alt="Telegram" className="w-5 h-5" />
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>
            <DrawerMenu isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} />
        </>
    );
}

// --- Компонент DrawerMenu (можно вынести в отдельный файл) ---
function DrawerMenu({ isOpen, onClose }) {
    const drawerRef = useRef(null);

    // Закрытие по клику вне меню
    useEffect(() => {
        function handleClickOutside(event) {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                const menuButton = document.getElementById('menu'); // Находим кнопку меню
                if (!menuButton || !menuButton.contains(event.target)) { // Не закрывать, если клик по кнопке
                     onClose();
                }
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <div data-opened={isOpen} id="drawer-menu" className={`drawer ${isOpen ? 'drawer-open' : ''}`}>
            <div className="drawer-overflow" onClick={onClose}></div> {/* Оверлей для закрытия */} 
            <div ref={drawerRef} className="drawer-content text-xl bg-[#2D1E11] pt-4 px-6 pb-9 rounded-t-[3rem]">
                <button onClick={onClose} className="drawer-close absolute left-1/2 -translate-x-1/2 -top-12 flex gap-2 items-center py-1 pl-2 pr-3 rounded-full bg-[#7A5AF090]" aria-label="Закрыть меню">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 7L7 17M7 7L17 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Close
                </button>
                <ul className="divide-y divide-white/10">
                    <li onClick={onClose}><Link href="/" className="px-1 py-4 block w-full">Home</Link></li>
                    <li onClick={onClose}><Link href="/rules" className="px-1 py-4 block w-full">Rules</Link></li>
                    <li onClick={onClose}><Link href="/reward" className="px-1 py-4 block w-full">Rewards</Link></li>
                    <li onClick={onClose}><Link href="/vote" className="px-1 py-4 block w-full">Voting</Link></li>
                    <li onClick={onClose}><a target="_blank" rel="noopener noreferrer" className="px-1 py-4 block w-full" href="https://memeotica.gitbook.io/memoticfun">Whitepaper</a></li>
                    <li onClick={onClose}><Link href="/roadmap" className="px-1 py-4 block w-full">Roadmap</Link></li>
                    <li onClick={onClose}><Link href="/leaderboard" className="px-1 py-4 block w-full">Leaderboard</Link></li>
                </ul>
            </div>
        </div>
    );
}

// --- Компонент Footer (можно вынести в отдельный файл) ---
const Footer = () => (
    <footer>
        <div className=" flex content text-right max-md:text-lg justify-between md:justify-center text-white/50 gap-10 items-center border-t border-white/20 mt-14 py-4 ">
            <p className=" max-md:hidden">Memeotica. 2025</p>
            <img src="/images/memoitica.svg" className="  w-24 h-24 " alt="Memeotica Logo" />
            <div className=" ">
                <p className="max-md:mb-2 md:hidden">Memeotica. 2025</p>
                <p className=" ">© All rights reserved</p>
            </div>
        </div>
    </footer>
);

// --- Компонент виджета для клейма NFT ---
function NftClaimWidget({ onClick }) {
  return (
    <div 
      onClick={onClick}
      className="fixed bottom-5 right-5 md:bottom-10 md:right-10 z-50 cursor-pointer hover:scale-105 transition-transform duration-200"
    >
      <img 
        src="/images/ClaimNFT.png" 
        alt="Claim NFT" 
        className="w-32 md:w-40 h-auto"
      />
    </div>
  );
}

// --- Компонент модального окна для клейма NFT ---
function NftClaimModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [walletInput, setWalletInput] = React.useState('');
  const [statusMessage, setStatusMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSaveWallet = async () => {
    if (!walletInput.trim()) {
      setStatusMessage('Пожалуйста, введите адрес кошелька.');
      return;
    }
    setIsSubmitting(true);
    setStatusMessage(''); // Сброс предыдущего сообщения

    try {
      const response = await fetch('/api/record-nft-claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: walletInput }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatusMessage("Thank you. Magic will happen soon. Stay tuned! 🪄💫");
        setWalletInput(''); // Очистить инпут после успеха
      } else {
        // Обработка специфичных ошибок сервера, если они есть в result.error
        // Например, если кошелек уже существует (код 409)
        if (response.status === 409 && result.code === '23505') {
             setStatusMessage('Этот адрес кошелька уже был записан. Спасибо!');
        } else {
             setStatusMessage(result.error || 'Не удалось сохранить кошелек. Попробуйте позже.');
        }
      }
    } catch (error) {
      console.error('Ошибка при сохранении кошелька:', error);
      setStatusMessage('Произошла ошибка сети. Пожалуйста, проверьте ваше подключение.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Если есть сообщение об успешной отправке, не закрываем сразу, даем пользователю прочитать
  // onClose будет вызван по клику на крестик

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4">
      <div className="bg-[#2D1E11] p-6 md:p-8 rounded-xl shadow-xl text-white border border-yellow-400/50 max-w-md w-full relative">
        <button
          onClick={onClose} // Позволяем закрыть в любом состоянии
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 7L7 17M7 7L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="text-center">
          <img src="/images/ClaimNFT.png" alt="Claim NFT" className="w-24 h-24 rounded-full mx-auto mb-6 border-2 border-yellow-400" />
          
          {statusMessage === "Thank you. Magic will happen soon. Stay tuned! 🪄💫" || (statusMessage === 'Этот адрес кошелька уже был записан. Спасибо!') ? (
            <>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">Request Received!</h3>
              <p className="mb-6 text-lg text-gray-300 whitespace-pre-line">{statusMessage}</p>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">Leave your wallet for the future NFT drops.</h3>
              <p className="mb-6 text-lg text-gray-300">
                Get some collectible cards. Or not. Stay tuned.
              </p>
              <input
                type="text"
                value={walletInput}
                onChange={(e) => setWalletInput(e.target.value)}
                placeholder="Enter your Solana wallet address"
                className="w-full px-4 py-3 mb-3 text-black bg-white border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                disabled={isSubmitting}
              />
              {statusMessage && !statusMessage.startsWith("Thank you") && ( // Показываем ошибки валидации или другие ошибки
                <p className="text-red-400 text-sm mb-3">{statusMessage}</p>
              )}
              <button
                onClick={handleSaveWallet}
                className="w-full px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors duration-150 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Wallet'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Основной компонент страницы ---
export default function HomePage() {
    // Состояние для следующего/активного голосования
    const [nextVoteData, setNextVoteData] = useState(null);
    const [isNextVoteLoading, setIsNextVoteLoading] = useState(true);
    const [nextVoteError, setNextVoteError] = useState(null);

    // Состояние для последнего завершенного голосования (для показа результатов)
    const [lastVoteData, setLastVoteData] = useState(null);
    const [isLastVoteLoading, setIsLastVoteLoading] = useState(true);
    const [lastVoteError, setLastVoteError] = useState(null);

    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [countdown, setCountdown] = useState('');
    const countdownIntervalRef = useRef(null);
    const router = useRouter();
    const { setVisible } = useWalletModal();
    const { connected, publicKey } = useWallet(); // <-- Добавлено для получения состояния кошелька

    // Состояние для модального окна клейма NFT
    const [showNftClaimModal, setShowNftClaimModal] = useState(false);

    // Функция для загрузки обоих типов данных
    const fetchAllVoteData = async () => {
        setIsNextVoteLoading(true);
        setIsLastVoteLoading(true);
        setNextVoteError(null);
        setLastVoteError(null);

        try {
            console.log("HomePage: Fetching next vote data...");
            const nextVoteResponse = await fetch('/api/next-vote');
            console.log(`HomePage: Next vote response status: ${nextVoteResponse.status}`);
            if (!nextVoteResponse.ok && nextVoteResponse.status !== 404 && nextVoteResponse.status !== 304) {
                const errorData = await nextVoteResponse.json().catch(() => ({ message: 'Failed to parse error' }));
                throw new Error(`NextVote Fetch Error: ${errorData.message || nextVoteResponse.statusText}`);
            }
            const nextData = nextVoteResponse.status === 404 ? null : await nextVoteResponse.json();
            if (nextData) {
                 setNextVoteData({
                    ...nextData,
                    start_date: new Date(nextData.start_date),
                    end_date: new Date(nextData.end_date),
                    display_until_date: new Date(nextData.display_until_date)
                 });
                 console.log("HomePage: Next vote data received:", nextData);
            } else {
                setNextVoteData(null);
                console.log("HomePage: No upcoming or active vote found.");
            }

        } catch (error) {
            console.error("Ошибка при получении данных следующего голосования:", error);
            setNextVoteError(error.message || "Не удалось загрузить данные о следующем голосовании.");
            setNextVoteData(null);
        } finally {
            setIsNextVoteLoading(false);
        }

        try {
            console.log("HomePage: Fetching last vote data...");
            const lastVoteResponse = await fetch('/api/last-vote');
            console.log(`HomePage: Last vote response status: ${lastVoteResponse.status}`);
            if (!lastVoteResponse.ok && lastVoteResponse.status !== 404 && lastVoteResponse.status !== 304) {
                const errorData = await lastVoteResponse.json().catch(() => ({ message: 'Failed to parse error' }));
                throw new Error(`LastVote Fetch Error: ${errorData.message || lastVoteResponse.statusText}`);
            }
            const lastData = lastVoteResponse.status === 404 ? null : await lastVoteResponse.json();
             if (lastData) {
                 setLastVoteData({
                    ...lastData,
                    start_date: new Date(lastData.start_date),
                    end_date: new Date(lastData.end_date),
                    display_until_date: new Date(lastData.display_until_date)
                 });
                 console.log("HomePage: Last vote data received:", lastData);
            } else {
                 setLastVoteData(null);
                 console.log("HomePage: No finished vote found for display.");
            }
        } catch (error) {
            console.error("Ошибка при получении данных последнего голосования:", error);
            setLastVoteError(error.message || "Не удалось загрузить данные о последнем голосовании.");
            setLastVoteData(null);
        } finally {
            setIsLastVoteLoading(false);
        }
    };

    // Загрузка данных при первом рендере
    useEffect(() => {
        fetchAllVoteData();
    }, []);

    // Логика определения текущего состояния и таймера
    useEffect(() => {
        clearInterval(countdownIntervalRef.current); // Очищаем предыдущий интервал

        const now = new Date();
        let isActiveVote = false;
        let isUpcomingVote = false;
        let isDisplayingResults = false;
        let countdownTargetDate = null;
        let countdownLabel = "";

        // 1. Проверяем активное голосование
        if (nextVoteData && nextVoteData.start_date <= now && now < nextVoteData.end_date) {
            isActiveVote = true;
            // Таймер до конца активного голосования (может не отображаться, т.к. будет кнопка)
            countdownTargetDate = nextVoteData.end_date;
            countdownLabel = "Голосование закончится через:";
        }
        // 2. Если нет активного, проверяем показ результатов
        else if (lastVoteData && lastVoteData.end_date <= now && now < lastVoteData.display_until_date) {
            isDisplayingResults = true;
            // Таймер до конца показа результатов
            countdownTargetDate = lastVoteData.display_until_date;
            countdownLabel = "Показ результатов закончится через:";
        }
        // 3. Если нет активного и нет результатов, проверяем следующее голосование
        else if (nextVoteData && now < nextVoteData.start_date) {
            isUpcomingVote = true;
            // Таймер до начала следующего голосования
            countdownTargetDate = nextVoteData.start_date;
            countdownLabel = "Следующее голосование начнется через:";
        }

        // Запускаем таймер, если есть цель
        if (countdownTargetDate) {
            const updateCountdown = () => {
                const currentTime = new Date();
                const remainingSeconds = Math.floor((countdownTargetDate - currentTime) / 1000);

                if (remainingSeconds > 0) {
                    setCountdown(formatTime(remainingSeconds));
                } else {
                    setCountdown('00:00:00');
                    clearInterval(countdownIntervalRef.current);
                    // Если время истекло, возможно, стоит перезагрузить данные
                    console.log("HomePage: Countdown reached zero, refetching data...");
                    fetchAllVoteData();
                }
            };

            updateCountdown(); // Первоначальный вызов
            countdownIntervalRef.current = setInterval(updateCountdown, 1000);
        } else {
            setCountdown(''); // Сбрасываем таймер, если нет цели
        }

        // Добавляем слушатель для клавиши Escape для закрытия модального окна NFT
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setShowNftClaimModal(false);
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            clearInterval(countdownIntervalRef.current);
            window.removeEventListener('keydown', handleEsc); // Очищаем слушатель
        };
    }, [nextVoteData]); // Зависимости могут потребовать уточнения, пока добавил nextVoteData

    // Определение, что показывать в блоке "призыва к действию"
    const renderCallToAction = () => {
        return (
            <div className="flex flex-col items-center space-y-4 md:space-y-0 md:flex-row md:space-x-4 md:justify-center">
                <Link href="/vote" className="max-md:text-xl font-semibold text-sm py-2.5 px-5 bg-[#6938EF] rounded-lg text-white transition-all duration-300 ease-in-out hover:shadow-lg w-full sm:w-auto text-center">
                    Enter the Arena
                </Link>
                <button
                    onClick={() => setVisible(true)}
                    className="max-md:text-xl font-semibold text-sm py-2.5 px-5 bg-[#6938EF] rounded-lg text-white transition-all duration-300 ease-in-out hover:shadow-lg w-full sm:w-auto text-center"
                >
                    {connected && publicKey ? (
                        `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
                    ) : (
                        'Connect your wallet'
                    )}
                </button>
            </div>
        );
    };

    // --- JSX структура (адаптировано из index.html) ---
    return (
        <div className="relative min-h-screen bg-custom-gradient text-white">
            {/* Управляем <head> через Next.js */}
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <title>Memeotica - Real-Time Event Voting Platform</title>
                {/* Favicon и Google Fonts перенесены в pages/_document.js */}
                <link rel="icon" type="image/png" href="/images/Favicon memeotica.png" />
            </Head>

            {/* Подключаем Tailwind CSS через next/script */}
            <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />

            {/* Передаем состояние и функцию для управления drawer в Header */}
            <Header isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />

            {/* Основной контент страницы */}
            <section className="relative -translate-y-16 max-md:overflow-hidden">
                 {/* Используем /images/... для путей к public */}
                <img src="/images/home/welcome.svg" className="w-full left-1/2 -translate-x-1/2 max-md:max-w-[200%] absolute inset-0" alt="Welcome Background" />
                <div className="relative z-10 pt-20">
                    <img src="/images/memoitica.svg" className="w-72 h-64 object-cover mx-auto" alt="Memeotica Logo"/>
                    <h1 className="text-5xl md:text-[4.5rem] leading-none text-center font-light">Where Politics<br /> Becomes the Game</h1>
                    <p className="text-xl md:text-2xl max-w-xl md:max-w-2xl mx-auto mt-6 text-white/80 text-center">
                        A Web3 strategy game where you compete in a civic arena by making predictions on political outcomes
                    </p>
                    {/* Контейнер для кнопок с добавленным отступом сверху */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
                        <Link href="/vote" className="max-md:text-xl font-semibold text-sm py-2.5 px-5 bg-[#6938EF] rounded-lg text-white transition-all duration-300 ease-in-out hover:shadow-lg w-full sm:w-auto text-center">
                            Enter the Arena
                        </Link>
                        <button
                            onClick={() => setVisible(true)}
                            className="max-md:text-xl font-semibold text-sm py-2.5 px-5 bg-[#6938EF] rounded-lg text-white transition-all duration-300 ease-in-out hover:shadow-lg w-full sm:w-auto text-center"
                        >
                            {connected && publicKey ? (
                                `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
                            ) : (
                                'Connect your wallet'
                            )}
                        </button>
                    </div>
                </div>
            </section>

            {/* --- Секция с карточками --- */}
            <section>
                <div className="content grid gap-6 text-center grid-cols-1 md:grid-cols-3">
                     {/* Карточка 1 */}
                    <div className="p-6 transition-all hover:-translate-y-5 pt-4 bg-[#0602131A] rounded-[4rem] shadow-card">
                        <div className="relative">
                            <img src="/images/home/magic.png" className="w-56 h-56 mx-auto relative z-10" alt="Magic"/>
                            <img src="/images/home/magic.png" className="blur-[4rem] absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" aria-hidden="true" alt=""/>
                        </div>
                        <div className="relative z-10">
                            <p className="mt-4 text-2xl md:text-xl">Predict Real-World Politics</p>
                            <p className="max-md:text-xl mt-3">Forecast elections, laws, and events. Stake $MEMO or card power to play</p>
                            <Link href="/vote" className="w-fit font-semibold text-sm py-2.5 px-5 bg-white text-[#6938EF] rounded-lg mx-auto block mt-6">
                                Start Voting
                            </Link>
                        </div>
                    </div>
                     {/* Карточка 2 */}
                     <div className="p-6 pt-4 transition-all hover:-translate-y-5 bg-[#0602131A] rounded-[4rem] shadow-card">
                        <div className="relative">
                            <img src="/images/home/cards.svg" className="w-56 h-56 mx-auto relative z-10" alt="Cards"/>
                            <img src="/images/home/cards.svg" className="blur-[4rem] absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" aria-hidden="true" alt=""/>
                        </div>
                        <div className="relative z-10">
                            <p className="mt-4 text-2xl md:text-xl">Strategic Card Gameplay</p>
                            <p className="max-md:text-xl mt-3">Use unique character cards to boost predictions and gain an edge</p>
                            <Link href="/reward" className="w-fit font-semibold text-sm py-2.5 px-5 bg-white text-[#6938EF] rounded-lg mx-auto block mt-6">
                                View cards
                            </Link>
                        </div>
                    </div>
                     {/* Карточка 3 */}
                     <div className="p-6 pt-4 transition-all hover:-translate-y-5 bg-[#0602131A] rounded-[4rem] shadow-card">
                        <div className="relative">
                            <img src="/images/reward.png" className="w-56 h-56 mx-auto relative z-10" alt="Reward"/>
                            <img src="/images/reward.png" className="blur-[4rem] absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" aria-hidden="true" alt=""/>
                        </div>
                        <div className="relative z-10">
                            <p className="mt-4 text-2xl md:text-xl">Earn $MEMO & Rewards</p>
                            <p className="max-md:text-xl mt-3">Win tokens, rare NFTs, and climb the leaderboard for glory</p>
                            <Link href="/reward" className="w-fit font-semibold text-sm py-2.5 px-5 bg-white text-[#6938EF] rounded-lg mx-auto block mt-6">
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Остальные секции (Tokenomics, Features, Roadmap, Partners, Community) --- */} 
            <section className="content mt-24" id="tokenomics">
                {/* ... */}
            </section>

            <section className="content mt-24" id="features">
                 {/* ... */}
            </section>

            <section className="content mt-24" id="roadmap">
                 {/* ... */}
            </section>

            <section className="content mt-24" id="partners">
                 {/* ... */}
            </section>

            <section className="content mt-24" id="community">
                 {/* ... */}
            </section>

            {/* Подключаем Footer */} 
            <Footer />

            {/* Виджет для клейма NFT */}
            <NftClaimWidget onClick={() => setShowNftClaimModal(true)} />

            {/* Модальное окно для клейма NFT */}
            <NftClaimModal
                isOpen={showNftClaimModal}
                onClose={() => {
                    setShowNftClaimModal(false);
                    // Возможно, стоит сбрасывать сообщение при закрытии, чтобы при следующем открытии его не было
                    // Но оставим как есть, сообщение сбросится при новой попытке сохранения или при новой инициализации компонента
                }}
            />

        </div>
    );
} 