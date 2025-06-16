/**
 * @type {import('eslint').Linter.Config}
 * ESLint configuration for the auth microservice
 */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    ecmaVersion: 2023,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  env: {
    node: true,
    es2023: true,
    jest: true,
  },
  ignorePatterns: ['prisma/**/*', 'dist/**/*', 'node_modules/**/*', 'coverage/**/*'],
  reportUnusedDisableDirectives: true,
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        // Error prevention
        'no-console': 'warn',
        'no-return-await': 'error',
        'no-unused-vars': 'off', // Using TypeScript's check instead
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
          },
        ],
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-unused-expressions': 'error',

        // Code style
        'prefer-const': 'error',
        'no-var': 'error',
        'object-shorthand': 'error',
        'arrow-body-style': ['error', 'as-needed'],
        'prefer-template': 'error',
        'quote-props': ['error', 'as-needed'],

        // Async
        'require-await': 'error',

        // Error handling
        'no-throw-literal': 'error',

        // Imports
        'sort-imports': [
          'error',
          {
            ignoreCase: true,
            ignoreDeclarationSort: true,
          },
        ],
      },
    },
    // Special rule overrides for test files
    {
      files: ['**/*.test.ts', '**/*.spec.ts', 'test/**/*.ts', '__tests__/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'require-await': 'off',
      },
    },
    {
      files: ['src/utils/config.ts'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        'no-console': 'off',
      },
    },
    {
      files: ['src/utils/bcrypt.ts'],
      rules: {
        'require-await': 'off',
      },
    },
    {
      files: ['src/types/common.types.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      files: ['src/types/user.types.ts'],
      rules: {
        '@typescript-eslint/no-empty-object-type': 'off',
      },
    },
    {
      files: ['src/utils/prisma.ts'],
      rules: {
        'no-var': 'off',
      },
    },
  ],
};
