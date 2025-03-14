import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegionService} from "./region.service";
import {BaseService} from "./base.service";
import {environment} from "../../environments/environment";
import {catchError, map, Observable} from "rxjs";
import {IApplicationErrorCode} from "../../models/application-error-code.interface";

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

  getAppErrorCodes(appId: string): Observable<any> {
    let url = `${environment.apiBaseUrl}/v1/app-error-codes?applicationId=${appId}`;

    console.log('Calling GET on url:' + url);
    const codes$ = this.http
      .get(url, {headers: {
          skip: 'true'
        }})
      .pipe(map(mapCodes))
      .pipe(catchError(this.handleError));
    return codes$;
  }

  saveAppErrorCode(a: IApplicationErrorCode) {
    const region = this.regionService.getRegion();

    let url = `${environment.apiBaseUrl}/v1/app-error-codes`;

    console.log('Calling PUT on url:' + url + " with body: ", a);
    const result$ = this.http
      .put(url, a,{headers: {
          skip: 'true'
        }})
      .pipe(catchError(this.handleError));
    return result$;
  }
}

function mapConfigs(r: any) {
  return r;
}

function mapCodes(r: any): IApplicationErrorCode[] {
  let x: IApplicationErrorCode[] =r.Items;
  //r.map(mapConfig)
  let y = x.map(mapCode);
  console.log(y);
  return y;
}

function mapCode(r: IApplicationErrorCode): IApplicationErrorCode {
  console.log(r);
  r.Id = `${r.ApplicationId}|${r.ErrorCode}`;
  return r;
}
