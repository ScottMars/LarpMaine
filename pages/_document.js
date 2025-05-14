import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        {/* Стили, которые мы переносим из _app.js */}
        <link rel="stylesheet" href="/css/index.css" />
        <link rel="stylesheet" href="/css/home.css" />
        <link rel="stylesheet" href="/css/vote.css" />
        <link rel="stylesheet" href="/css/winner.css" />
        
        {/* Favicon (убедитесь, что путь корректен относительно директории public) */}
        <link rel="icon" type="image/png" href="/images/Favicon memeotica.png" /> 
        
        {/* Шрифты Google */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
        
        {/* Tailwind CSS CDN (если вы все еще хотите использовать его глобально таким образом) */}
        {/* Для Next.js страниц предпочтительнее настроить Tailwind через postcss и tailwind.config.js */}
        {/* <script src="https://cdn.tailwindcss.com" async /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 