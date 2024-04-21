import {EventEmitter, Injectable, Output} from '@angular/core';
import {
  fetchAuthSession,
  getCurrentUser,
  signOut
} from 'aws-amplify/auth';
import {ILogin} from "../../models/login.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  @Output() loginEvent: EventEmitter<any> = new EventEmitter();

  private loggedIn = false;
  login?: ILogin;

  emitUser(login: ILogin): void {
    this.loginEvent.emit(login);
  }

  async authenticate(): Promise<any> {
    const self = this;
    let firstname;

    try {
      const session = await fetchAuthSession();

      //console.log("session:", session);

      let groups: any = session?.tokens?.idToken?.payload["cognito:groups"];

      if(!Boolean(groups)) {
        groups = [];
      }

      //console.log("Token: " + session?.tokens?.idToken);

      this.login = {
        firstname: session?.tokens?.idToken?.payload['given_name'] + '',
        groups: groups
      };
      this.loginEvent.emit(this.login);

      return this.login.firstname;
    } catch (e: any) {
      console.log('Failed auth:' + e.message);
      return "";
    }
  }

  async session(): Promise<any> {
    const self = this;
    let firstname;

    try {
      const session = await fetchAuthSession();
      return session;
    } catch (e: any) {
      console.log('Failed auth:' + e.message);
      return "";
    }
  }


  async logout(): Promise<any> {
    await signOut();
    this.loginEvent.emit('');
  }


  isAdmin(): boolean {
    const result = Boolean(this?.login && this?.login?.groups && this.login?.groups.find((x: string) => x === 'Administrators'))
    return result;
  }

  isMaintainer(): boolean {
    const result =  Boolean(this?.login && this?.login?.groups && (this?.login?.groups.find((x: string) => x === 'Administrators') ||
      this.login.groups.find((x: string) => x === 'Maintainers')));
    return result;
  }

  isViewer(): boolean {
    const result =  Boolean(this?.login && this?.login?.groups && (this?.login?.groups.find((x: string) => x === 'Administrators') ||
      this?.login?.groups.find(x => x === 'Maintainers') || this?.login?.groups.find((x: string) => x === 'Viewers')));
    return result;
  }

  hasNoGroups(): boolean {
    const result = !this.isViewer();
    return result;
  }
}
