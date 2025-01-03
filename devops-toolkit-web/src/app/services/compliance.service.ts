import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegionService} from "./region.service";
import {BaseService} from "./base.service";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ComplianceService extends BaseService {

  constructor(private http: HttpClient, private regionService: RegionService) {
    super();
  }

  getConfigRules() {
    const region = this.regionService.getRegion();
    let url = `${environment.apiBaseUrl}/v1/config-rules?region=${region}`;

    console.log('Calling GET on url:' + url);
    const rules$ = this.http
      .get(url, {headers: {
          skip: 'true'
        }})
      .pipe(map(mapRules))
      .pipe(catchError(this.handleError));
    return rules$;
  }

  getConfigRuleDetails(ruleName: string) {
    const region = this.regionService.getRegion();
    let url = `${environment.apiBaseUrl}/v1/config-rules/${ruleName}?region=${region}`;

    console.log('Calling GET on url:' + url);
    const results$ = this.http
      .get(url, {headers: {
          skip: 'true'
        }})
      .pipe(map(mapRules))
      .pipe(catchError(this.handleError));
    return results$;
  }

  resetNonComplianceRuleCounts() {
    const region = this.regionService.getRegion();
    let url = `${environment.apiBaseUrl}/v1/config-rules/non-compliant/counts?region=${region}`;

    console.log('Calling POST on url:' + url);
    const res$ = this.http
      .post(url, {headers: {
          skip: 'true'
        }})
      .pipe(catchError(this.handleError));
    return res$;
  }
}

function mapRules(r: any) {
  return r;
}
