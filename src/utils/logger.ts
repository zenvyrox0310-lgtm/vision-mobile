/**
 * Logger utility for Vision Mobile
 * Provides structured logging with levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: number;
  level: LogLevel;
  module: string;
  message: string;
  data?: unknown;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private isDevelopment = true;

  constructor() {
    this.isDevelopment = !import.meta.env.PROD;
  }

  private createEntry(level: LogLevel, module: string, message: string, data?: unknown): LogEntry {
    return {
      timestamp: performance.now(),
      level,
      module,
      message,
      data,
    };
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  private formatMessage(entry: LogEntry): string {
    return `[${entry.module}] ${entry.message}`;
  }

  debug(module: string, message: string, data?: unknown): void {
    const entry = this.createEntry('debug', module, message, data);
    this.addLog(entry);
    if (this.isDevelopment) {
      console.debug(this.formatMessage(entry), data);
    }
  }

  info(module: string, message: string, data?: unknown): void {
    const entry = this.createEntry('info', module, message, data);
    this.addLog(entry);
    console.info(this.formatMessage(entry), data);
  }

  warn(module: string, message: string, data?: unknown): void {
    const entry = this.createEntry('warn', module, message, data);
    this.addLog(entry);
    console.warn(this.formatMessage(entry), data);
  }

  error(module: string, message: string, error?: unknown): void {
    const entry = this.createEntry('error', module, message, error);
    this.addLog(entry);
    console.error(this.formatMessage(entry), error);
  }

  getLogs(level?: LogLevel, module?: string): LogEntry[] {
    return this.logs.filter(
      (log) => (!level || log.level === level) && (!module || log.module === module)
    );
  }

  clear(): void {
    this.logs = [];
  }
}

export const logger = new Logger();
