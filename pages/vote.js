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
                        <li data-mobile-disable className="hidden md:block"><Link href="/reward" className="px-1 w-full">Rewards</Link></li>
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
                    <li onClick={onClose}><Link href="/reward" className="px-1 py-4 block w-full">Rewards</Link></li>
                    <li onClick={onClose} className="text-white font-bold"><Link href="/vote" className="px-1 py-4 block w-full">Voting</Link></li>
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
  const [currentVote, setCurrentVote] = useState(null); // Will now store user_vote_count, remaining_votes, max_votes_per_user
  const [timeLeft, setTimeLeft] = useState(0); // В секундах
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false); // Vote submission loading
  const [error, setError] = useState(null);
  const [voteMessage, setVoteMessage] = useState(''); // For success/error messages on vote action
  const [showWalletPopup, setShowWalletPopup] = useState(false); // Состояние для попапа
  const [showPlaceholder, setShowPlaceholder] = useState(false); // Новое состояние для заглушки
  const { connected, publicKey } = useWallet(); // Получаем статус подключения и publicKey

  // Новые состояния для анимированных голосов
  const [animatedYesVotes, setAnimatedYesVotes] = useState(0);
  const [animatedNoVotes, setAnimatedNoVotes] = useState(0);

  console.log("VotePage Init/Re-render:", { connected, publicKey: publicKey ? publicKey.toBase58() : null });

  // Состояния для анимации SVG таймера
  const [circumference, setCircumference] = useState(0);
  const [dashOffset, setDashOffset] = useState(0);
  const [endCirclePos, setEndCirclePos] = useState({ cx: 250, cy: 125 });
  const radius = 122; // Радиус из SVG

  const timerIntervalRef = useRef(null);

  // Функция для загрузки статуса голосования (активное/предстоящее или редирект на результаты)
  const fetchVoteStatus = async () => {
      console.log("VotePage: fetchVoteStatus called. Current state:", { connected, publicKey: publicKey ? publicKey.toBase58() : null });
      setIsLoading(true);
      setError(null);
      setShowPlaceholder(false); // Сбрасываем состояние заглушки при каждом запросе
      // setCurrentVote(null); // Сбрасываем текущее голосование перед проверкой -  Let's keep currentVote to avoid UI flicker if only user counts change

      try {
          let apiUrl = '/api/next-vote';
          if (connected && publicKey) {
              apiUrl += `?wallet_address=${publicKey.toBase58()}`;
              console.log("VotePage: Wallet connected for fetch, using apiUrl:", apiUrl);
          } else {
              console.log("VotePage: Wallet not connected or publicKey not available for fetch. Using apiUrl:", apiUrl);
          }

          // --- Этап 1: Проверка активного или предстоящего голосования --- 
          console.log(`VotePage: Fetching ${apiUrl}...`);
          const nextVoteResponse = await fetch(apiUrl);
          console.log(`VotePage: ${apiUrl} status: ${nextVoteResponse.status}`);

          if (nextVoteResponse.ok) {
              const data = await nextVoteResponse.json();
              console.log("VotePage: Data from /api/next-vote:", data);
              if (data && Object.keys(data).length > 0) {
                  const startDate = new Date(data.start_date);
                  const endDate = new Date(data.end_date);
                  const displayUntilDate = new Date(data.display_until_date);
                  const now = new Date();

                  // 1. Голосование активно?
                  if (now >= startDate && now < endDate) {
                      console.log("VotePage: Active vote found.", data);
                      setCurrentVote({
                          ...data,
                          start_date: startDate,
                          end_date: endDate,
                          display_until_date: displayUntilDate,
                          // user_vote_count, remaining_votes, max_votes_per_user are now part of 'data'
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
          // setError("No active votes or available results."); // Заменяем на показ заглушки
          setCurrentVote(null);
          setShowPlaceholder(true); // Показываем заглушку
          setError(null); // Убедимся, что ошибки нет

      } catch (error) {
          console.error("Ошибка при определении статуса голосования:", error);
          setError(error.message || "Could not determine voting status.");
          setCurrentVote(null);
          setShowPlaceholder(false); // Скрываем заглушку в случае ошибки
      } finally {
          setIsLoading(false);
      }
  };

  // Загрузка данных при монтировании
  useEffect(() => {
    // Initial fetch
    // fetchVoteStatus(); // This will be covered by the [connected, publicKey] effect on initial load if wallet is already connected or not.
    setCircumference(2 * Math.PI * radius);
    return () => {
      // clearTimeout(nextFetchTimeoutRef.current); // Больше не используется
      clearInterval(timerIntervalRef.current);
    };
  }, [radius]); // Added radius to dependency array as it's used in effect, though it's a constant here.

  // Refetch vote status if wallet connection status or public key changes, or on initial mount
  useEffect(() => {
    console.log("VotePage: Wallet Effect Triggered (connected or publicKey changed or initial mount). Fetching status.", { connected, publicKey: publicKey ? publicKey.toBase58() : null });
    fetchVoteStatus();
  }, [connected, publicKey]); // publicKey itself is an object, so it might cause re-runs if not stable. Rely on its properties if issues persist.

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
            const offset = circumference * (newTimeLeft / safeDuration);
            setDashOffset(offset);
            const angle = (elapsed / safeDuration) * 360;
            const radian = angle * (Math.PI / 180);
            const x = 125 + radius * Math.cos(radian);
            const y = 125 + radius * Math.sin(radian);
            setEndCirclePos({ cx: x, cy: y });
            
            return newTimeLeft;
        });
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);

  }, [currentVote, timeLeft, circumference, radius, router]);

  // Эффект для анимации счетчиков голосов
  useEffect(() => {
    if (currentVote && currentVote.start_date && currentVote.end_date) {
        const startDate = new Date(currentVote.start_date);
        const endDate = new Date(currentVote.end_date);
        const totalPollDurationSeconds = (endDate.getTime() - startDate.getTime()) / 1000;

        if (totalPollDurationSeconds > 0 && timeLeft >= 0) {
            const targetYes = currentVote.choices_yes || 0;
            const targetNo = currentVote.choices_no || 0;

            const elapsedSecondsSinceStart = Math.max(0, totalPollDurationSeconds - timeLeft);
            
            let currentAnimatedY = (targetYes / totalPollDurationSeconds) * elapsedSecondsSinceStart;
            let currentAnimatedN = (targetNo / totalPollDurationSeconds) * elapsedSecondsSinceStart;

            currentAnimatedY = Math.max(0, Math.min(currentAnimatedY, targetYes));
            currentAnimatedN = Math.max(0, Math.min(currentAnimatedN, targetNo));

            if (timeLeft === 0) {
                setAnimatedYesVotes(targetYes);
                setAnimatedNoVotes(targetNo);
            } else {
                setAnimatedYesVotes(Math.floor(currentAnimatedY));
                setAnimatedNoVotes(Math.floor(currentAnimatedN));
            }
        } else if (totalPollDurationSeconds <= 0) { // Если длительность некорректна, показываем финальные значения
             setAnimatedYesVotes(currentVote.choices_yes || 0);
             setAnimatedNoVotes(currentVote.choices_no || 0);
        }
    } else {
        // Если нет активного голосования, сбрасываем анимированные счетчики
        setAnimatedYesVotes(0);
        setAnimatedNoVotes(0);
    }
}, [currentVote, timeLeft]);

  // Форматирование времени для отображения
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Обработчики голосования
  const handleVote = async (choice) => {
    console.log("VotePage: handleVote called with choice:", choice, "Wallet connected:", connected, "Public key:", publicKey ? publicKey.toBase58() : null);
    if (!connected || !publicKey) {
      console.log("VotePage: Wallet not connected, showing popup.");
      setVoteMessage("Please connect your wallet to vote.");
      setShowWalletPopup(true);
      return;
    }

    if (!currentVote || !currentVote.id) {
      setError("No active vote to participate in.");
      return;
    }

    if (currentVote.remaining_votes <= 0) {
        setVoteMessage("You have no votes left for this poll.");
        return;
    }

    // Добавим проверку на timeLeft, если таймер истек, голосовать нельзя
    if (timeLeft <= 0) {
        setVoteMessage("Voting has ended for this poll.");
        // Можно также вызвать fetchVoteStatus, чтобы обновить UI, если голосование только что закончилось
        // fetchVoteStatus(); 
        return;
    }

    setIsSubmittingVote(true);
    setVoteMessage('');
    setError(null);

    try {
      console.log(`VotePage: Submitting vote for poll ${currentVote.id}, choice: ${choice}, wallet: ${publicKey.toBase58()}`);
      const response = await fetch('/api/submit-vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vote_id: currentVote.id,
          choice: choice, // 'yes' or 'no'
          wallet_address: publicKey.toBase58(),
        }),
      });

      console.log("VotePage: Submit vote response status:", response.status);
      const responseData = await response.json();
      console.log("VotePage: Submit vote response data:", responseData);

      if (response.ok) {
        setVoteMessage(responseData.message || "Vote submitted successfully!");
        
        if (responseData.updatedVote) {
            setCurrentVote(prev => {
                // Убедимся, что prev существует и содержит необходимые поля
                if (!prev) {
                    // Если prev не определен (маловероятно, но на всякий случай)
                    // Можно попробовать использовать только responseData.updatedVote
                    // или запросить полный статус
                    console.warn("VotePage: prev currentVote was null during update. Re-fetching status.");
                    fetchVoteStatus();
                    return null;
                }
                return {
                    ...prev, // Сохраняем остальные свойства, такие как title, images, dates
                    choices_yes: responseData.updatedVote.choices_yes,
                    choices_no: responseData.updatedVote.choices_no,
                    user_vote_count: responseData.updatedVote.user_vote_count,
                    remaining_votes: responseData.updatedVote.remaining_votes,
                    max_votes_per_user: responseData.updatedVote.max_votes_per_user || prev.max_votes_per_user, // Обновляем, если пришло
                };
            });
        } else {
            // Если API по какой-то причине не вернул updatedVote, но ответил OK
            // (например, в случае message: 'Vote recorded, but failed to fetch updated counts.')
            // тогда делаем полный refetch, чтобы UI был консистентным.
            console.warn("VotePage: updatedVote not present in successful response. Re-fetching status.");
            fetchVoteStatus(); 
        }
      } else {
        // Обрабатываем специфичные ошибки, если они есть в responseData
        if (response.status === 403 && responseData.message === 'Vote limit reached for this poll.') {
            setError(responseData.message);
            // Обновим UI, чтобы показать, что голоса закончились, если API это подтвердил
            setCurrentVote(prev => prev ? ({
                ...prev,
                user_vote_count: responseData.current_votes !== undefined ? responseData.current_votes : prev.user_vote_count,
                remaining_votes: 0 
            }) : null);
        } else {
            setError(responseData.message || responseData.error || "Failed to submit vote. Please try again.");
        }
      }
    } catch (error) {
      console.error("VotePage: Error submitting vote:", error);
      setError(`Error submitting vote: ${error.message}`);
    } finally {
      setIsSubmittingVote(false);
    }
  };

  // Вычисление процентов для прогресс-бара (теперь принимает анимированные значения)
  const calculateProgress = (yesVotes, noVotes) => {
      const currentYesVotes = yesVotes || 0;
      const currentNoVotes = noVotes || 0;

      if (currentYesVotes === 0 && currentNoVotes === 0) {
          return { leftPercent: 50, rightPercent: 50, yesVotes: 0, noVotes: 0 };
      }
      const totalVotes = currentYesVotes + currentNoVotes;
      // Напоминание: leftPercent для NO (красная полоса), rightPercent для YES (зеленая полоса)
      const leftPercent = totalVotes > 0 ? (currentNoVotes / totalVotes) * 100 : 50;
      const rightPercent = totalVotes > 0 ? (currentYesVotes / totalVotes) * 100 : 50;
      return {
          leftPercent,  // Процент для "Против"
          rightPercent, // Процент для "За"
          yesVotes: currentYesVotes,
          noVotes: currentNoVotes
      };
  };

  const progress = calculateProgress(animatedYesVotes, animatedNoVotes); // Используем анимированные значения

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

      {/* БЛОК ЗАГЛУШКИ: если не загрузка, нет ошибки, нет текущего голосования и нужно показать заглушку */} 
      {!isLoading && !error && !currentVote && showPlaceholder && (
        <section className="content-grid-vote pt-10 pb-20 flex flex-col items-center justify-center min-h-[calc(100vh-300px)]"> {/* Используем flex для центрирования */} 
            <img src="/images/prepear.png" alt="No active votes available" className="max-w-xs md:max-w-sm lg:max-w-md mb-6" />
            <p className="text-xl md:text-2xl text-gray-400 text-center">Currently, there are no active or upcoming votes.</p>
            <p className="text-md text-gray-500 mt-2 text-center">Please check back later!</p>
        </section>
      )}

      {/* Блок активного голосования (если не загрузка, нет ошибки и есть currentVote) */} 
      {!isLoading && !error && currentVote && (
          <> 
            <section className="content-grid-vote pt-10 pb-20"> {/* Используем новый класс для грида */}
                <h1 id="title" className="title text-center text-4xl font-light mt-7">{currentVote.title}</h1>
                
                {!connected ? (
                    <div className="text-center mt-8 py-10">
                        <p className="mb-6 text-xl text-yellow-400">
                            Please connect your wallet to vote.
                        </p>
                        <button 
                            onClick={() => router.push('/')} // Или используйте вашу модалку: walletModal.setVisible(true)
                            className="px-8 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors text-lg"
                        >
                            Connect Wallet
                        </button>
                    </div>
                ) : (
                    <> {/* Display voting interface only if connected */} 
                        {typeof currentVote.user_vote_count !== 'undefined' && (
                            <p className="text-center text-lg mt-3 mb-3 text-yellow-400">
                                Votes Cast: {currentVote.user_vote_count} / {currentVote.max_votes_per_user}
                                {currentVote.remaining_votes > 0 && ` (Remaining: ${currentVote.remaining_votes})`}
                                {currentVote.remaining_votes <= 0 && " (No votes remaining)"}
                            </p>
                        )}
                        {voteMessage && (
                            <p className={`text-center mt-2 mb-2 ${voteMessage.includes("success") ? 'text-green-400' : 'text-red-400'}`}>
                                {voteMessage}
                            </p>
                        )}

                        <div className="flex content flex-col "> {/* Убедимся что content здесь не конфликтует с grid */}
                            {/* Кнопки и мобильные имена */} 
                            <div className="max-md:order-2 flex gap-10 md:gap-20 items-center font-semibold mt-8 md:justify-center">
                                <div className=" max-md:w-full max-md:flex flex-col items-center md:items-end">
                                     {/* Имя слева для мобильных */} 
                                     <p className="w-2/3 left-name text-center mb-2 md:hidden mt-2 break-words max-w-xs">{currentVote.left_name}</p>
                                    <button 
                                        id="no" 
                                        onClick={(e) => { e.preventDefault(); handleVote('no'); }} 
                                        className={`bg-[#F04438] py-2.5 px-14 relative max-md:w-2/3 rounded-lg transition-opacity duration-150 
                                            ${(timeLeft <= 0 || (currentVote && currentVote.remaining_votes <= 0) || isSubmittingVote) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
                                        disabled={timeLeft <= 0 || (currentVote && currentVote.remaining_votes <= 0) || isSubmittingVote}
                                    >
                                        NO
                                    </button>
                                </div>
                                <div className=" max-md:w-full max-md:flex flex-col items-center">
                                     {/* Имя справа для мобильных */} 
                                     <p className="w-2/3 right-name text-center mb-2 md:hidden mt-2 break-words max-w-xs">{currentVote.right_name}</p>
                                    <button 
                                        id="yes" 
                                        onClick={(e) => { e.preventDefault(); handleVote('yes'); }} 
                                        className={`bg-[#039855] py-2.5 px-14 relative max-md:w-2/3 rounded-lg transition-opacity duration-150 
                                            ${(timeLeft <= 0 || (currentVote && currentVote.remaining_votes <= 0) || isSubmittingVote) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
                                        disabled={timeLeft <= 0 || (currentVote && currentVote.remaining_votes <= 0) || isSubmittingVote}
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
                                        <circle stroke="#444" strokeWidth="6" cx="125" cy="125" r={radius} fill="none" strokeDasharray="1 12"/>
                                        <circle 
                                            className="circle"
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
                                            className="end-circle"
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
                    </> 
                )} {/* End of connected check for voting UI */}
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