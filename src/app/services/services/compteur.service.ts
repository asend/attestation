/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { test } from '../fn/compteur/test';
import { Test$Params } from '../fn/compteur/test';

@Injectable({ providedIn: 'root' })
export class CompteurService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `test()` */
  static readonly TestPath = '/api/compteur/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `test()` instead.
   *
   * This method doesn't expect any request body.
   */
  test$Response(params?: Test$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return test(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `test$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  test(params?: Test$Params, context?: HttpContext): Observable<string> {
    return this.test$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

}
