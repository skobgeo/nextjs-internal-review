import nextPlugin from '@next/eslint-plugin-next';

import { reactConfig } from './react.js';

/** @type {import("eslint").Linter.Config[]} */
export const nextConfig = [
  ...reactConfig,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
];

export default nextConfig;
