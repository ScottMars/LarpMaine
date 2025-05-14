import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';

// --- Предполагается, что Header и DrawerMenu вынесены в ../components/ ---
// import Header from '../components/Header'; 
// import DrawerMenu from '../components/DrawerMenu';
// --- Пока оставим их копии здесь для простоты ---

// --- Компонент Header (скопировано из pages/index.js) ---
function Header({ isDrawerOpen, setDrawerOpen }) {
    // ... (код компонента Header как в pages/index.js)
    return (
        <>
            <header className="sticky top-4 mt-4 z-40">
                <nav>
                    <ul className="flex items-center gap-10">
                        <li id="menu" className="flex gap-4 md:hidden">
                            <button onClick={() => setDrawerOpen(true)} aria-label="Open menu" className="flex items-center">
                                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.5 10H17.5M2.5 5H17.5M2.5 15H12.5" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <span className="w-px block bg-white/30"></span>
                        </li>
                        <li data-mobile-disable className="hidden md:block"><Link href="/" className="px-1 w-full">Home</Link></li>
                        <li data-mobile-disable className="hidden md:block"><Link href="/rules" className="px-1 w-full">Rules</Link></li>
                        <li data-mobile-disable className="hidden md:block"><Link href="/coming" className="px-1 w-full">Rewards</Link></li>
                        <li data-mobile-disable className="hidden md:block"><Link href="/vote" className="px-1 w-full">Voting</Link></li>
                        <li data-mobile-disable className="hidden md:block"><a target="_blank" rel="noopener noreferrer" className="px-1 w-full" href="https://memeotica.gitbook.io/memoticfun">Whitepaper</a></li>
                        <li data-mobile-disable className="hidden md:block"><Link href="/roadmap" className="px-1 w-full">Roadmap</Link></li>
                        <li data-mobile-disable className="hidden md:block"><Link href="/leaderboard" className="px-1 w-full">Leaderboard</Link></li>
                        <li><a target="_blank" rel="noopener noreferrer" href="https://x.com/Memeotica_Game"><img src="/images/header/x.svg" alt="Twitter X" className="w-5 h-5" /></a></li>
                        <li><a target="_blank" rel="noopener noreferrer" href="https://t.me/memeotica_game"><img src="/images/header/tg.svg" alt="Telegram" className="w-5 h-5" /></a></li>
                    </ul>
                </nav>
            </header>
            <DrawerMenu isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} />
        </>
    );
}

// --- Компонент DrawerMenu (скопировано из pages/index.js) ---
function DrawerMenu({ isOpen, onClose }) {
    // ... (код компонента DrawerMenu как в pages/index.js)
    const drawerRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                const menuButton = document.getElementById('menu');
                if (!menuButton || !menuButton.contains(event.target)) { 
                     onClose();
                }
            }
        }
        if (isOpen) { document.addEventListener('mousedown', handleClickOutside); }
        else { document.removeEventListener('mousedown', handleClickOutside); }
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, [isOpen, onClose]);
    return (
        <div data-opened={isOpen} id="drawer-menu" className={`drawer ${isOpen ? 'drawer-open' : ''}`}>
            <div className="drawer-overflow" onClick={onClose}></div>
            <div ref={drawerRef} className="drawer-content text-xl bg-[#2D1E11] pt-4 px-6 pb-9 rounded-t-[3rem]">
                <button onClick={onClose} className="drawer-close absolute left-1/2 -translate-x-1/2 -top-12 flex gap-2 items-center py-1 pl-2 pr-3 rounded-full bg-[#7A5AF090]" aria-label="Close menu">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 7L7 17M7 7L17 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Close
                </button>
                <ul className="divide-y divide-white/10">
                    <li onClick={onClose}><Link href="/" className="px-1 py-4 block w-full">Home</Link></li>
                    <li onClick={onClose}><Link href="/rules" className="px-1 py-4 block w-full">Rules</Link></li>
                    <li onClick={onClose}><Link href="/coming" className="px-1 py-4 block w-full">Rewards</Link></li>
                    <li onClick={onClose}><Link href="/vote" className="px-1 py-4 block w-full">Voting</Link></li>
                    <li onClick={onClose}><a target="_blank" rel="noopener noreferrer" className="px-1 py-4 block w-full" href="https://memeotica.gitbook.io/memoticfun">Whitepaper</a></li>
                    <li onClick={onClose}><Link href="/roadmap" className="px-1 py-4 block w-full">Roadmap</Link></li>
                    <li onClick={onClose}><Link href="/leaderboard" className="px-1 py-4 block w-full">Leaderboard</Link></li>
                </ul>
            </div>
        </div>
    );
}

