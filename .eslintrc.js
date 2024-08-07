'use strict';

const rules = {
  'import/no-extraneous-dependencies': 'off',
  'import/prefer-default-export': 'off',
  'no-continue': 'off',
  'no-restricted-syntax': 'off',
  'prettier/prettier': 'error',
};

module.exports = {
  env: {
    es6: true,
    node: true,
    jasmine: true,
  },

  parserOptions: {
    sourceType: 'script',
    ecmaVersion: 2022,
  },

  settings: {
    'import/core-modules': ['humile', 'electron'],
  },

  ignorePatterns: ['dist/', 'node_modules/'],

  extends: ['airbnb-base', 'prettier'],

  plugins: ['prettier'],

  rules: {
    ...rules,
    'class-methods-use-this': 'off',
    // 'import/no-extraneous-dependencies': ['error', {
    //   devDependencies: ['e2e/**/*.js', '**/*.spec.js'],
    // }],
    'max-len': ['error', { code: 80 }],
    'no-continue': 'off',
    'no-multi-spaces': [
      'error',
      {
        exceptions: {
          AssignmentExpression: true,
          AssignmentPattern: true,
          CallExpression: true,
          VariableDeclarator: true,
        },
      },
    ],
    'no-unused-expressions': 'off',
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
      },
    ],
    'no-use-before-define': 'off',
    'no-restricted-syntax': 'off',
    'object-curly-newline': 'off',
    'prefer-destructuring': 'off',
    'prefer-spread': 'off',
    'prefer-template': 'off',
    'strict': ['error', 'global'],
  },

  overrides: [
    {
      files: ['*.mjs'],
      parserOptions: {
        sourceType: 'module',
      },
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },

    {
      files: ['*.ts'],

      extends: [
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
      ],

      parser: '@typescript-eslint/parser',

      parserOptions: {
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },

      plugins: ['@typescript-eslint', 'prettier'],

      rules: {
        ...rules,
        '@typescript-eslint/lines-between-class-members': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            vars: 'all',
            args: 'after-used',
            ignoreRestSiblings: true,
          },
        ],
        '@typescript-eslint/no-use-before-define': 'off',
      },
    },
  ],
};
