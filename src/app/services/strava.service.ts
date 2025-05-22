import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StravaService {
  // Use a URL do seu backend no Render
  private backendUrl = 'https://strava-trilhas-backend.onrender.com';

  constructor(private http: HttpClient) {}

  getRoutes(): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/strava/routes`);
  }
}
