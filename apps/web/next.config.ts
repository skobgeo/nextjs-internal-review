import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Пакеты монорепозитория отдаются исходниками — Next их транспилирует сам.
  transpilePackages: ['@repo/ui', '@repo/core', '@repo/contracts'],

  experimental: {
    typedEnv: false,
  },
};

export default nextConfig;
