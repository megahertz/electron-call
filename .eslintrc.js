'use strict';

module.exports = {
  extends: 'airbnb-base',
  env: {
    es6: true,
    node: true,
    jasmine: true,
  },

  parserOptions: {
    sourceType: 'script',
  },

  settings: {
    'import/core-modules': ['humile', 'electron'],
  },

  rules: {
    'class-methods-use-this': 'off',
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
    // 'import/no-extraneous-dependencies': ['error', {
    //   devDependencies: ['e2e/**/*.js', '**/*.spec.js'],
    // }],
    'max-len': ['error', { code: 80 }],
    'no-continue': 'off',
    'no-multi-spaces': ['error', {
      exceptions: {
        AssignmentExpression: true,
        AssignmentPattern: true,
        CallExpression: true,
        VariableDeclarator: true,
      },
    }],
    'no-unused-expressions': 'off',
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: true,
    }],
    'no-use-before-define': 'off',
    'no-restricted-syntax': 'off',
    'object-curly-newline': 'off',
    'prefer-destructuring': 'off',
    'prefer-spread': 'off',
    'prefer-template': 'off',
    strict: ['error', 'global'],
  },
};
