import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, filter, map, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {BaseService} from "./base.service";
import {MessageService} from "primeng/api";
import {IParameterFilter} from "../../models/parameter-filter.interface";
import {RegionService} from "./region.service";
import {IParameter} from "../../models/parameter.interface";

@Injectable({
  providedIn: 'root'
})
export class ParameterService extends BaseService {

  constructor(private http: HttpClient, private regionService: RegionService) {
    super();
  }

  getParameters(filters: IParameterFilter[], pageSize: number, offset: number, sortField: string, sortOrder: number, nextToken: string): Observable<any> {
    const filterValues = [];
    for(let i = 0; i < filters.length; i++) {
      filterValues.push(filters[i].Values);
    }

    const f = [{
      Key: "Name",
      Option: "Contains",
      Values: filterValues
    }];

    const region = this.regionService.getRegion();

    const strFilters = encodeURIComponent(JSON.stringify(f));
    nextToken = encodeURIComponent(nextToken);
    let url = `${environment.apiBaseUrl}/v1/parameters?region=${region}&nextToken=${nextToken}&filters=${strFilters}&pagesize=${pageSize}&offset=${offset}`;

    if (sortField) {
      let sSortOrder = 'ASC';
      if (sortOrder && sortOrder === -1) {
        sSortOrder = 'DESC';
      }
      url += `&sortfield=${sortField}&sortorder=${sSortOrder}`;
    }

    console.log('Calling GET on url:' + url);
    const result$ = this.http
      .get(url)
      .pipe(map(mapParameters))
      .pipe(catchError(this.handleError));
    return result$;
  }

  updateParameter(name: string, value: string): Observable<any> {
    const region = this.regionService.getRegion();

    let url = `${environment.apiBaseUrl}/v1/parameters`;

    const body = {
      region: region,
      name: name,
      value: value
    };
    console.log('Calling PUT on url:' + url + " with body: ", body);
    const result$ = this.http
      .put(url, body)
      .pipe(map(mapParameters))
      .pipe(catchError(this.handleError));
    return result$;
  }

}

function mapParameters(r: any) {
  if(r.Parameters) {
    r.Parameters = r.Parameters.map(mapParam);
  }
  return r;
}

function mapParam(r: any): IParameter {
  const d = new Date(r.LastModifiedDate);
  const s: IParameter = {
    ARN: r.ARN,
    DataType: r.DataType,
    LastModifiedDate: r.LastModifiedDate,
    Name: r.Name,
    Description: r.Description,
    Type: r.Type,
    Value: r.Value,
    Version: r.Version,
    OriginalValue: r.Value,
    LastModifiedDateLocalFormatted: getLocalFormattedDate(d)
  }
  return s;
}

function getLocalFormattedDate(d: Date): string {
  const s = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    + ` ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return s
}
