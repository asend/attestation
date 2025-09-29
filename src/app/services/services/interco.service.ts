import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { RegistrationRequest, AuthenticationResponse } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IntercoService {

  private apiUrl = environment.apiUrl; // Remplacez par l'URL réelle de votre backend

  constructor(private http: HttpClient) {}

  registerUtilisateur(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/interco`, data);
  }


  
}
