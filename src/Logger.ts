const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 } as const;

export default class Logger {
  private readonly target?: LoggerFunctions;
  private readonly level: LogLevel;

  constructor({
    target,
    level = 'info',
  }: {
    target: LoggerFunctions;
    level?: LogLevel;
  }) {
    this.target = target;
    this.level = level;

    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);
    this.info = this.info.bind(this);
    this.debug = this.debug.bind(this);
  }

  error(...args: unknown[]) {
    this.log('error', args);
  }

  warn(...args: unknown[]) {
    this.log('warn', args);
  }

  info(...args: unknown[]) {
    this.log('info', args);
  }

  debug(...args: unknown[]) {
    this.log('debug', args);
  }

  log(level: LogLevel, args: any[]) {
    if (!this.target || typeof this.target[level] !== 'function') {
      return;
    }

    if (LEVELS[level] > LEVELS[this.level]) {
      return;
    }

    this.target[level](...args);
  }
}

export interface LoggerFunctions {
  error(...params: unknown[]): void;
  warn(...params: unknown[]): void;
  info(...params: unknown[]): void;
  debug(...params: unknown[]): void;
}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
