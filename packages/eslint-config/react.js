import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

import { baseConfig } from './base.js';

/** @type {import("eslint").Linter.Config[]} */
export const reactConfig = [
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Правило полезное, но в этом проекте оно только подсказывает,
      // а не роняет проверку: заготовки заданий должны линтоваться зелёным.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];

export default reactConfig;
