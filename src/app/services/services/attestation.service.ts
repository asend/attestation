/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { generate } from '../fn/attestation/generate';
import { Generate$Params } from '../fn/attestation/generate';

@Injectable({ providedIn: 'root' })
export class AttestationService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `generate()` */
  static readonly GeneratePath = '/api/attestation/pdf_genere';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `generate()` instead.
   *
   * This method doesn't expect any request body.
   */
  generate$Response(params: Generate$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return generate(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `generate$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  generate(params: Generate$Params, context?: HttpContext): Observable<number> {
    return this.generate$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  generatePdfRejet(idUser: number, idDemandeur: number, idDemande: number, idStructure: number): Observable<number> {
    const params = new HttpParams()
      .set('idUser', idUser.toString())
      .set('idDemandeur', idDemandeur.toString())
      .set('idDemande', idDemande.toString())
      .set('idStructure', idStructure.toString());

    return this.http.get<number>(`${this.rootUrl}/api/attestation/pdf_rejet`, { params });
  }

}
