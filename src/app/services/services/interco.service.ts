import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { RegistrationRequest, AuthenticationResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class IntercoService {

  private apiUrl = 'http://localhost:8080/api/interco'; // Remplacez par l'URL réelle de votre backend

  constructor(private http: HttpClient) {}

  registerUtilisateur(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }


  
}
