import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Пакеты монорепозитория отдаются исходниками — Next их транспилирует сам.
  transpilePackages: ['@repo/ui', '@repo/core', '@repo/contracts'],

  // [S3-B1] Бонус: включите Cache Components и переведите маршруты
  // на `use cache` + `cacheLife`/`cacheTag`.
  // cacheComponents: true,

  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },

  experimental: {
    typedEnv: false,
  },
};

export default nextConfig;
