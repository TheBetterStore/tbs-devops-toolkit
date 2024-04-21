import * as util from 'util';

/**
 * Logger
 */
export class Logger {

  private static log(level: string, msg: string, params: any): void {
    const entry = {
      level: level,
      message: msg,
      params: params
    }
    console.log(util.format(entry));
  }

  static debug(msg: string, params?: any): void {
    this.log('DEBUG', msg, params);
  }

  static error(msg: string, params?: any): void {
    this.log('ERROR', msg, params);
  }

  static info(msg: string, params?: any): void {
    this.log('INFO', msg, params);
  }

  static isDebugEnabled() {
    return false;
  }

  static warn(msg: string, params?: any): void {
    this.log('WARN', msg, params);
  }

}