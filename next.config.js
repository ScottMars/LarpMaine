/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/rules',
        destination: '/rules.html', // Next.js будет искать rules.html в директории public
      },
      // Пример для других страниц, если понадобится:
      // { source: '/vote', destination: '/vote.html' }, 
      // { source: '/coming', destination: '/coming.html' },
      // { source: '/leaderboard', destination: '/leaderboard.html' },
      // { source: '/roadmap', destination: '/roadmap.html' },
    ];
  },
};

module.exports = nextConfig; 