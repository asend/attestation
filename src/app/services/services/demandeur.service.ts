/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { DemandeurDto } from '../models/demandeur-dto';
import { findAll1 } from '../fn/demandeur/find-all-1';
import { FindAll1$Params } from '../fn/demandeur/find-all-1';
import { getAllDemandeurs } from '../fn/demandeur/get-all-demandeurs';
import { GetAllDemandeurs$Params } from '../fn/demandeur/get-all-demandeurs';
import { getById1 } from '../fn/demandeur/get-by-id-1';
import { GetById1$Params } from '../fn/demandeur/get-by-id-1';
import { getByNin1 } from '../fn/demandeur/get-by-nin-1';
import { GetByNin1$Params } from '../fn/demandeur/get-by-nin-1';
import { incription } from '../fn/demandeur/incription';
import { Incription$Params } from '../fn/demandeur/incription';
import { register } from '../fn/demandeur/register';
import { Register$Params } from '../fn/demandeur/register';
import { updateDemandeur } from '../fn/demandeur/update-demandeur';
import { UpdateDemandeur$Params } from '../fn/demandeur/update-demandeur';
import { environment } from 'src/environments/environment';
import { Demandeur } from '../models';

@Injectable({ providedIn: 'root' })
export class DemandeurService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `updateDemandeur()` */
  static readonly UpdateDemandeurPath = '/api/demandeur/update';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateDemandeur()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateDemandeur$Response(params: UpdateDemandeur$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return updateDemandeur(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `updateDemandeur$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateDemandeur(params: UpdateDemandeur$Params, context?: HttpContext): Observable<number> {
    return this.updateDemandeur$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `getAllDemandeurs()` */
  static readonly GetAllDemandeursPath = '/api/demandeur';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllDemandeurs()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllDemandeurs$Response(params?: GetAllDemandeurs$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<DemandeurDto>>> {
    return getAllDemandeurs(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllDemandeurs$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllDemandeurs(params?: GetAllDemandeurs$Params, context?: HttpContext): Observable<Array<DemandeurDto>> {
    return this.getAllDemandeurs$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<DemandeurDto>>): Array<DemandeurDto> => r.body)
    );
  }

  /** Path part for operation `register()` */
  static readonly RegisterPath = '/api/demandeur';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `register()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  register$Response(params: Register$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return register(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `register$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  register(params: Register$Params, context?: HttpContext): Observable<number> {
    return this.register$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `incription()` */
  static readonly IncriptionPath = '/api/demandeur/demander';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `incription()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  incription$Response(params: Incription$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return incription(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `incription$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  incription(params: Incription$Params, context?: HttpContext): Observable<number> {
    return this.incription$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `findAll1()` */
  static readonly FindAll1Path = '/api/demandeur/getDemandeur';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAll1()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAll1$Response(params?: FindAll1$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<DemandeurDto>>> {
    return findAll1(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findAll1$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAll1(params?: FindAll1$Params, context?: HttpContext): Observable<Array<DemandeurDto>> {
    return this.findAll1$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<DemandeurDto>>): Array<DemandeurDto> => r.body)
    );
  }

  /** Path part for operation `getByNin1()` */
  static readonly GetByNin1Path = '/api/demandeur/details/{nin}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getByNin1()` instead.
   *
   * This method doesn't expect any request body.
   */
  getByNin1$Response(params: GetByNin1$Params, context?: HttpContext): Observable<StrictHttpResponse<DemandeurDto>> {
    return getByNin1(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getByNin1$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getByNin1(params: GetByNin1$Params, context?: HttpContext): Observable<DemandeurDto> {
    return this.getByNin1$Response(params, context).pipe(
      map((r: StrictHttpResponse<DemandeurDto>): DemandeurDto => r.body)
    );
  }

  /** Path part for operation `getById1()` */
  static readonly GetById1Path = '/api/demandeur/demandeurDetails/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getById1()` instead.
   *
   * This method doesn't expect any request body.
   */
  getById1$Response(params: GetById1$Params, context?: HttpContext): Observable<StrictHttpResponse<DemandeurDto>> {
    return getById1(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getById1$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getById1(params: GetById1$Params, context?: HttpContext): Observable<DemandeurDto> {
    return this.getById1$Response(params, context).pipe(
      map((r: StrictHttpResponse<DemandeurDto>): DemandeurDto => r.body)
    );
  }


  private baseUrl = environment.apiUrl; // Adaptez l'URL si besoin


  updateMatriculeSolde(id: number, matriculeSolde: string): Observable<number> {
    const payload = { matriculeSolde: matriculeSolde };
    const url = `${this.baseUrl}/api/demandeur/update-matricule-solde/${id}`;
  
    console.log("URL de la requête :", url);
    console.log("Payload envoyé :", payload);
  
    return this.http.put<number>(url, payload);
  }
  

  // updateDemandeurAndUtilisateur(id: number, data: any): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/api/demandeur/updateDemandeurAndUtilisateur/${id}`, data);
  // }
  // getDemandeurById(id: number): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/api/demandeur/demandeurId/${id}`);
  // }


  getDemandeurById(id: number): Observable<Demandeur> {
    return this.http.get<Demandeur>(`${this.baseUrl}/api/demandeur/demandeurs/${id}`);
  }
  updateDemandeurAndUtilisateur(id: number, demandeur: Demandeur): Observable<Demandeur> {
    return this.http.put<Demandeur>(`${this.baseUrl}/api/demandeur/updateDemandeurAndUtilisateur/${id}`, demandeur);
  }
  

  updateDemandeurUser(demandeurDTO: DemandeurDto): Observable<number> {
    return this.http.put<number>(`${this.baseUrl}/api/demandeur/updateDemandeurUser`, demandeurDTO);
  }

}
