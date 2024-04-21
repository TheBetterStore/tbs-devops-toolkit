import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {BaseService} from "./base.service";
import {environment} from "../../environments/environment";
import {RegionService} from "./region.service";

@Injectable({
  providedIn: 'root'
})
export class StackService extends BaseService {

  constructor(private http: HttpClient, private regionService: RegionService) {
    super();
  }

  getStacks(stackName: string, nextToken: string): Observable<any> {
    const region = this.regionService.getRegion();
    console.log(stackName);
    let url = `${environment.apiBaseUrl}/v1/stacks?region=${region}`;

    if(stackName) {
      url += `&stackName=${stackName}`;
    }

    if(nextToken) {
      url += `&nextToken=${nextToken}`;
    }

    console.log('Calling GET on url:' + url);
    const stacks$ = this.http
      .get(url, {headers: {
          skip: 'true'
        }})
      .pipe(map(mapStacks))
      .pipe(catchError(this.handleError));
    return stacks$;
  }

  createChangeSet(stackName: string) {
    const region = this.regionService.getRegion();
    console.log(stackName);
    let url = `${environment.apiBaseUrl}/v1/changesets`;

    const body = {
      region: region,
      stackName: stackName
    }
    console.log('Calling POST on url:' + url);
    console.log('Using body', body)
    const stacks$ = this.http
      .post(url, body, {headers: {
          skip: 'true'
        }})
      .pipe(map(mapStacks))
      .pipe(catchError(this.handleError));
    return stacks$;
  }

  getChangeSet(changeSetId: string) {
    const region = this.regionService.getRegion();
    console.log(`${changeSetId}`);

    changeSetId = encodeURIComponent(`${changeSetId}`);
    let url = `${environment.apiBaseUrl}/v1/changesets/${changeSetId}?region=${region}`;

    console.log('Calling GET on url:' + url);
    const stacks$ = this.http
      .get(url, {headers: {
          skip: 'true'
        }})
      .pipe(map(mapStacks))
      .pipe(catchError(this.handleError));
    return stacks$;
  }

  executeChangeSet(changeSetId: string) {
    const region = this.regionService.getRegion();
    console.log(`${changeSetId}`);

    const encodedChangeSetId = encodeURIComponent(`${changeSetId}`);
    let url = `${environment.apiBaseUrl}/v1/changesets/${encodedChangeSetId}?region=${region}`;

    const body = {
      region: region,
      changeSetName: changeSetId,
    }
    console.log('Calling POST on url:' + url);
    const stacks$ = this.http
      .post(url, body, {headers: {
          skip: 'true'
        }})
      .pipe(map(mapStacks))
      .pipe(catchError(this.handleError));
    return stacks$;
  }

  checkDrift(stackName: string) {
    const region = this.regionService.getRegion();

    let url = `${environment.apiBaseUrl}/v1/stacks/${stackName}/drift?region=${region}`;

    const body = {
      region: region,
      stackName: stackName,
    }
    console.log('Calling POST on url:' + url);
    const stacks$ = this.http
      .post(url, body, {headers: {
          skip: 'true'
        }})
      .pipe(catchError(this.handleError));
    return stacks$;
  }

  describeResourceDrifts(stackName: string) {
    const region = this.regionService.getRegion();

    let url = `${environment.apiBaseUrl}/v1/stacks/${stackName}/drift?region=${region}`;

    console.log('Calling POST on url:' + url);
    const stacks$ = this.http
      .get(url, {headers: {
          skip: 'true'
        }})
      .pipe(catchError(this.handleError));
    return stacks$;
  }
}

function mapStacks(s: any) {
  return s;
}
