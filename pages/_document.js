import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

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
        {/* Yandex.Metrika counter */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(101847762, "init", {
                 clickmap:true,
                 trackLinks:true,
                 accurateTrackBounce:true,
                 webvisor:true
            });
          `}
        </Script>
        <noscript>
          <div><img src="https://mc.yandex.ru/watch/101847762" style={{position:'absolute', left:'-9999px'}} alt="" /></div>
        </noscript>
        {/* /Yandex.Metrika counter */}
      </body>
    </Html>
  );
} 