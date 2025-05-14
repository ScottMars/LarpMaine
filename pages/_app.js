import '../public/css/index.css';
import '../public/css/home.css';
import '../public/css/vote.css';
import '../public/css/winner.css';
// import Head from 'next/head'; // Больше не нужен здесь для этих ссылок

// Если вы решите установить Tailwind CSS как зависимость, здесь также можно будет импортировать его глобальный CSS-файл:
// import '../styles/globals.css'; // (стандартное имя для Tailwind в Next.js)

import { Analytics } from "@vercel/analytics/next"

// Это основной компонент приложения, который Next.js использует для инициализации страниц.
// Он позволяет добавлять глобальные стили, макеты и сохранять состояние между страницами.
export default function MyApp({ Component, pageProps }) {
  // Теги <Head> с глобальными CSS, favicon, fonts теперь в _document.js
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
} 