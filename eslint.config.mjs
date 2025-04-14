import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextjs from '@next/eslint-plugin-next';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: ['dist/*', '.next/*', 'node_modules/*'],
  },
  ...tseslint.configs.recommended,
  ...compat.extends('next/core-web-vitals'),
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Enforce Supabase client usage
      'no-restricted-imports': ['error', {
        paths: [
          {
            name: '@prisma/client',
            message: 'Please use Supabase client instead of Prisma.',
          },
          {
            name: 'next-auth',
            message: 'Please use Supabase Auth instead of NextAuth.js.',
          },
        ],
      }],
      
      // Enforce error handling pattern
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': ['error', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      }],
      
      // Enforce naming conventions
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
      ],
      
      // Enforce consistent imports
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      
      // Enforce consistent API route patterns
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      'require-await': 'error',
      
      // Enforce proper error handling
      'no-console': ['error', { allow: ['error', 'warn'] }],
      
      // Enforce proper TypeScript usage
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
  },
];
