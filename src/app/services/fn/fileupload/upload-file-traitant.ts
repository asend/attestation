/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { FileUploadResponse } from '../../models/file-upload-response';

export interface UploadFileTraitant$Params {
  id: number;
      body?: {
'file': Blob;
}
}

export function uploadFileTraitant(http: HttpClient, rootUrl: string, params: UploadFileTraitant$Params, context?: HttpContext): Observable<StrictHttpResponse<FileUploadResponse>> {
  const rb = new RequestBuilder(rootUrl, uploadFileTraitant.PATH, 'post');
  if (params) {
    rb.path('id', params.id, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<FileUploadResponse>;
    })
  );
}

uploadFileTraitant.PATH = '/api/uploads/traitant/{id}';
