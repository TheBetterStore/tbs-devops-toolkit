import {CanActivateFn, Router} from '@angular/router';
import {AuthenticationService} from "../services/authentication.service";
import {EnvironmentInjector, inject, runInInjectionContext} from "@angular/core";

export function MaintainAuthGuard(): CanActivateFn {
  return async (route, routerState) => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);
    const result = await authService.authenticate();
    console.log(result);
    if(!authService.isMaintainer()) {
      console.log("Not authorised as Maintainer")
      return router.navigateByUrl("/login");
    }
    else
      return result;
  }
}
