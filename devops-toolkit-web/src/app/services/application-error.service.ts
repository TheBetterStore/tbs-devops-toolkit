import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegionService} from "./region.service";
import {BaseService} from "./base.service";
import {environment} from "../../environments/environment";
import {catchError, map, Observable} from "rxjs";
import {IApplicationErrorCode} from "../../models/application-error-code.interface";
import {IApplicationErrorConfig} from "../../models/application-error-config.interface";

@Injectable({
  providedIn: 'root'
})
export class ApplicationErrorService extends BaseService {

  constructor(private http: HttpClient, private regionService: RegionService) {
    super();
  }

  getAppErrorConfigs(): Observable<any> {
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

  saveAppErrorConfig(a: IApplicationErrorConfig) {
    const region = this.regionService.getRegion();
    a.Region = region;

    let url = `${environment.apiBaseUrl}/v1/app-error-configs`;

    console.log('Calling PUT on url:' + url + " with body: ", a);
    const result$ = this.http
      .put(url, a, {headers: {
          skip: 'true'
        }})
      .pipe(catchError(this.handleError));
    return result$;
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
  let x: IApplicationErrorConfig[] =r.Items;
  let y = x.map(mapConfig);
  return y;
}

function mapConfig(r: IApplicationErrorConfig): IApplicationErrorConfig {
  r.Id = r.ApplicationId;
  return r;
}

function mapCodes(r: any): IApplicationErrorCode[] {
  let x: IApplicationErrorCode[] =r.Items;
  let y = x.map(mapCode);
  console.log(y);
  return y;
}

function mapCode(r: IApplicationErrorCode): IApplicationErrorCode {
  console.log(r);
  r.Id = `${r.ApplicationId}|${r.ErrorCode}`;
  return r;
}
