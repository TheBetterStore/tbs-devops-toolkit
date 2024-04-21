import { Injectable } from '@angular/core';
import {throwError} from "rxjs";
import {ApplicationError} from "../../models/application-error";

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  protected handleError(error: any): any {

    console.log('Caught error: '  + JSON.stringify(error));
    console.log(error);
    let errorMsg = error.message || error.Message || error || `An unknown error has occurred while retrieving data. Please try again.`;
    if ( error.error && error.error.message ) {
      errorMsg = error.error.message;
    }

    // throw an application level error
    const e = new ApplicationError();
    e.status = error.status;
    e.message = errorMsg;

    // return Observable.throw(e);
    return throwError(e);
  }
}
