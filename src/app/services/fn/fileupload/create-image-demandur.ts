/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { FileUpload } from '../../models/file-upload';

export interface CreateImageDemandur$Params {
  idDemandeur: number;
      body?: {
'file': Blob;
}
}

export function createImageDemandur(http: HttpClient, rootUrl: string, params: CreateImageDemandur$Params, context?: HttpContext): Observable<StrictHttpResponse<FileUpload>> {
  const rb = new RequestBuilder(rootUrl, createImageDemandur.PATH, 'post');
  if (params) {
    rb.path('idDemandeur', params.idDemandeur, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<FileUpload>;
    })
  );
}

createImageDemandur.PATH = '/api/uploads/create/{idDemandeur}';
