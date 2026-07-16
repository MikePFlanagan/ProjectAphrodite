import eslint from '@eslint/js';
import {
  defineConfig,
  globalIgnores,
} from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores([
    '**/.next/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/node_modules/**',
    '**/generated/**',
    '**/*.generated.*',
    'lint.log',
    'lint-after-config.log',
    'logs/**',
  ]),

  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [eslint.configs.recommended],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  {
    files: ['**/*.{ts,tsx,mts,cts}'],

    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
    ],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },

    rules: {
      'no-undef': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
);
