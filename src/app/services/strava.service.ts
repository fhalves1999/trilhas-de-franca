import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StravaService {
  // Use a URL do seu backend no Render
  private backendUrl = 'https://strava-trilhas-backend.onrender.com';
  private jsonUrl = 'https://trilhas-de-franca.s3.sa-east-1.amazonaws.com/trilhas-atleta-id-102459537.json';  

  constructor(private http: HttpClient) {}

  getRoutes(): Observable<any> {
    // return this.http.get(`${this.backendUrl}/api/strava/routes`);
    return this.http.get(this.jsonUrl);
  }

  getGpxFile(routeId: string): Observable<Blob> {
    return this.http.get(`${this.backendUrl}/api/strava/routes/${routeId}/gpx`, { responseType: 'blob' });
  }

  getRouteById(id: string): Observable<any> {
  return this.http.get(`/api/rotas/${id}`);
}

  downloadGpx(routeId: string, routeName: string) {
    this.getGpxFile(routeId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${routeName}.gpx`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erro ao baixar o arquivo GPX:', err);
      }
    });
  }

}
