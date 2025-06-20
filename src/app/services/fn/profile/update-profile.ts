/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ProfileDto } from '../../models/profile-dto';

export interface UpdateProfile$Params {
  id: number;
      body: ProfileDto
}

export function updateProfile(http: HttpClient, rootUrl: string, params: UpdateProfile$Params, context?: HttpContext): Observable<StrictHttpResponse<ProfileDto>> {
  const rb = new RequestBuilder(rootUrl, updateProfile.PATH, 'put');
  if (params) {
    rb.path('id', params.id, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ProfileDto>;
    })
  );
}

updateProfile.PATH = '/api/profile/{id}';
