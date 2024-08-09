/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Upload } from '../../models/upload';

export interface GetAllUser1$Params {
}

export function getAllUser1(http: HttpClient, rootUrl: string, params?: GetAllUser1$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Upload>>> {
  const rb = new RequestBuilder(rootUrl, getAllUser1.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<Upload>>;
    })
  );
}

getAllUser1.PATH = '/upload';
