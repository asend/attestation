import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Departement } from '../models/departement';
import { Region } from '../models/region';

@Injectable({
  providedIn: 'root'
})
export class RegionDepartementService {

  private apiUrl = environment.apiUrl; // Change l'URL si ton backend est hébergé ailleurs

  constructor(private http: HttpClient) {}

  getAllRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.apiUrl}/api/RegionDepartement`);
  }

  getDepartementsByRegionId(regionId: number): Observable<Departement[]> {
    return this.http.get<Departement[]>(`${this.apiUrl}/api/RegionDepartement/departemtnByRegion/${regionId}`);
  }
}
