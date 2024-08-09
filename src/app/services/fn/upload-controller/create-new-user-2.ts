/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Upload } from '../../models/upload';

export interface CreateNewUser2$Params {
      body?: {
'file': Blob;
}
}

export function createNewUser2(http: HttpClient, rootUrl: string, params?: CreateNewUser2$Params, context?: HttpContext): Observable<StrictHttpResponse<Upload>> {
  const rb = new RequestBuilder(rootUrl, createNewUser2.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Upload>;
    })
  );
}

createNewUser2.PATH = '/upload';
