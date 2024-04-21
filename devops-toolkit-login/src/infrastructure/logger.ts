import * as util from 'util';

/**
 * Logger
 */
export class Logger {
  /**
   * log
   * @param {string} level
   * @param {string} msg
   * @param {any} params
   * @private
   */
  private static log(level: string, msg: string, params: any): void {
    const entry = {
      level: level,
      message: msg,
      params: params,
    };
    console.log(util.format(entry));
  }

  /**
   * debug
   * @param {string} msg
   * @param {any} params
   * @public
   */
  public static debug(msg: string, params?: any): void {
    this.log('DEBUG', msg, params);
  }

  /**
   * error
   * @param {string} msg
   * @param {any} params
   * @public
   */
  public static error(msg: string, params?: any): void {
    this.log('ERROR', msg, params);
  }

  /**
   * info
   * @param {string} msg
   * @param {any} params
   * @public
   */
  public static info(msg: string, params?: any): void {
    this.log('INFO', msg, params);
  }

  /**
   * isDebugEnabled
   * @public
   * @return {boolean}
   */
  public static isDebugEnabled() {
    return false;
  }

  /**
   * warn
   * @param {string} msg
   * @param {any} params
   * @public
   */
  public static warn(msg: string, params?: any): void {
    this.log('WARN', msg, params);
  }
}
