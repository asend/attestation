/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ProfileDto } from '../../models/profile-dto';

export interface FindByProfile$Params {
  code: string;
}

export function findByProfile(http: HttpClient, rootUrl: string, params: FindByProfile$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<ProfileDto>>> {
  const rb = new RequestBuilder(rootUrl, findByProfile.PATH, 'get');
  if (params) {
    rb.path('code', params.code, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<ProfileDto>>;
    })
  );
}

findByProfile.PATH = '/api/profile/getByProfile/{code}';
