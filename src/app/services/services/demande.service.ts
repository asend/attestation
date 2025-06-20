/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { annuler } from '../fn/demande/annuler';
import { Annuler$Params } from '../fn/demande/annuler';
import { DemandeDto } from '../models/demande-dto';
import { demander } from '../fn/demande/demander';
import { Demander$Params } from '../fn/demande/demander';
import { eligible } from '../fn/demande/eligible';
import { Eligible$Params } from '../fn/demande/eligible';
import { findAll2 } from '../fn/demande/find-all-2';
import { FindAll2$Params } from '../fn/demande/find-all-2';
import { findAllDemande } from '../fn/demande/find-all-demande';
import { FindAllDemande$Params } from '../fn/demande/find-all-demande';
import { findAttestationName } from '../fn/demande/find-attestation-name';
import { FindAttestationName$Params } from '../fn/demande/find-attestation-name';
import { findByDemandeurId } from '../fn/demande/find-by-demandeur-id';
import { FindByDemandeurId$Params } from '../fn/demande/find-by-demandeur-id';
import { findDemandeActif } from '../fn/demande/find-demande-actif';
import { FindDemandeActif$Params } from '../fn/demande/find-demande-actif';
import { getAllDemande } from '../fn/demande/get-all-demande';
import { GetAllDemande$Params } from '../fn/demande/get-all-demande';
import { getById2 } from '../fn/demande/get-by-id-2';
import { GetById2$Params } from '../fn/demande/get-by-id-2';
import { getByQrCode } from '../fn/demande/get-by-qr-code';
import { GetByQrCode$Params } from '../fn/demande/get-by-qr-code';
import { getbyTab } from '../fn/demande/getby-tab';
import { GetbyTab$Params } from '../fn/demande/getby-tab';
import { parstatut } from '../fn/demande/parstatut';
import { Parstatut$Params } from '../fn/demande/parstatut';

