/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { UtilisateurDto } from '../../models/utilisateur-dto';

export interface GetByProfileCode$Params {
  code: string;
}

export function getByProfileCode(http: HttpClient, rootUrl: string, params: GetByProfileCode$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<UtilisateurDto>>> {
  const rb = new RequestBuilder(rootUrl, getByProfileCode.PATH, 'get');
  if (params) {
    rb.path('code', params.code, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<UtilisateurDto>>;
    })
  );
}

getByProfileCode.PATH = '/api/utilisateur/getUtilisateurProfile/{code}';
