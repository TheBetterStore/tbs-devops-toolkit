import {CanActivateFn, Router} from '@angular/router';
import {AuthenticationService} from "../services/authentication.service";
import {EnvironmentInjector, inject, runInInjectionContext} from "@angular/core";

export function ViewAuthGuard(): CanActivateFn {
  return async (route, routerState) => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);
    const result = await authService.authenticate();
    if(!authService.isViewer()) {
      console.log("Not authorised")
      return router.navigateByUrl("/login");
    }
    else
      return result;
  }
}
