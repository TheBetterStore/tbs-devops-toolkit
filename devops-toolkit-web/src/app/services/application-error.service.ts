import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegionService} from "./region.service";
import {BaseService} from "./base.service";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApplicationErrorService extends BaseService {

  constructor(private http: HttpClient, private regionService: RegionService) {
    super();
  }

  getAppErrorConfigs() {
    let url = `${environment.apiBaseUrl}/v1/app-error-configs`;

    console.log('Calling GET on url:' + url);
    const rules$ = this.http
      .get(url, {headers: {
          skip: 'true'
        }})
      .pipe(map(mapConfigs))
      .pipe(catchError(this.handleError));
    return rules$;
  }

  getAppErrorCodes(appId: string) {
    let url = `${environment.apiBaseUrl}/v1/app-error-codes?applicationId=${appId}`;

    console.log('Calling GET on url:' + url);
    const rules$ = this.http
      .get(url, {headers: {
          skip: 'true'
        }})
      .pipe(map(mapConfigs))
      .pipe(catchError(this.handleError));
    return rules$;
  }
}

function mapConfigs(r: any) {
  return r;
}
