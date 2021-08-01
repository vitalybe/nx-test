/* eslint-disable no-console */
export enum LoggerLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

// Fork of: https://github.com/epeli/node-clim
// Usage:
//
// import moduleLogger from './logger'
// var logger = moduleLogger("file.js");
// let logger = moduleLogger("method", moduleLogger);
class Logger {
  private prefixes: string[] = [];

  constructor(private prefix: string, private parent: Logger | undefined) {
    // if method is a path, take the last section (file name)
    const lastSlashWin = this.prefix.lastIndexOf("\\");
    const lastSlashUnix = this.prefix.lastIndexOf("/");
    const lastSlash = lastSlashWin > -1 ? lastSlashWin : lastSlashUnix;
    if (lastSlash > -1) {
      this.prefix = this.prefix.substr(lastSlash + 1);
    }

    if (this.parent) {
      this.prefixes = this.prefixes.concat(this.parent.prefixes);
    }

    this.prefixes.push(`[${prefix}]`);
  }

  group(message: string, ...parts: unknown[]) {
    console.group(message, ...parts);
  }

  groupEnd() {
    console.groupEnd();
  }

  debug(message: string, ...parts: unknown[]) {
    this.logMessage(LoggerLevel.DEBUG, this.prefixes, message, ...parts);
  }
  info(message: string, ...parts: unknown[]) {
    this.logMessage(LoggerLevel.INFO, this.prefixes, message, ...parts);
  }
  warn(message: string, error?: Error) {
    if (error) {
      message += "\n" + error.stack;
    }

    this.logMessage(LoggerLevel.WARN, this.prefixes, message);
  }
  error(message: string, error?: Error) {
    if (error) {
      message += "\n" + error.stack;
    }

    this.logMessage(LoggerLevel.ERROR, this.prefixes, message);
  }

  private pad(value: number, size: number) {
    let numString = value.toString();

    while (numString.length < size) {
      numString = "0" + numString;
    }

    return numString;
  }

  private getTime() {
    const d = new Date();
    const hours = this.pad(d.getHours(), 2);
    const minutes = this.pad(d.getMinutes(), 2);
    const seconds = this.pad(d.getSeconds(), 2);
    const milliseconds = this.pad(d.getMilliseconds(), 3);

    return `${hours}:${minutes}:${seconds},${milliseconds}`;
  }

  private logMessage(level: LoggerLevel, prefixes: string[], message: string, ...parts: unknown[]) {
    let line = this.getTime();
    const levelString = level.toString();
    line += " - " + levelString.toUpperCase();
    if (prefixes.length > 0) {
      line += " - " + prefixes.join(" ");
    }
    line += " " + message;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (console as any)[levelString].call(console, line, ...parts);
  }
}

export function loggerCreator(prefix: string, parent?: Logger) {
  return new Logger(prefix, parent);
}
