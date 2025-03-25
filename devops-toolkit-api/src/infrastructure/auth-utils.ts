import {IClaims} from '../domain/models/claims.interface';

/**
 * AuthUtils
 */
export class AuthUtils {

  /**
   * isAdmin
   * @param {IClaims} userClaims
   * @return {boolean}
   */
  static isAdmin(userClaims: IClaims): boolean {
    const userGroups = userClaims['cognito:groups'];

    let groups: string[] = [];
    if (userGroups) {
      groups = userGroups.split(',');
    }

    if (groups.includes('Administrators')) {
      return true;
    }
    return false;
  }

  /**
   * isMaintainer
   * @param {IClaims} userClaims
   * @return {boolean}
   */
  static isMaintainer(userClaims: IClaims): boolean {
    const userGroups = userClaims['cognito:groups'];

    let groups: string[] = [];
    if (userGroups) {
      groups = userGroups.split(',');
    }

    if (groups.includes('Maintainers') || groups.includes('Administrators')) {
      return true;
    }
    return false;
  }

  /**
   * isViewer
   * @param {IClaims} userClaims
   * @return {boolean}
   */
  static isViewer(userClaims: IClaims): boolean {
    const userGroups = userClaims['cognito:groups'];

    let groups: string[] = [];
    if (userGroups) {
      groups = userGroups.split(',');
    }

    if (groups.includes('Viewers') || groups.includes('Maintainers') || groups.includes('Administrators')) {
      return true;
    }
    return false;
  }
}
