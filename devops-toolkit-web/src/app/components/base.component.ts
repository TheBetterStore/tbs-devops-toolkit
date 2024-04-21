import {AuthenticationService} from "../services/authentication.service";

export class BaseComponent {

  protected authenticationService: AuthenticationService;
  constructor(authenticationService: AuthenticationService) {
    this.authenticationService = authenticationService
  }

  isAdmin(): boolean {
    return this.authenticationService.isAdmin();
  }

  isMaintainer(): boolean {
    return this.authenticationService.isMaintainer();
  }

  isViewer(): boolean {
    return this.authenticationService.isViewer();
  }

  hasNoGroups(): boolean {
    return this.authenticationService.hasNoGroups();
  }

}
