/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { sendMailApprouve } from '../fn/mail/send-mail-approuve';
import { SendMailApprouve$Params } from '../fn/mail/send-mail-approuve';
import { sendMailRejectexterne } from '../fn/mail/send-mail-rejectexterne';
import { SendMailRejectexterne$Params } from '../fn/mail/send-mail-rejectexterne';
import { sendMailRejectInterne } from '../fn/mail/send-mail-reject-interne';
import { SendMailRejectInterne$Params } from '../fn/mail/send-mail-reject-interne';

@Injectable({ providedIn: 'root' })
export class MailService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `sendMailRejectInterne()` */
  static readonly SendMailRejectInternePath = '/api/mail/reject-interne/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `sendMailRejectInterne()` instead.
   *
   * This method doesn't expect any request body.
   */
  sendMailRejectInterne$Response(params: SendMailRejectInterne$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return sendMailRejectInterne(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `sendMailRejectInterne$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  sendMailRejectInterne(params: SendMailRejectInterne$Params, context?: HttpContext): Observable<number> {
    return this.sendMailRejectInterne$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `sendMailRejectexterne()` */
  static readonly SendMailRejectexternePath = '/api/mail/reject-externe/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `sendMailRejectexterne()` instead.
   *
   * This method doesn't expect any request body.
   */
  sendMailRejectexterne$Response(params: SendMailRejectexterne$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return sendMailRejectexterne(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `sendMailRejectexterne$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  sendMailRejectexterne(params: SendMailRejectexterne$Params, context?: HttpContext): Observable<number> {
    return this.sendMailRejectexterne$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `sendMailApprouve()` */
  static readonly SendMailApprouvePath = '/api/mail/approuve/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `sendMailApprouve()` instead.
   *
   * This method doesn't expect any request body.
   */
  sendMailApprouve$Response(params: SendMailApprouve$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return sendMailApprouve(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `sendMailApprouve$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  sendMailApprouve(params: SendMailApprouve$Params, context?: HttpContext): Observable<number> {
    return this.sendMailApprouve$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

}
