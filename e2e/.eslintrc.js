'use strict';

module.exports = {
  rules: {
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: ['**/*.js'],
    }],
    'no-console': 'off',
  },
};
