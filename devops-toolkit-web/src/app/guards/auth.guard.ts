import {CanActivateFn, Router} from '@angular/router';
import {AuthenticationService} from "../services/authentication.service";
import {EnvironmentInjector, inject, runInInjectionContext} from "@angular/core";

//const injector = inject(EnvironmentInjector);
// export const AuthGuard: CanActivateFn = async (route, state) => {
//   return await inject(AuthenticationService).authenticate() ? true : inject(Router).createUrlTree(['/login']);
// };
export function AuthGuard(): CanActivateFn {
  return async (route, routerState) => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);
    const result = await authService.authenticate();
    console.log(result);
    if(result == 'undefined') {
      console.log("Do login")
      return router.navigateByUrl("/login");
    }
    else
      return result;
  }
}
