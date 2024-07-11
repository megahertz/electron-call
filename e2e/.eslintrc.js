'use strict';

module.exports = {
  rules: {
    'import/extensions': 'off',
    'import/no-relative-packages': 'off',
    'no-console': 'off',
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

      parserOptions: {
        sourceType: 'module',
        project: ['*/tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
  ],
};
