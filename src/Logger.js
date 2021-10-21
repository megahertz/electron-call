'use strict';

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

class Logger {
  constructor({ target, level = 'info' }) {
    this.target = target;
    this.level = level;

    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);
    this.info = this.info.bind(this);
    this.debug = this.debug.bind(this);
  }

  error(...args) {
    this.log('error', args);
  }

  warn(...args) {
    this.log('warn', args);
  }

  info(...args) {
    this.log('info', args);
  }

  debug(...args) {
    this.log('debug', args);
  }

  log(level, args) {
    if (!this.target || typeof this.target[level] !== 'function') {
      return;
    }

    if (LEVELS[level] > LEVELS[this.level]) {
      return;
    }

    this.target[level](...args);
  }
}

module.exports = Logger;
