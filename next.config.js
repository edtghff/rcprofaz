/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    unoptimized: false,
    // Отключаем кеширование изображений в dev режиме
    minimumCacheTTL: 0,
  },
}

module.exports = nextConfig

