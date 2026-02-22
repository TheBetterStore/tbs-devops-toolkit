import {IClaims} from "../domain/models/claims.interface";

export class AuthUtils {
  static isAdmin(userClaims: IClaims): boolean {
    const userGroups = userClaims["cognito:groups"];

    let groups: string[] = [];
    if(userGroups) {
      groups = userGroups.split(',')
    }

    if(groups.includes("Administrators")) {
      return true;
    }
    return false;
  }

  static isMaintainer(userClaims: IClaims): boolean {
    const userGroups = userClaims["cognito:groups"];

    let groups: string[] = [];
    if(userGroups) {
      groups = userGroups.split(',')
    }

    if(groups.includes("Maintainers") || groups.includes("Administrators")) {
      return true;
    }
    return false;
  }

  static isViewer(userClaims: IClaims): boolean {
    const userGroups = userClaims["cognito:groups"];

    let groups: string[] = [];
    if(userGroups) {
      groups = userGroups.split(',')
    }

    if(groups.includes("Viewers") || groups.includes("Maintainers") || groups.includes("Administrators")) {
      return true;
    }
    return false;
  }
}