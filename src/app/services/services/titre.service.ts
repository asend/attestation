/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { createTitre } from '../fn/titre/create-titre';
import { CreateTitre$Params } from '../fn/titre/create-titre';
import { deleteTitre } from '../fn/titre/delete-titre';
import { DeleteTitre$Params } from '../fn/titre/delete-titre';
import { getAllTitres } from '../fn/titre/get-all-titres';
import { GetAllTitres$Params } from '../fn/titre/get-all-titres';
import { TitreDto } from '../models/titre-dto';

@Injectable({ providedIn: 'root' })
export class TitreService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getAllTitres()` */
  static readonly GetAllTitresPath = '/api/titre';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllTitres()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllTitres$Response(params?: GetAllTitres$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<TitreDto>>> {
    return getAllTitres(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllTitres$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllTitres(params?: GetAllTitres$Params, context?: HttpContext): Observable<Array<TitreDto>> {
    return this.getAllTitres$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<TitreDto>>): Array<TitreDto> => r.body)
    );
  }

  /** Path part for operation `createTitre()` */
  static readonly CreateTitrePath = '/api/titre';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createTitre()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createTitre$Response(params: CreateTitre$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return createTitre(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createTitre$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createTitre(params: CreateTitre$Params, context?: HttpContext): Observable<number> {
    return this.createTitre$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `deleteTitre()` */
  static readonly DeleteTitrePath = '/api/titre/delete/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteTitre()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteTitre$Response(params: DeleteTitre$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return deleteTitre(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteTitre$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteTitre(params: DeleteTitre$Params, context?: HttpContext): Observable<number> {
    return this.deleteTitre$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

}