@Injectable({ providedIn: 'root' })
export class DemandeService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `demander()` */
  static readonly DemanderPath = '/api/demande/demandez/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `demander()` instead.
   *
   * This method doesn't expect any request body.
   */
  demander$Response(params: Demander$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return demander(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `demander$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  demander(params: Demander$Params, context?: HttpContext): Observable<number> {
    return this.demander$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `getAllDemande()` */
  static readonly GetAllDemandePath = '/api/demande';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllDemande()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllDemande$Response(params?: GetAllDemande$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<DemandeDto>>> {
    return getAllDemande(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllDemande$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllDemande(params?: GetAllDemande$Params, context?: HttpContext): Observable<Array<DemandeDto>> {
    return this.getAllDemande$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<DemandeDto>>): Array<DemandeDto> => r.body)
    );
  }

  /** Path part for operation `getByQrCode()` */
  static readonly GetByQrCodePath = '/api/demande/qrcode/{code}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getByQrCode()` instead.
   *
   * This method doesn't expect any request body.
   */
  getByQrCode$Response(params: GetByQrCode$Params, context?: HttpContext): Observable<StrictHttpResponse<DemandeDto>> {
    return getByQrCode(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getByQrCode$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getByQrCode(params: GetByQrCode$Params, context?: HttpContext): Observable<DemandeDto> {
    return this.getByQrCode$Response(params, context).pipe(
      map((r: StrictHttpResponse<DemandeDto>): DemandeDto => r.body)
    );
  }

  /** Path part for operation `parstatut()` */
  static readonly ParstatutPath = '/api/demande/parstatut';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `parstatut()` instead.
   *
   * This method doesn't expect any request body.
   */
  parstatut$Response(params?: Parstatut$Params, context?: HttpContext): Observable<StrictHttpResponse<{
[key: string]: number;
}>> {
    return parstatut(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `parstatut$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  parstatut(params?: Parstatut$Params, context?: HttpContext): Observable<{
[key: string]: number;
}> {
    return this.parstatut$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
[key: string]: number;
}>): {
[key: string]: number;
} => r.body)
    );
  }

  /** Path part for operation `findAllDemande()` */
  static readonly FindAllDemandePath = '/api/demande/getStatut/{statut}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAllDemande()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllDemande$Response(params: FindAllDemande$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<DemandeDto>>> {
    return findAllDemande(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findAllDemande$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllDemande(params: FindAllDemande$Params, context?: HttpContext): Observable<Array<DemandeDto>> {
    return this.findAllDemande$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<DemandeDto>>): Array<DemandeDto> => r.body)
    );
  }

  /** Path part for operation `findAll2()` */
  static readonly FindAll2Path = '/api/demande/getDemande';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAll2()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAll2$Response(params?: FindAll2$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<DemandeDto>>> {
    return findAll2(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findAll2$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAll2(params?: FindAll2$Params, context?: HttpContext): Observable<Array<DemandeDto>> {
    return this.findAll2$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<DemandeDto>>): Array<DemandeDto> => r.body)
    );
  }

  /** Path part for operation `findByDemandeurId()` */
  static readonly FindByDemandeurIdPath = '/api/demande/findDemandeurById/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findByDemandeurId()` instead.
   *
   * This method doesn't expect any request body.
   */
  findByDemandeurId$Response(params: FindByDemandeurId$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<DemandeDto>>> {
    return findByDemandeurId(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findByDemandeurId$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findByDemandeurId(params: FindByDemandeurId$Params, context?: HttpContext): Observable<Array<DemandeDto>> {
    return this.findByDemandeurId$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<DemandeDto>>): Array<DemandeDto> => r.body)
    );
  }

  /** Path part for operation `eligible()` */
  static readonly EligiblePath = '/api/demande/eligible/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `eligible()` instead.
   *
   * This method doesn't expect any request body.
   */
  eligible$Response(params: Eligible$Params, context?: HttpContext): Observable<StrictHttpResponse<boolean>> {
    return eligible(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `eligible$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  eligible(params: Eligible$Params, context?: HttpContext): Observable<boolean> {
    return this.eligible$Response(params, context).pipe(
      map((r: StrictHttpResponse<boolean>): boolean => r.body)
    );
  }

  /** Path part for operation `getbyTab()` */
  static readonly GetbyTabPath = '/api/demande/demandebytab/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getbyTab()` instead.
   *
   * This method doesn't expect any request body.
   */
  getbyTab$Response(params: GetbyTab$Params, context?: HttpContext): Observable<StrictHttpResponse<{
[key: string]: Array<DemandeDto>;
}>> {
    return getbyTab(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getbyTab$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getbyTab(params: GetbyTab$Params, context?: HttpContext): Observable<{
[key: string]: Array<DemandeDto>;
}> {
    return this.getbyTab$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
[key: string]: Array<DemandeDto>;
}>): {
[key: string]: Array<DemandeDto>;
} => r.body)
    );
  }

  /** Path part for operation `getById2()` */
  static readonly GetById2Path = '/api/demande/demandeDetails/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getById2()` instead.
   *
   * This method doesn't expect any request body.
   */
  getById2$Response(params: GetById2$Params, context?: HttpContext): Observable<StrictHttpResponse<DemandeDto>> {
    return getById2(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getById2$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getById2(params: GetById2$Params, context?: HttpContext): Observable<DemandeDto> {
    return this.getById2$Response(params, context).pipe(
      map((r: StrictHttpResponse<DemandeDto>): DemandeDto => r.body)
    );
  }

  /** Path part for operation `findDemandeActif()` */
  static readonly FindDemandeActifPath = '/api/demande/demandeActif';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findDemandeActif()` instead.
   *
   * This method doesn't expect any request body.
   */
  findDemandeActif$Response(params?: FindDemandeActif$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<DemandeDto>>> {
    return findDemandeActif(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findDemandeActif$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findDemandeActif(params?: FindDemandeActif$Params, context?: HttpContext): Observable<Array<DemandeDto>> {
    return this.findDemandeActif$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<DemandeDto>>): Array<DemandeDto> => r.body)
    );
  }

  /** Path part for operation `findAttestationName()` */
  static readonly FindAttestationNamePath = '/api/demande/attestation/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAttestationName()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAttestationName$Response(params: FindAttestationName$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return findAttestationName(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findAttestationName$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAttestationName(params: FindAttestationName$Params, context?: HttpContext): Observable<string> {
    return this.findAttestationName$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `annuler()` */
  static readonly AnnulerPath = '/api/demande/annuler/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `annuler()` instead.
   *
   * This method doesn't expect any request body.
   */
  annuler$Response(params: Annuler$Params, context?: HttpContext): Observable<StrictHttpResponse<DemandeDto>> {
    return annuler(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `annuler$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  annuler(params: Annuler$Params, context?: HttpContext): Observable<DemandeDto> {
    return this.annuler$Response(params, context).pipe(
      map((r: StrictHttpResponse<DemandeDto>): DemandeDto => r.body)
    );
  }


  // private apiUrl = "http://localhost:8080/api/demande";

  private apiUrl = "https://api.demarche.mfprsp.com/api/demande";


  updateMotifRejet(id: number, motifRejet: string): Observable<number> {
    const payload = { motifrejet: motifRejet };
    const url = `${this.apiUrl}/update/${id}`;

    console.log("URL de la requête :", url); // Vérifie l'URL générée
    console.log("Payload envoyé :", payload); // Vérifie les données envoyées

    return this.http.put<number>(url, payload);
  }


  

}
