import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class S3MetadataService {
  constructor(private http: HttpClient) {}

  getLastModified(url: string): Observable<Date | null> {
    // HEAD não é suportado pelo Angular HttpClient em todos os ambientes, então use GET com observe: 'response'
    return this.http.get(url, { observe: 'response' }).pipe(
      map(response => {
        const lastModified = response.headers.get('Last-Modified');
        return lastModified ? new Date(lastModified) : null;
      })
    );
  }
}