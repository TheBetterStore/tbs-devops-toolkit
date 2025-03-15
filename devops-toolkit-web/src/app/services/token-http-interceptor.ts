import {switchMap} from 'rxjs/operators';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {from, Observable} from 'rxjs';

// export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
//   console.log('auth interceptor...');
//   //return next(req);
//   if (req.headers.get('skip1')) {
//     console.log("Removing skip");
//     console.log(req.headers);
//     // Get rid of skip
//     const headers = req.headers
//       .delete('skip');
//     const requestClone = req.clone({
//       headers
//     });
//     return next(requestClone);
//   }
//   // @ts-ignore
//   return from(this.auth.session())
//     .pipe(
//       switchMap(session => {
//         // @ts-ignore
//         // @ts-ignore
//         // @ts-ignore
//         // @ts-ignore
//         const headers = request.headers
//           .set('Authorization', ((session && session["idToken"]+"") ? (session["idToken"].jwtToken) : null))
//           .append('Content-Type', 'application/json');
//         console.log("Headers:", headers);
//         const requestClone = req.clone({
//           headers
//         });
//         return next(requestClone);
//       })
//     );
// };

@Injectable()
export class TokenHttpInterceptor implements HttpInterceptor {

  constructor(public auth: AuthenticationService) {
    console.log("Constructed interceptor")
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skip = (request.headers.get('skip')!= null);
    // @ts-ignore
    return from(this.auth.session())
      .pipe(
        switchMap(session => {
          let requestClone: any;
          if(skip) {
            let headers = request.headers
              .delete('skip');
            requestClone = request.clone({
              headers
            });
          }
          else {
            const jwt = session?.tokens?.idToken.toString();
            let headers = request.headers
              .append('Authorization', jwt)
              .append('Content-Type', 'application/json');
            requestClone = request.clone({
              headers
            });
          }

          return next.handle(requestClone);
        })
      );
  }
}
