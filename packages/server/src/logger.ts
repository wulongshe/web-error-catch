/**
 * 统一的日志工具
 * 支持 debug, info, warn, error 四个日志级别
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVEL_MAP: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const LEVEL_PREFIX: Record<LogLevel, string> = {
  debug: '[DEBUG]',
  info: '[INFO]',
  warn: '[WARN]',
  error: '[ERROR]',
};

const LEVEL_COLOR: Record<LogLevel, string> = {
  debug: '\x1b[36m', // cyan
  info: '\x1b[32m',  // green
  warn: '\x1b[33m',  // yellow
  error: '\x1b[31m', // red
};

const COLOR_RESET = '\x1b[0m';

// 获取最小日志级别（从环境变量或默认值）
const MIN_LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const MIN_LEVEL_NUM = LOG_LEVEL_MAP[MIN_LOG_LEVEL as LogLevel] ?? 1;

function getTimestamp(): string {
  return new Date().toISOString();
}

function formatMessage(level: LogLevel, message: string, data?: any): string {
  const timestamp = getTimestamp();
  const color = LEVEL_COLOR[level];
  const prefix = LEVEL_PREFIX[level];

  let formatted = `${color}${prefix}${COLOR_RESET} ${timestamp} ${message}`;

  if (data !== undefined) {
    if (typeof data === 'object') {
      formatted += '\n' + JSON.stringify(data, null, 2);
    } else {
      formatted += ` ${data}`;
    }
  }

  return formatted;
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_MAP[level] >= MIN_LEVEL_NUM;
}

export const logger = {
  debug(message: string, data?: any) {
    if (shouldLog('debug')) {
      console.debug(formatMessage('debug', message, data));
    }
  },

  info(message: string, data?: any) {
    if (shouldLog('info')) {
      console.log(formatMessage('info', message, data));
    }
  },

  warn(message: string, data?: any) {
    if (shouldLog('warn')) {
      console.warn(formatMessage('warn', message, data));
    }
  },

  error(message: string, data?: any) {
    if (shouldLog('error')) {
      console.error(formatMessage('error', message, data));
    }
  },
};
