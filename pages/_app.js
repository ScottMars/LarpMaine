import '../public/css/index.css';
import '../public/css/home.css';
import '../public/css/vote.css';
import '../public/css/winner.css';
// import Head from 'next/head'; // Больше не нужен здесь для этих ссылок

// Если вы решите установить Tailwind CSS как зависимость, здесь также можно будет импортировать его глобальный CSS-файл:
// import '../styles/globals.css'; // (стандартное имя для Tailwind в Next.js)

import { Analytics } from "@vercel/analytics/next"

import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo, useEffect } from 'react';
import { clusterApiUrl } from '@solana/web3.js';

// Import default styles for the wallet adapter UI
require('@solana/wallet-adapter-react-ui/styles.css');

// Компонент для логирования подключения кошелька
function WalletConnectionLogger({ children }) {
  const wallet = useWallet();
  const { connected, publicKey } = wallet;

  useEffect(() => {
    if (connected && publicKey) {
      const walletAddress = publicKey.toBase58();
      console.log('Wallet connected:', walletAddress);

      // Отправляем адрес кошелька на бэкенд
      fetch('/api/log-wallet-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: walletAddress }),
      })
      .then(async response => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({})); // Попытка получить тело ошибки
          console.error('Failed to log wallet connection:', response.status, response.statusText, errorData);
          // Можно добавить здесь более сложную обработку ошибок, например, уведомление пользователя
        } else {
          const successData = await response.json().catch(() => ({}));
          console.log('Wallet connection logged successfully:', successData);
        }
      })
      .catch(error => {
        console.error('Error sending wallet connection to API:', error);
      });
    }
  }, [connected, publicKey]); // Зависимости эффекта

  return <>{children}</>; // Просто рендерим дочерние элементы
}

// Это основной компонент приложения, который Next.js использует для инициализации страниц.
// Он позволяет добавлять глобальные стили, макеты и сохранять состояние между страницами.
export default function App({ Component, pageProps }) {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = 'devnet'; // Или используйте process.env.SOLANA_NETWORK

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      // Добавьте другие кошельки, которые хотите поддерживать
    ],
    [network]
  );

  // Теги <Head> с глобальными CSS, favicon, fonts теперь в _document.js
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletConnectionLogger>
            <Component {...pageProps} />
          </WalletConnectionLogger>
        </WalletModalProvider>
      </WalletProvider>
      <Analytics />
    </ConnectionProvider>
  );
} 