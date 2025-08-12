// eslint.config.js  – flat‑config format
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';

// ──────────────────────────────────────────────────────────────────────────
// Local rule: allowed‑graphql‑exports  (no package.json, no build step)
import { allowedGraphqlExportsRule } from './config/eslint-rules/allowed-graphql-exports.js';
// ──────────────────────────────────────────────────────────────────────────

export default [
  // ❶ Base config for all TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['dist/**', 'build/**', 'node_modules/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      // env: {
      //   node: true,
      // },
    },

    // Plugins live in an object instead of an array
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
      import: importPlugin,
    },

    rules: {
      // Your previous rule set, unchanged
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
      'import/order': ['error', { groups: [['builtin', 'external', 'internal']] }],
      'import/no-default-export': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      'func-style': ['warn', 'expression', { allowArrowFunctions: true }],
      'prefer-arrow-callback': 'warn',
      'arrow-body-style': ['warn', 'as-needed'],
      'no-confusing-arrow': ['warn', { allowParens: true }],
      'require-await': 'warn',
      'no-return-await': 'warn',
    },
  },

  // ❷ Override: files that *must* have a default export
  {
    files: ['src/modules/**/model.ts', 'src/db.ts', 'codegen.ts', 'apollo.config.ts'],
    rules: {
      'import/no-default-export': 'off',
      'import/prefer-default-export': 'error',
    },
  },

  // ❸ Override: custom rule for *.graphql.ts
  {
    files: ['**/graphql.ts'],
    plugins: {
      gql: { rules: { 'allowed-exports': allowedGraphqlExportsRule } },
    },
    rules: {
      'gql/allowed-exports': 'error',
    },
  },
];
