/**
 * InvalidDataError
 */
export class InvalidDataError extends Error {
  /**
   * constructor
   * @param {string} message
   */
  constructor(message: string) {
    super(message);
  }
}
