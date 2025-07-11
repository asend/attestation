// /* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * Global configuration
 */
@Injectable({
  providedIn: 'root',
})
export class ApiConfiguration {
  // rootUrl: string = 'http://localhost:8080';
  // rootUrl: string = 'https://api.demarche.mfprsp.com';
  rootUrl: string = environment.apiUrl;

}

/**
 * Parameters for `ApiModule.forRoot()`
 */
export interface ApiConfigurationParams {
  rootUrl?: string;
}
// 