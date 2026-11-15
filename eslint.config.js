import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**'],
  },

  eslint.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-console': 'warn',
    },
  },

  {
    files: ['tests/**/*.ts', 'vitest.config.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },

  prettier,
);
