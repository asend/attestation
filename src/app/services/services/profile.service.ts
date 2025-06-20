/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { createProfile } from '../fn/profile/create-profile';
import { CreateProfile$Params } from '../fn/profile/create-profile';
import { findByProfile } from '../fn/profile/find-by-profile';
import { FindByProfile$Params } from '../fn/profile/find-by-profile';
import { getByCode } from '../fn/profile/get-by-code';
import { GetByCode$Params } from '../fn/profile/get-by-code';
import { ProfileDto } from '../models/profile-dto';
import { updateProfile } from '../fn/profile/update-profile';
import { UpdateProfile$Params } from '../fn/profile/update-profile';

@Injectable({ providedIn: 'root' })
export class ProfileService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `updateProfile()` */
  static readonly UpdateProfilePath = '/api/profile/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateProfile()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateProfile$Response(params: UpdateProfile$Params, context?: HttpContext): Observable<StrictHttpResponse<ProfileDto>> {
    return updateProfile(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `updateProfile$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateProfile(params: UpdateProfile$Params, context?: HttpContext): Observable<ProfileDto> {
    return this.updateProfile$Response(params, context).pipe(
      map((r: StrictHttpResponse<ProfileDto>): ProfileDto => r.body)
    );
  }

  /** Path part for operation `createProfile()` */
  static readonly CreateProfilePath = '/api/profile/createProfile';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createProfile()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createProfile$Response(params: CreateProfile$Params, context?: HttpContext): Observable<StrictHttpResponse<ProfileDto>> {
    return createProfile(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createProfile$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createProfile(params: CreateProfile$Params, context?: HttpContext): Observable<ProfileDto> {
    return this.createProfile$Response(params, context).pipe(
      map((r: StrictHttpResponse<ProfileDto>): ProfileDto => r.body)
    );
  }

  /** Path part for operation `findByProfile()` */
  static readonly FindByProfilePath = '/api/profile/getByProfile/{code}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findByProfile()` instead.
   *
   * This method doesn't expect any request body.
   */
  findByProfile$Response(params: FindByProfile$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<ProfileDto>>> {
    return findByProfile(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findByProfile$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findByProfile(params: FindByProfile$Params, context?: HttpContext): Observable<Array<ProfileDto>> {
    return this.findByProfile$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<ProfileDto>>): Array<ProfileDto> => r.body)
    );
  }

  /** Path part for operation `getByCode()` */
  static readonly GetByCodePath = '/api/profile/code/{code}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getByCode()` instead.
   *
   * This method doesn't expect any request body.
   */
  getByCode$Response(params: GetByCode$Params, context?: HttpContext): Observable<StrictHttpResponse<ProfileDto>> {
    return getByCode(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getByCode$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getByCode(params: GetByCode$Params, context?: HttpContext): Observable<ProfileDto> {
    return this.getByCode$Response(params, context).pipe(
      map((r: StrictHttpResponse<ProfileDto>): ProfileDto => r.body)
    );
  }

}