// --- Компонент страницы голосования ---
export default function VotePage() {
  const router = useRouter();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [currentVote, setCurrentVote] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // В секундах
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWalletPopup, setShowWalletPopup] = useState(false); // Состояние для попапа
  const { connected } = useWallet(); // Получаем статус подключения

  // Состояния для анимации SVG таймера
  const [circumference, setCircumference] = useState(0);
  const [dashOffset, setDashOffset] = useState(0);
  const [endCirclePos, setEndCirclePos] = useState({ cx: 250, cy: 125 });
  const radius = 122; // Радиус из SVG

  const timerIntervalRef = useRef(null);

  // Функция для загрузки статуса голосования (активное/предстоящее или редирект на результаты)
  const fetchVoteStatus = async () => {
      setIsLoading(true);
      setError(null);
      setCurrentVote(null); // Сбрасываем текущее голосование перед проверкой

      try {
          // --- Этап 1: Проверка активного или предстоящего голосования --- 
          console.log("VotePage: Fetching /api/next-vote...");
          const nextVoteResponse = await fetch('/api/next-vote');
          console.log(`VotePage: /api/next-vote status: ${nextVoteResponse.status}`);

          if (nextVoteResponse.ok) {
              const data = await nextVoteResponse.json();
              if (data && Object.keys(data).length > 0) {
                  const startDate = new Date(data.start_date);
                  const endDate = new Date(data.end_date);
                  const displayUntilDate = new Date(data.display_until_date);
                  const now = new Date();

                  // 1. Голосование активно?
                  if (now >= startDate && now < endDate) {
                      console.log("VotePage: Active vote found.");
                      setCurrentVote({
                          ...data,
                          start_date: startDate,
                          end_date: endDate,
                          display_until_date: displayUntilDate
                      });
                      const remaining = Math.max(0, Math.floor((endDate - now) / 1000));
                      setTimeLeft(remaining);
                      setError(null);
                      setIsLoading(false);
                      return; // Активное голосование найдено, выходим
                  }
                  // 2. Голосование предстоящее (согласно /api/next-vote)? Попробуем сначала показать результаты прошлого.
                  else if (now < startDate) {
                      console.log("VotePage: Upcoming vote indicated by /api/next-vote. Attempting to show last vote's winner page first.");
                      try {
                          const lastVoteResponse = await fetch('/api/last-vote');
                          console.log(`VotePage: /api/last-vote status (when next-vote is upcoming): ${lastVoteResponse.status}`);

                          if (lastVoteResponse.ok) {
                              const lastData = await lastVoteResponse.json();
                              if (lastData && Object.keys(lastData).length > 0) {
                                  const displayUntilLast = new Date(lastData.display_until_date);
                                  if (displayUntilLast > now) {
                                      console.log("VotePage: Last vote's results (from upcoming check) found and display time is valid. Redirecting to winner page... ID:", lastData.id);
                                      router.push(`/winner?voteId=${lastData.id}`);
                                      return; // Перенаправились, выходим
                                  } else {
                                      console.log("VotePage: Last vote's results (from upcoming check) found, but display time has expired. Not redirecting. Vote ID:", lastData.id);
                                  }
                              } else {
                                  console.log("VotePage: /api/last-vote (when next-vote is upcoming) returned ok but no data. Will show 'upcoming vote' message.");
                              }
                          } else {
                               console.log(`VotePage: /api/last-vote (when next-vote is upcoming) failed (status ${lastVoteResponse.status}). Will show 'upcoming vote' message.`);
                          }
                      } catch (lastVoteError) {
                          console.error("VotePage: Error fetching /api/last-vote (when next-vote is upcoming):", lastVoteError);
                           // Ошибка при загрузке последнего, показываем "еще не началось"
                      }

                      // Если НЕ удалось перенаправить на победителя (или время отображения истекло), показываем "Голосование еще не началось"
                      console.log("VotePage: No last vote results (or display time expired), or error fetching them. Displaying 'Upcoming vote' message as per /api/next-vote.");
                      setError("Voting has not started yet.");
                      setCurrentVote(null); // Нет текущего активного, т.к. показываем сообщение о предстоящем
                      setIsLoading(false); // Устанавливаем isLoading в false, т.к. это конечная точка для этой ветки
                      return; // Выходим, показывая сообщение о предстоящем
                  }
                   // 3. Голосование от next-vote уже завершилось (странный случай, но обработаем)
                  else { 
                       console.log("VotePage: /api/next-vote returned an already finished vote. Trying /api/last-vote...");
                       // Переходим к Этапу 2
                  }
              } else {
                   console.log("VotePage: /api/next-vote returned ok but no data. Trying /api/last-vote...");
                    // Переходим к Этапу 2
              }
          } else if (nextVoteResponse.status === 404 || nextVoteResponse.status === 304) {
              console.log("VotePage: No active/upcoming vote found via /api/next-vote. Trying /api/last-vote...");
               // Переходим к Этапу 2
          } else {
              // Другая ошибка при запросе /api/next-vote
              throw new Error(`Failed to fetch next vote: ${nextVoteResponse.statusText} (Status: ${nextVoteResponse.status})`);
          }

          // --- Этап 2: Проверка завершенного голосования для показа результатов --- 
          // (Выполняется, только если не найдено активного/предстоящего на Этапе 1)
          console.log("VotePage: Fetching /api/last-vote...");
          const lastVoteResponse = await fetch('/api/last-vote');
          console.log(`VotePage: /api/last-vote status: ${lastVoteResponse.status}`);

          if (lastVoteResponse.ok) {
              const lastData = await lastVoteResponse.json();
              if (lastData && Object.keys(lastData).length > 0) {
                    const displayUntilLast = new Date(lastData.display_until_date);
                    if (displayUntilLast > new Date()) {
                        console.log("VotePage: Finished vote (from last-vote check) found for display and display time is valid. Redirecting... ID:", lastData.id);
                        router.push(`/winner?voteId=${lastData.id}`);
                        return; // Перенаправляемся, выходим
                    } else {
                        console.log("VotePage: Finished vote (from last-vote check) found, but display time has expired. Not redirecting. Vote ID:", lastData.id);
                        // Позволяем выполнению продолжиться, чтобы в итоге показать "No active votes or available results."
                    }
              }
          }

          // Если дошли сюда, значит ни активного, ни предстоящего, ни результатов для показа нет
          console.log("VotePage: No active/upcoming vote or results to display found (or results expired).");
          setError("No active votes or available results.");
          setCurrentVote(null);

      } catch (error) {
          console.error("Ошибка при определении статуса голосования:", error);
          setError(error.message || "Could not determine voting status.");
          setCurrentVote(null);
      } finally {
          setIsLoading(false);
      }
  };

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchVoteStatus(); // Вызываем новую функцию
    setCircumference(2 * Math.PI * radius);
    return () => {
      // clearTimeout(nextFetchTimeoutRef.current); // Больше не используется
      clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Эффект для таймера
  useEffect(() => {
    if (!currentVote || timeLeft <= 0) {
        clearInterval(timerIntervalRef.current);
        return;
    }

    timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
            const newTimeLeft = Math.max(0, prevTime - 1);
            const duration = Math.floor((currentVote.end_date - currentVote.start_date) / 1000);
            const safeDuration = duration > 0 ? duration : 1;
            const elapsed = safeDuration - newTimeLeft;
            const offset = circumference * (elapsed / safeDuration);
            setDashOffset(offset);
            const angle = (elapsed / safeDuration) * 360;
            const radian = angle * (Math.PI / 180);
            const x = 125 + radius * Math.cos(radian - Math.PI / 2);
            const y = 125 + radius * Math.sin(radian - Math.PI / 2);
            setEndCirclePos({ cx: x, cy: y });
            
            return newTimeLeft;
        });
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);

  }, [currentVote, timeLeft, circumference, radius, router]);

  // Форматирование времени для отображения
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Обработчики голосования
  const handleVote = (choice) => {
      if (!currentVote) return;

      if (!connected) {
          setShowWalletPopup(true); // Показываем попап, если кошелек не подключен
          return;
      }

      // Если кошелек подключен, продолжаем логику голосования
      console.log(`Проголосовали: ${choice} за ${currentVote.title}`);
      // TODO: 
      // 1. Проверить лимиты голосов (если нужно, через cookie или API)
      // 2. Отправить голос на бэкенд (POST /api/submit-vote)
      // 3. Обработать ответ (успех/ошибка)
      // 4. Обновить UI (возможно, показать сообщение, обновить счетчики, если они реалтайм)
      // 5. Добавить анимацию +1 (можно через state и CSS)
  };

  // Вычисление процентов для прогресс-бара (пока на основе данных из currentVote)
  const calculateProgress = () => {
      if (!currentVote || (currentVote.choices_yes === 0 && currentVote.choices_no === 0)) {
          return { leftPercent: 50, rightPercent: 50, yesVotes: 0, noVotes: 0 };
      }
      const totalVotes = currentVote.choices_yes + currentVote.choices_no;
      const leftPercent = (currentVote.choices_no / totalVotes) * 100;
      const rightPercent = (currentVote.choices_yes / totalVotes) * 100;
      return {
          leftPercent,
          rightPercent,
          yesVotes: currentVote.choices_yes,
          noVotes: currentVote.choices_no
      };
  };

  const progress = calculateProgress();

  // Основной JSX
  return (
    <div>
      <Head>
        <title>{currentVote ? `${currentVote.title} - Voting` : 'Voting'} - Memeotica</title>
        <link rel="icon" type="image/png" href="/images/Favicon memeotica.png" />
        {/* Tailwind CDN пока оставляем */} 
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <Header isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />

      {/* Блок загрузки */} 
      {isLoading && <div className="content text-center py-10">Loading voting status...</div>}
      
      {/* Блок ошибки (если не загрузка и есть ошибка) */} 
      {!isLoading && error && (
          <div className="content text-center py-10 text-red-500">
              <h1>Error</h1>
              <p>{error}</p>
              <Link href="/" className="text-blue-500 underline mt-4 inline-block">Back to Home</Link>
          </div>
      )}

      {/* Модальное окно для подключения кошелька */}
      {showWalletPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-[#2D1E11] p-6 md:p-8 rounded-xl shadow-xl text-white border border-yellow-400/50 max-w-md w-full">
                  <h3 className="text-2xl font-semibold mb-6 text-yellow-400 text-center">Wallet Connection Required</h3>
                  <p className="mb-8 text-center text-lg">
                      To cast your vote, you need to connect your Solana wallet first.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button 
                          onClick={() => router.push('/')} // Переход на главную для подключения
                          className="w-full sm:w-auto px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors duration-150 text-lg"
                      >
                          Connect Wallet
                      </button>
                      <button 
                          onClick={() => setShowWalletPopup(false)}
                          className="w-full sm:w-auto px-6 py-3 text-yellow-500 border border-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors duration-150 text-lg"
                      >
                          Cancel
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Блок активного голосования (если не загрузка, нет ошибки и есть currentVote) */} 
      {!isLoading && !error && currentVote && (
          <> 
            <section className="content-grid-vote pt-10 pb-20"> {/* Используем новый класс для грида */}
                <h1 id="title" className="title text-center text-4xl font-light mt-7">{currentVote.title}</h1>
                <div className="flex content flex-col "> {/* Убедимся что content здесь не конфликтует с grid */}
                    {/* Кнопки и мобильные имена */} 
                    <div className="max-md:order-2 flex gap-10 md:gap-20 items-center font-semibold mt-16 md:justify-center">
                        <div className=" max-md:w-full max-md:flex flex-col items-center md:items-end">
                             {/* Имя слева для мобильных */} 
                             <p className="w-2/3 left-name text-center mb-2 md:hidden mt-2 break-words max-w-xs">{currentVote.left_name}</p>
                            <button 
                                id="no" 
                                onClick={() => handleVote('no')} 
                                className={`bg-[#F04438] py-2.5 px-14 relative max-md:w-2/3 rounded-lg ${!connected ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'} ${timeLeft <= 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                                disabled={timeLeft <= 0} // Дизейблим только если время вышло
                            >
                                NO
                            </button>
                        </div>
                        <div className=" max-md:w-full max-md:flex flex-col items-center">
                             {/* Имя справа для мобильных */} 
                             <p className="w-2/3 right-name text-center mb-2 md:hidden mt-2 break-words max-w-xs">{currentVote.right_name}</p>
                            <button 
                                id="yes" 
                                onClick={() => handleVote('yes')} 
                                className={`bg-[#039855] py-2.5 px-14 relative max-md:w-2/3 rounded-lg ${!connected ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'} ${timeLeft <= 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                                disabled={timeLeft <= 0} // Дизейблим только если время вышло
                            >
                                YES
                            </button>
                        </div>
                    </div>
                    
                    {/* Изображения, таймер, десктопные имена */} 
                    <div className="images-timer-container flex justify-around items-center mt-10 md:mt-16 relative max-md:order-1"> {/* Новый контейнер для изображений и таймера */}
                        {/* Левый блок */} 
                        <div className="flex flex-col items-center relative"> {/* Добавлен flex flex-col items-center для центрирования имени под картинкой */}
                            <div className=" bg-[#FF3030] top-1/2 -translate-y-1/2 left-0 absolute blur-[6rem] md:blur-[10rem] w-48 h-48 md:w-72 md:h-72"></div> 
                            <div className=" relative z-10">
                                <img src={currentVote.left_image || "/images/vote/ping.png"} alt={currentVote.left_name} className="left-image max-md:max-w-[120%] md:w-auto md:h-auto w-48 h-auto max-md:-translate-x-10"/>
                            </div>
                            <p className="left-name hidden md:block mt-4 text-center text-xl font-semibold text-white">{currentVote.left_name}</p> {/* Добавлен text-white */} 
                        </div>

                        {/* Таймер */} 
                        <div className="timer-wrapper relative flex justify-center items-center"> {/* Обертка для таймера */}
                            <svg className=" h-32 w-32 md:w-64 md:h-64 -rotate-90" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg">
                                <circle stroke="#444" strokeWidth="3" cx="125" cy="125" r={radius} fill="none" strokeDasharray="3 8"/>
                                <circle 
                                    className="circle transition-all duration-1000 linear" // linear transition
                                    stroke="#fff" 
                                    strokeWidth="6" 
                                    cx="125" 
                                    cy="125" 
                                    r={radius} 
                                    fill="none"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={dashOffset} // Управляется состоянием
                                    />
                                <circle 
                                    id="end-circle" 
                                    className="end-circle transition-all duration-1000 linear" // linear transition
                                    cx={endCirclePos.cx} // Управляется состоянием
                                    cy={endCirclePos.cy} // Управляется состоянием
                                    r="6" 
                                    fill="#fff"/>
                            </svg>
                            <div className="absolute inset-0 flex justify-center items-center flex-col">
                                <div className="md:text-3xl text-xl font-medium" id="countdown">{formatTime(timeLeft)}</div>
                                <div className="text-center max-md:text-xs md:mt-2.5 text-xs md:text-base">The winning option will<br/>launch a new coin</div>
                            </div>
                        </div>

                        {/* Правый блок */} 
                        <div className="flex flex-col items-center relative"> {/* Добавлен flex flex-col items-center для центрирования имени под картинкой */}
                            <div className=" bg-[#61E652] top-1/2 -translate-y-1/2 right-0 absolute blur-[6rem] md:blur-[10rem] w-48 h-48 md:w-72 md:h-72"></div> 
                            <div className=" relative z-10">
                                <img src={currentVote.right_image || "/images/vote/trump.png"} alt={currentVote.right_name} className="right-image max-md:max-w-[120%] md:w-auto md:h-auto w-48 h-auto max-md:translate-x-10"/>
                            </div>
                            <p className="right-name hidden md:block mt-4 text-center text-xl font-semibold text-white break-words max-w-xs">{currentVote.right_name}</p> {/* Добавлен text-white */} 
                        </div>
                    </div>

                    {/* Результаты */} 
                    <div className="results-area mt-10 md:mt-16"> {/* Новый контейнер для результатов */}
                        <div className="results-container mx-auto md:max-w-[50%] max-w-[80%]">
                            <div className="progress-bar">
                                <div className="red-dots-line" style={{ width: `${progress.leftPercent}%` }}>
                                    <div className="vote-count no-votes absolute right-0 text-[#F04438] bottom-full pr-1">{progress.noVotes}</div>
                                </div>
                                <div className="vertical-separator" style={{ left: `${progress.leftPercent}%` }}>
                                    {[...Array(5)].map((_, i) => <div key={i} className="dot"></div>)} 
                                </div>
                                <div className="green-dots-line" style={{ width: `calc(${progress.rightPercent}% - 0.5rem)` }}> {/* Adjusted width */} 
                                    <div className="vote-count yes-votes absolute left-0 text-[#12B76A] bottom-full pl-1">{progress.yesVotes}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Секция NFT */} 
            <section className="nft-section bg-fixed-wrapper"> {/* Обёртка для позиционирования фона */}
                <div>
                    <h2 className=" mt-24 text-4xl relative z-10 font-light text-center mb-8">Collect this NFT cards during event</h2>
                    <div className="space-y-12 max-md:flex flex-wrap justify-center gap-6">
                        <div className="flex gap-6 max-md:contents justify-center">
                            {/* Используем пути от public */} 
                            <img src="/images/vote/NFT1.jpeg" alt="TRUMP TERRAFORMER" className="nft-card"/>
                            <img src="/images/vote/NFT2.jpeg" alt="PRESIDENT PUTIN" className="nft-card"/>
                            <img src="/images/vote/NFT3.jpeg" alt="DRILL BABY" className="nft-card"/>
                            <img src="/images/vote/NFT4.jpeg" alt="ARCTIC REAL" className="nft-card"/>
                            <img src="/images/vote/NFT5.jpeg" alt="FROZEN ASSET" className="nft-card"/>
                        </div>
                        <div className="flex gap-6 max-md:contents justify-center">
                            <img src="/images/vote/NFT6.jpeg" alt="GREENLAND" className="nft-card"/>
                            <img src="/images/vote/NFT7.jpeg" alt="SNOWDEN RETURN" className="nft-card"/>
                            <img src="/images/vote/NFT8.jpeg" alt="LOST IN REYKJAVIK" className="nft-card"/>
                            <img src="/images/vote/NFT9.jpeg" alt="THE ICE MAGA" className="nft-card"/>
                            <img src="/images/vote/NFT10.jpeg" alt="COLD WAR" className="nft-card max-md:hidden"/>
                        </div>
                    </div>
                    {/* Фоновый градиент - можно оставить как есть, если CSS настроен */} 
                    <div className="bg-vote fixed opacity-80 bottom-0 h-[60%] pointer-events-none w-full"></div>
                </div>
            </section>

            {/* Футер */} 
            <Footer />
          </>
      )}
    </div>
  );
}

// --- Компонент Footer (скопировано из pages/index.js для простоты) ---
// Позже можно вынести в /components/Footer.js
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