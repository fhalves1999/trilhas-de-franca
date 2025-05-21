import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StravaService {
  private baseUrl = 'https://www.strava.com/api/v3';
  private athleteId = '102459537';
  private accessToken = 'e56739853aa1fdecf2cafa446ef9e6451926e7c1';

  constructor(private http: HttpClient) {}

  getRoutes(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });

    return this.http.get(`${this.baseUrl}/athletes/${this.athleteId}/routes`, { headers });
  }
}
